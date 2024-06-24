import React, { useEffect, useState } from "react";
import { useLayout } from "../../../context/LayoutContext";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import OcupacionesApi from "../../../api/Ocupaciones.api";
import ProcedenciaApi from "../../../api/Procedencia.api";
import hospitalesApi from "../../../api/Hospitales.api";
import usuarioApi from "../../../api/User.api";
import UserApi from "../../../api/User.api";
import personaApi from "../../../api/Persona.api";
import { getUserFromToken } from "../../../utilities/auth.utils";

import {
  Card,
  DatePicker,
  ConfigProvider,
  Flex,
  Input,
  Col,
  Row,
  Select,
  Button,
} from "antd";
import {
  LockOutlined,
  PushpinOutlined,
  PhoneOutlined,
  IdcardOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Meta } = Card;
const { TextArea } = Input;

dayjs.extend(customParseFormat);

const styleIconInput = { fontSize: 24, color: "#dedede", paddingRight: 10 };

const dateFormat = "YYYY-MM-DD";
const telFormat = /\d{4}-\d{4}/;
const dniFormat = /^\d{4}-\d{4}-\d{5}$/;

const CaraEspecial = ["!", "@", "#", "$", "^", "&", "*"];

const lugar = [
  { value: 1, label: "SPS" },
  { value: 2, label: "TGU" },
];

const generos = [
  { value: 1, label: "Femenino" },
  { value: 2, label: "Masculino" },
];
const roles = [
  { value: 1, label: "Administrador" },
  { value: 2, label: "Usuario" },
];

function CrearUsuarios() {
  //para dropbox & calendario de procedencia y ocupaciones
  const [ocupaciones, setOcupaciones] = useState([]);
  const [procedencias, setProcedencias] = useState([]);

  const [searchOcupacion, setSearchOcupacion] = useState("");
  const [searchProcedencia, setSearchProcedencia] = useState("");

  const loadOcupaciones = async () => {
    try {
      const response = await OcupacionesApi.getOcupacionesRequest();

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar las ocupaciones");
      }

      if (response.status >= 200 && response.status < 300) {
        setOcupaciones(
          response.data.map((e) => ({
            value: e.id_ocupacion,
            label: e.descripcion,
          }))
        );
      } else {
        // deberia lanzar un error
        throw new Error("No se pudo cargar las ocupaciones");
      }
    } catch (error) {
      // deberia lanzar una notificacion para el eerorr
      console.error(error);
    }
  };

  const loadProcedencias = async () => {
    try {
      const response = await ProcedenciaApi.getProcedenciasRequest();

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar las procedencias");
      }

      if (response.status >= 200 && response.status < 300) {
        setProcedencias(
          response.data.map((e) => ({
            value: e.id_procedencia,
            label: e.departamento + ", " + e.municipio,
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadHospitales = async () => {
    try {
      const response = await hospitalesApi.getHospitalRequest();

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar las Hospitales");
      }

      if (response.status >= 200 && response.status < 300) {
        setHospitales(
          response.data.map((e) => ({
            value: e.id_hospital,
            label: e.nombre + " , " + e.direccion,
          }))
        );
      } else {
        // deberia lanzar un error
        throw new Error("No se pudo cargar los hospitales");
      }
    } catch (error) {
      // deberia lanzar una notificacion para el eerorr
      console.error(error);
    }
  };

  const handleObtenerFechaNacimiento = () => {
    if (isEditable) {
      return user.fecha_nacimiento
        ? dayjs(user.fecha_nacimiento, dateFormat)
        : "";
    }
  };

  const validarFormatoProcedencia = () => {
    if (searchProcedencia === "") {
      openNotification(
        2,
        "Procedencia",
        "No puede dejar el campo de procedencia vacio"
      );

      return false;
    }

    if (searchProcedencia.split(",").length !== 2) {
      openNotification(
        2,
        "Procedencia",
        "El formato de la procedencia no es valido"
      );

      return false;
    }

    return true;
  };

  const handleCrearProcedencia = async () => {
    setLoading(true);

    if (validarFormatoProcedencia()) {
      // Deberiamos llamar a la api para crear la procedencia;

      try {
        const procedenciaFormat = searchProcedencia.split(",");

        const response = await ProcedenciaApi.postProcedenciaRequest({
          departamento: procedenciaFormat[0],
          municipio: procedenciaFormat[1],
        });

        if (!response || response.status !== 201) {
          // Deberia lanzar una notificacion de error
          openNotification(2, "Error", "No se pudo crear la procedencia");
          return;
        }

        const id_procedencia_creada = response.data.id_procedencia;
        openNotification(
          1,
          "Procedencia Creada",
          "Se creo la procedencia correctamente"
        );

        handleSetChangeUser("id_procedencia", id_procedencia_creada);

        loadProcedencias();

        document.getElementById("selectProcedencia").blur();

        // Validar que retorna porque tenemos que asignarle ese id al user
      } catch (error) {
        openNotification(3, "Error", error);
      }
    }

    setLoading(false);
  };

  const handleCrearOcupacion = async () => {
    // Deberiamos llamar a la api para crear la ocupacion;

    setLoading(true);
    try {
      const response = await OcupacionesApi.postOcupacionRequest({
        descripcion: searchOcupacion,
      });

      if (!response || response.status !== 201) {
        // Deberia lanzar una notificacion de error
        openNotification(2, "Error", "No se pudo crear la ocupacion");
        setLoading(false);
        return;
      }

      const id_ocupacion_creada = response.data.id_ocupacion;
      openNotification(
        0,
        "Ocupacion Creada",
        "Se creo la ocupacion correctamente"
      );

      loadOcupaciones();

      handleSetChangeUser("id_ocupacion", id_ocupacion_creada);

      document.getElementById("selectOcupacion").blur();

      // Validar que retorna porque tenemos que asignarle ese id al user
    } catch (error) {}

    setLoading(false);
  };

  //para dropbox hospital
  const [hospitales, setHospitales] = useState([]);
  const [searchHospital, setSearchHospital] = useState("");

  const userData = getUserFromToken();
  const rolLog = userData.role;

  const [loadind, setLoading] = useState(false);

  const validarFormatoHospital = () => {
    const hospitalFormat = searchHospital.split(",");

    if (hospitalFormat.length !== 2) {
      // Deberia lanzar una notificacion de error
      openNotification(
        2,
        "Hospital Incorrecta",
        "Formato de hospital invalido\n Ejemplo: Centro de Salud, Barrio Lopez Calle 1234"
      );
      return false;
    }

    return true;
  };

  const handleCrearHospital = async () => {
    setLoading(true);
    if (validarFormatoHospital()) {
      // Deberiamos llamar a la api para crear la procedencia;

      try {
        const hospitalFormat = searchHospital.split(",");

        const response = await hospitalesApi.postHospitalesRequest({
          nombre: hospitalFormat[0],
          direccion: hospitalFormat[1],
        });

        if (!response || response.status !== 201) {
          // Deberia lanzar una notificacion de error
          setLoading(false);
          openNotification(2, "Error", "No se pudo crear el hospital");
          return;
        }

        const id_hospital_creado = response.data.id_hospital;
        openNotification(
          1,
          "Hospital Creado",
          "Se creo el hospital correctamente"
        );

        loadHospitales();

        handleSetChangeUser("id_hospital", id_hospital_creado);

        document.getElementById("selectHospital").blur();

        // Validar que retorna porque tenemos que asignarle ese id al user
      } catch (error) {
        openNotification(3, "Error", error);
      }
    }

    setLoading(false);
  };

  //para la contraseña
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordRegex = /^.{9,}$/;

  //para los pop ups & errores
  const { openNotification, setCurrentPath } = useLayout();

  const [isEditable, setIsEditable] = useState(true);

  const [existPerson, setExistPerson] = useState(false);
  const [existUser, setExistUser] = useState(false);

  //para user & persona

  /*
    para manejar la info del usuario los componentes requieren de un objeto
    con los siguiente atributos

    OJO no todos los componentes utilizan todos estos atributos

    const user = 
    {
          dni: value,
          id_ocupacion : value,
          direccion : value,
          fecha_nacimiento : value,
          genero : value (este se debe formatear para que sea un numero que represente el valor en el select),
          id_procedencia : value (este se debe formatear para que sea un numero que represente el valor en el select),
          primer_nombre : value,
          segundo_nombre,
          segundo_apellido,
          primer_apellido,
          segundo_apellido,
          telefono,
          nickname,
          rol, (este se debe formatear para que sea un numero que represente el valor en el select)
          contrasena,
         confirmContrasena 
      
    }

  */

  const [user, setUser] = useState({});

  const ResetearAtributos = () => {
    const userVacio = {
      dni: "",
      id_ocupacion: null,
      direccion: "",
      fecha_nacimiento: "",
      genero: null,
      id_procedencia: null,
      primer_nombre: "",
      segundo_nombre: "",
      segundo_apellido: "",
      primer_apellido: "",
      segundo_apellido: "",
      telefono: "",
      nickname: "",
      rol: null,
      contrasena: "",
      confirmContrasena: "",
      id_lugar: null,
    };

    setUser(userVacio);
  };

  const searchDni = async (in_dni) => {
    console.log("Buscando " + in_dni);
    cargarInformacion(in_dni);
  };

  const cargarInformacion = async (in_dni) => {
    try {
      const response = await personaApi.getPersonaByDniRequest(in_dni);

      if (!response) {
        // deberia lanzar un erro
        setExistPerson(false);
        setExistUser(false);
        return;
      }

      const response2 = await UserApi.getUserByIdPersonaRequest(
        response.data.id_persona
      );

      if (response.status >= 200 && response.status < 300) {
        setExistPerson(true);
        openNotification(
          2,
          "Persona ya Existe",
          "La persona que ingreso ya existe."
        );

        if (response2 && response2.status >= 200 && response2.status < 300) {
          openNotification(
            2,
            "Ya Tiene Usuario",
            "La persona que ingreso ya tiene un usuario: " +
              response2.data.nickname
          );

          setExistUser(true);

          ResetearAtributos();
          return;
        } else {
          setExistUser(false);
        }

        const {
          id_persona,
          dni,
          id_ocupacion,
          direccion,
          fecha_nacimiento,
          genero,
          id_procedencia,
          primer_nombre,
          segundo_nombre,
          segundo_apellido,
          primer_apellido,
          telefono,
          id_lugar,
        } = response.data;

        const changeuser = {
          id_persona,
          dni,
          id_ocupacion,
          id_procedencia,
          direccion,
          fecha_nacimiento,
          genero: genero === "FEMENINO" ? 1 : 2,
          primer_apellido,
          segundo_apellido,
          primer_nombre,
          segundo_nombre,
          telefono,
          id_lugar,
        };

        setUser(changeuser);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //hace cambios de formato
  const handleSetChangeUser = (key, value, previousValue = null) => {
    let newValue = value;

    switch (key) {
      case "dni":
        if (previousValue !== null && value.length > previousValue.length) {
          if (/^\d{4}$/.test(value) || /^\d{4}-\d{4}$/.test(value)) {
            newValue = value + "-";
          }
        }

        if (/^\d{4}-\d{4}-\d{5}$/.test(newValue)) {
          searchDni(newValue);
        }
        break;

      case "telefono":
        if (
          previousValue !== null &&
          value.length > previousValue.length &&
          value.length === 4
        ) {
          if (/\d{4}/.test(value)) {
            newValue = value + "-";
          }
        }
        break;

      default:
        break;
    }

    setUser({ ...user, [key]: newValue });
  };

  const validarNicknameExists = async (nickname) => {
    const response = await usuarioApi.getUserByNicknameRequest(nickname);

    if (response) {
      if (response.status === 404) {
        return true;
      }
    }

    return false;
  };

  const ValidaCampoContra = (password) => {
    let Especiales = false;

    if (password.length >= 8) {
      for (let i = 0; i < password.length; i++) {
        if (password[i] === " ") {
          openNotification(
            2,
            "Contraseña",
            "La contraseña no puede tener espacios"
          );
          return false;
        }
        for (let j = 0; j < CaraEspecial.length; j++) {
          if (password[i] === CaraEspecial[j]) {
            Especiales = true;
          }
        }
      }
      if (Especiales) return true;
    } else {
      openNotification(
        2,
        "Error",
        "La contraseña debe tener al menos 8 caracteres"
      );
    }

    openNotification(
      2,
      "Error",
      "La contraseña debe tener un caracter especial"
    );

    return false;
  };

  const validarCampos = async () => {
    for (const [key, value] of Object.entries(user)) {
      if (
        value === "" &&
        key !== "segundo_nombre" &&
        key !== "segundo_apellido"
      ) {
        openNotification(2, "Campos Vacios", "No puede dejar campos vacios");
        return false;
      }

      if (key === "telefono" && value.match(telFormat) === null) {
        openNotification(2, "Telefono", "El formato del telefono no es valido");
        return false;
      }

      if (key === "nickname") {
        if (!(await validarNicknameExists(value))) {
          openNotification(2, "Usuario Repetido", "El usuario debe ser unico");
          return false;
        }
      }

      if (key === "dni" && value.match(dniFormat) === null) {
        openNotification(2, "DNI", "El formato del DNI no es valido");
        return false;
      }
    }

    if (user.contrasena !== user.confirmContrasena) {
      openNotification(2, "Contraseña", "Las contraseñas no coinciden");
      return false;
    }

    if (!ValidaCampoContra(user.contrasena)) {
      return false;
    }

    return true;
  };

  //agarra el submit aqui va a mandar
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const persona = {
      dni: user.dni,
      primer_nombre: user.primer_nombre,
      segundo_nombre: user.segundo_nombre,
      primer_apellido: user.primer_apellido,
      segundo_apellido: user.segundo_apellido,
      id_ocupacion: user.id_ocupacion,
      genero: user.genero === 1 ? "FEMENINO" : "MASCULINO",
      fecha_nacimiento: user.fecha_nacimiento,
      telefono: user.telefono,
      direccion: user.direccion,
      id_procedencia: user.id_procedencia,
      id_lugar: user.id_lugar,
    };

    const usuario = {
      id_persona: user.id_persona,
      nickname: user.nickname,
      contrasena: user.contrasena,
      rol: user.rol === 1 ? "admin" : "usuario",
      id_hospital: user.id_hospital,
    };

    if (await validarCampos()) {
      if (!existUser) {
        if (!existPerson) {
          try {
            const response = await UserApi.postUserPersonaRequest(
              usuario,
              persona
            );

            if (!response || response.status !== 201) {
              ResetearAtributos();
              openNotification(3, "Error", "No se pudo crear el usuario");
              return;
            }

            ResetearAtributos();

            openNotification(1, "Exito", "Se pudo crear el usuario");
            setLoading(false);
            return;
          } catch (error) {
            openNotification(3, "Error", error);
          }
        } else {
          openNotification(
            2,
            "Persona ya Existe",
            "La persona que ingreso ya existe."
          );

          try {
            const usuarioP = {
              id_persona: user.id_persona,
              nickname: user.nickname,
              contrasena: user.contrasena,
              rol: user.rol === 1 ? "admin" : "usuario",
              id_hospital: user.id_hospital,
            };

            const responseUN = await UserApi.postUserRequest(usuarioP);

            if (!responseUN || responseUN.status !== 201) {
              openNotification(3, "Error", "No se pudo crear el usuario");

              setLoading(false);
              return;
            }

            ResetearAtributos();

            openNotification(1, "Exito", "Se pudo crear el usuario");
            return;
          } catch (error) {
            openNotification(3, "Error", error);
          }
        }
      } else {
        ResetearAtributos();
        openNotification(
          2,
          "Ya Tiene un Usuario",
          "La persona que ingreso ya tiene un usuario."
        );
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOcupaciones();
    loadProcedencias();
    loadHospitales();

    ResetearAtributos();
    cargarInformacion();
    setCurrentPath("/ Mantenimiento / Usuarios / Crear Usuario");
  }, []);

  const { isXS } = useLayout();

  return (
    <Flex vertical>
      <ConfigProvider
        input={{ className: "cursor-default" }}
        theme={{
          token: {
            colorPrimaryHover: "#92e1b4",
            colorPrimary: "#77d9a1",
            colorText: "#626262",
            colorBgContainerDisabled: "#fcfcfc",
            colorTextDisabled: "#939393",
          },
          Button: {
            colorPrimary: "#77d9a1",
            colorPrimaryHover: "#5fae81",
            colorPrimaryActive: "#9bd8e5",
            defaultHoverColor: "#fdfdfd",
          },
          components: {
            Input: {},
          },
        }}
      >
        <Card style={{ marginTop: 16 }} className="shadow-#1">
          <Meta title="Informacion Personal" />

          <Row gutter={25} style={{ marginTop: 20 }}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<IdcardOutlined style={styleIconInput} />}
                size="large"
                placeholder="No. de Identidad"
                maxLength={15}
                type="text"
                style={{ height: "100%" }}
                value={user.dni}
                onChange={(e) => {
                  handleSetChangeUser("dni", e.target.value, user.dni);
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                id="selectOcupacion"
                showSearch
                onSearch={(e) => {
                  setSearchOcupacion(e);
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                placeholder="Ocupacion"
                size="large"
                notFoundContent={
                  <Button loading={loadind} onClick={handleCrearOcupacion}>
                    Crear Ocupacion
                  </Button>
                }
                options={ocupaciones}
                style={{ width: "100%", height: "100%" }}
                value={user.id_ocupacion}
                onChange={(e) => {
                  handleSetChangeUser("id_ocupacion", e);
                }}
              ></Select>
            </Col>
          </Row>
          <Row gutter={25}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<UserOutlined style={styleIconInput} />}
                size="large"
                disabled={isEditable ? false : true}
                placeholder="Primer Nombre"
                type="text"
                style={{ height: "100%" }}
                value={user.primer_nombre}
                onChange={(e) => {
                  handleSetChangeUser("primer_nombre", e.target.value);
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<UserOutlined style={styleIconInput} />}
                size="large"
                placeholder="Segundo Nombre"
                type="text"
                style={{ height: "100%" }}
                value={user.segundo_nombre}
                onChange={(e) => {
                  handleSetChangeUser("segundo_nombre", e.target.value);
                }}
              />
            </Col>
          </Row>
          <Row gutter={25}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<UserOutlined style={styleIconInput} />}
                size="large"
                disabled={isEditable ? false : true}
                placeholder="Primer Apellido"
                type="text"
                style={{ height: "100%" }}
                value={user.primer_apellido}
                onChange={(e) => {
                  handleSetChangeUser("primer_apellido", e.target.value);
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<UserOutlined style={styleIconInput} />}
                size="large"
                disabled={isEditable ? false : true}
                placeholder="Segundo Apellido"
                type="text"
                style={{ height: "100%" }}
                value={user.segundo_apellido}
                onChange={(e) => {
                  handleSetChangeUser("segundo_apellido", e.target.value);
                }}
              />
            </Col>
          </Row>
          <Row gutter={25}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                placeholder="Genero"
                size="large"
                options={generos}
                style={{ width: "100%", height: "100%" }}
                value={user.genero}
                onChange={(e) => {
                  handleSetChangeUser("genero", e);
                }}
              ></Select>
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                placeholder="Lugar"
                size="large"
                options={lugar}
                style={{ width: "100%", height: "100%" }}
                value={user.id_lugar}
                onChange={(e) => {
                  handleSetChangeUser("id_lugar", e);
                }}
              ></Select>
            </Col>
          </Row>
          <Row>
            <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
              <Select
                id="selectProcedencia"
                showSearch
                onSearch={(e) => {
                  setSearchProcedencia(e);
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                notFoundContent={
                  <Button onClick={handleCrearProcedencia} loading={loadind}>
                    Crear Procedencia
                  </Button>
                }
                placeholder="Procedencia"
                disabled={isEditable ? false : true}
                style={{ width: "100%", height: "100%" }}
                options={procedencias}
                size="large"
                value={user.id_procedencia}
                onChange={(e) => {
                  handleSetChangeUser("id_procedencia", e);
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col flex={"100%"} style={{ marginBottom: 25, height: "auto" }}>
              <TextArea
                count={{ show: true }}
                disabled={isEditable ? false : true}
                prefix={<PushpinOutlined />}
                placeholder="Direccion Exacta"
                maxLength={150}
                autoSize={{ minRows: 2, maxRows: 4 }}
                value={user.direccion}
                onChange={(e) => {
                  handleSetChangeUser("direccion", e.target.value);
                }}
              />
            </Col>
          </Row>
          <Row gutter={25}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <DatePicker
                style={{ height: "100%", width: "100%" }}
                placeholder="Fecha de nacimiento"
                disabled={isEditable ? false : true}
                format={dateFormat}
                className="my-datepicker"
                value={handleObtenerFechaNacimiento()}
                onChange={(e, d) => {
                  handleSetChangeUser("fecha_nacimiento", d);
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<PhoneOutlined style={styleIconInput} />}
                size="large"
                disabled={isEditable ? false : true}
                placeholder="Telefono"
                maxLength={9}
                type="text"
                style={{ height: "100%" }}
                value={user.telefono}
                onChange={(e) => {
                  handleSetChangeUser(
                    "telefono",
                    e.target.value,
                    user.telefono
                  );
                }}
              />
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: 16 }} className="shadow-#1">
          <Meta title="Rol y Usuario" />

          <Row gutter={25} style={{ marginTop: 20 }}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<UserOutlined style={styleIconInput} />}
                size="large"
                placeholder="Usuario"
                type="text"
                style={{ height: "100%" }}
                value={user.nickname}
                disabled={isEditable ? false : true}
                onChange={(e) => {
                  handleSetChangeUser("nickname", e.target.value);
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                placeholder="Rol"
                size="large"
                options={roles}
                style={{ width: "100%", height: "100%" }}
                defaultValue={user.rol}
                value={user.rol}
                disabled={isEditable ? false : true}
                onChange={(e) => {
                  handleSetChangeUser("rol", e);
                }}
              ></Select>
            </Col>
          </Row>

          <Row gutter={25} style={{ marginTop: 20 }}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                id="selectHospital"
                showSearch
                searchValue={searchHospital}
                onSearch={(e) => {
                  setSearchHospital(e);
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                notFoundContent={
                  <Button
                    loading={loadind}
                    onClick={(e) => {
                      handleCrearHospital();
                    }}
                  >
                    Crear Hospital
                  </Button>
                }
                placeholder="Hospital"
                disabled={isEditable ? false : true}
                style={{ width: "100%", height: "100%" }}
                options={hospitales}
                size="large"
                value={user.id_hospital}
                onChange={(e) => {
                  handleSetChangeUser("id_hospital", e);
                }}
              />
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: 16 }} className="shadow-#1">
          <Meta title="Contraseña" />
          <Row gutter={25} style={{ marginTop: 20 }}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<LockOutlined style={styleIconInput} />}
                size="large"
                placeholder="Contraseña"
                type="password"
                style={{ height: "100%" }}
                value={user.contrasena}
                onChange={(e) => {
                  handleSetChangeUser("contrasena", e.target.value);
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Input
                prefix={<LockOutlined style={styleIconInput} />}
                size="large"
                placeholder="Confirmar Contraseña"
                type="password"
                style={{ height: "100%" }}
                value={user.confirmContrasena}
                onChange={(e) => {
                  handleSetChangeUser("confirmContrasena", e.target.value);
                }}
              />
            </Col>
          </Row>

          <Row style={{ marginTop: 1 }}>
            <Meta title="Recuerde: " />
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Meta description=" => Debe contener como minimo 8 caracteres " />
          </Row>
          <Row style={{ marginTop: 20, marginBottom: 30 }}>
            <Meta description=" => Debe contener un caracter especial como (! @ # $ % ^ & *) " />
          </Row>

          <div
            style={{
              display: "flex",
              gap: "large",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: "#77d9a1",
                    colorPrimaryHover: "#5fae81",
                    colorPrimaryActive: "#9bd8e5",
                    defaultHoverColor: "#fdfdfd",
                  },
                },
              }}
            >
              <Button
                loading={loadind}
                type="primary"
                size={"large"}
                onClick={handleSubmit}
                style={{ marginRight: "20px" }}
              >
                Registrar
              </Button>
            </ConfigProvider>

            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: "#fa8787",
                    colorPrimaryHover: "#ea8383",
                    colorPrimaryBorder: "#ffff",
                  },
                },
              }}
            >
              <Button
                type="primary"
                size={"large"}
                onClick={() => {
                  ResetearAtributos();
                }}
              >
                Cancelar
              </Button>
            </ConfigProvider>
          </div>
        </Card>
      </ConfigProvider>
    </Flex>
  );
}

export default CrearUsuarios;
