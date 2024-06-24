import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../context/LayoutContext";
//Date Imports
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
//api imports
import OcupacionesApi from "../../api/Ocupaciones.api";
import ProcedenciaApi from "../../api/Procedencia.api";
import ReservacionesApi from "../../api/Reservaciones.api";

import camaApi from "../../api/Cama.api";
import personaApi from "../../api/Persona.api";
import solicitudApi from "../../api/Solicitud.api";
import huespedApi from "../../api/Huesped.api";
import pacienteApi from "../../api/Paciente.api";
import pacienteHuespedApi from "../../api/pacienteHuesped.api";

import { getUserFromToken } from "../../utilities/auth.utils";
//antd imports
import {
  Card,
  DatePicker,
  ConfigProvider,
  Flex,
  Layout,
  Input,
  Col,
  Row,
  Select,
  Button,
  Modal,
  message,
  Checkbox,
} from "antd";
//antd icon imports
import {
  LockOutlined,
  PushpinOutlined,
  PhoneOutlined,
  IdcardOutlined,
  UserOutlined,
  FileSearchOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Disponibilidad from "../../components/Disponiblidad/Disponibilidad";
import InformacionPaciente from "../../components/Hospedaje/InformacionPaciente";
import PatronoHuesped from "../../components/Hospedaje/PatronoHuesped";

import ListaSolicitudApi from "../../api/ListaSolicitud.api";

import PatronoApi from "../../api/Patrono.api";
import ListaNegraApi from "../../api/ListaNegra.api";

const { Meta } = Card;
const { TextArea } = Input;
const { Content } = Layout;
const { Option } = Select;

dayjs.extend(customParseFormat);

const styleIconInput = { fontSize: 24, color: "#dedede", paddingRight: 10 };

//Regex formats
const dateFormat = "YYYY-MM-DD";
const telFormat = /\d{4}-\d{4}/;
const dniFormat = /^\d{4}-\d{4}-\d{5}$/;

const regexFecha = /^\d{4}-\d{2}-\d{2}$/;

const generos = [
  { value: 1, label: "Femenino" },
  { value: 2, label: "Masculino" },
];

function Hospedar() {
  //para drop options de ocupaciones y procedencias
  const [ocupaciones, setOcupaciones] = useState([]);
  const [procedencias, setProcedencias] = useState([]);
  const [loading, setLoading] = useState(false);
  //para los pop ups & errores
  const { openNotification, setCurrentPath } = useLayout();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditable, setIsEditable] = useState(true);
  //c onst [existPerson, setExistPerson] = useState(false);
  const [existHospedado, setExistHospedado] = useState(false);
  const [hospedado, setHospedado] = useState({});
  const [paciente, setPaciente] = useState({});
  const [acompanante, setAcompanante] = useState(false);

  const [searchOcupacion, setSearchOcupacion] = useState("");
  const [searchProcedencia, setSearchProcedencia] = useState("");

  const [camasDisponiblesHombres, setCamasDisponiblesHombres] = useState(0);
  const [camasDisponiblesMujeres, setCamasDisponiblesMujeres] = useState(0);

  const [noSolicitudesHombrs, setNoSolicitudesHombres] = useState(0);
  const [noSolicitudesMujeres, setNoSolicitudesMujeres] = useState(0);

  const [contenModal, setContentModal] = useState("");

  const [contentModalNegra, setContentModalNegra] = useState("");
  const [listaNegraModalVisible, setListaNegraModalVisible] = useState(false);

  const [observacionReservacion, setObservacionReservacion] = useState("");

  const navigate = useNavigate();

  const { userLog } = useLayout();

  const usuario = getUserFromToken();

  const loadCamasDisponibles = async () => {
    try {
      const response = await camaApi.getCamasByDisponibleRequest();

      if (!response || response.status < 200 || response.status >= 300) {
        navigate("/error");
        return;
      }

      const camasHombre = response.data.data.filter(
        (cama) => cama.Habitacion.genero === "MASCULINO" && cama.Habitacion.id_lugar === userLog.id_lugar
      );

      const camasMujer = response.data.data.filter(
        (cama) => cama.Habitacion.genero === "FEMENINO" && cama.Habitacion.id_lugar === userLog.id_lugar
      );

      setCamasDisponiblesHombres(camasHombre.length);
      setCamasDisponiblesMujeres(camasMujer.length);
    } catch (error) {
      navigate("/error");
    }
  };

  const loadNoSolicitudes = async () => {
    try {
      const usuario = getUserFromToken();
      console.log(usuario);
      const response = await ListaSolicitudApi.getListaSolicitudTotalRequest(
        usuario.id_lugar
      );

      if (!response || response.status < 200 || response.status >= 300) {
        navigate("/error");

        return;
      }

      const noSolicitudesHombres = response.data.filter(
        (solicitud) =>
          solicitud.PacienteHuesped.Huesped.Persona.genero === "MASCULINO"
      );

      const noSolicitudesMujeres = response.data.filter(
        (solicitud) =>
          solicitud.PacienteHuesped.Huesped.Persona.genero === "FEMENINO"
      );

      setNoSolicitudesHombres(noSolicitudesHombres.length);

      setNoSolicitudesMujeres(noSolicitudesMujeres.length);
    } catch (error) {
      navigate("/error");
    }
  };

  //Cargar las ocupaciones
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

  //Cargar las procedencias
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

  const handleObtenerFechaNacimiento = () => {
    if (isEditable) {
      return hospedado.fecha_nacimiento
        ? dayjs(hospedado.fecha_nacimiento, dateFormat)
        : "";
    }
  };

  const handleObtenerFechaPaciente = () => {
    if (isEditable) {
      return paciente.fecha_nacimiento
        ? dayjs(paciente.fecha_nacimiento, dateFormat)
        : "";
    }
  };

  const handleObtenerFechaAcompanante = () => {
    if (isEditable) {
      return acompanante.fecha_nacimiento
        ? dayjs(acompanante.fecha_nacimiento, dateFormat)
        : "";
    }
  };

  const handleCrearOcupacion = async (persona) => {
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

      if (persona === 0)
        handleSetChangeUser("id_ocupacion", id_ocupacion_creada);

      if (persona === 1)
        handleSetChangePaciente("id_ocupacion", id_ocupacion_creada);

      if (persona === 2)
        handleSetChangeAcompanante("id_ocupacion", id_ocupacion_creada);

      document.getElementById("selectOcupacion").blur();
      document.getElementById("selectOcupacionPaciente").blur();
      document.getElementById("selectOcupacionAcompanante").blur();

      // Validar que retorna porque tenemos que asignarle ese id al user
    } catch (error) {}

    setLoading(false);
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

      console.log("Paso formato");
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

        loadProcedencias();

        handleSetChangeUser("id_procedencia", id_procedencia_creada);

        // Validar que retorna porque tenemos que asignarle ese id al user
      } catch (error) {
        openNotification(3, "Error", error);
      }
    }

    setLoading(false);
  };

  const ResetearAtributos = () => {
    const hospedadoVacio = {
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
      fecha_entrada: "",
      fecha_salida: "",
      id_lugar: usuario.id_lugar,
      observacion_reservacion: "",
      id_patrono: null,
      dni_afiliado: "",
      nombre_afiliado: "",
    };
    const pacienteVacio = {
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
      becada: false,
      id_lugar: usuario.id_lugar,
      id_hospital: null,
      id_piso: null,
      id_sala: null,
    };
    setHospedado(hospedadoVacio);
    setPaciente(pacienteVacio);
  };

  const resetearAcompanante = () => {
    const acompananteVacio = {
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
      id_lugar: usuario.id_lugar,
    };
    setAcompanante(acompananteVacio);
  };

  const searchDni = async (in_dni, persona) => {
    cargarInformacionHospedado(in_dni, persona);
  };

  const isInListaNegar = async (in_dni) => {
    try {
      const response = await personaApi.getPersonaByDniRequest(in_dni);

      if (response && response.status >= 200 && response.status < 300) {
        const { id_persona, dni, primer_nombre, primer_apellido } =
          response.data;

        const responseListaNegra = await ListaNegraApi.getListaNegraByIdPerson(
          id_persona
        );

        if (
          response &&
          responseListaNegra.status >= 200 &&
          responseListaNegra.status < 300
        ) {
          const razon = responseListaNegra.data.Reglamento.descripcion_regla;

          setContentModalNegra(
            <div>
              <Flex
                justify="center"
                align="center"
                style={{ marginBottom: 10, marginTop: 20 }}
              >
                <p className="px-3 py-1 bg-red-400 text-white-100 rounded-tl-md rounded-bl-md">
                  DNI:{" "}
                </p>
                <p className="px-3 py-1 border border-red-400  text-red-400 rounded-tr-md rounded-br-md">
                  {dni}
                </p>
              </Flex>

              <Flex
                justify="center"
                align="center"
                style={{ marginBottom: 30 }}
              >
                <p className="px-3 py-1 bg-red-400 text-white-100 rounded-tl-md rounded-bl-md">
                  Nombre:
                </p>
                <p className="px-3 py-1 border border-red-400  text-red-400 rounded-tr-md rounded-br-md">
                  {primer_nombre + " " + primer_apellido}
                </p>
              </Flex>

              <h1 className="text-white-800 text-lg mb-2 text-center">Razon</h1>

              <Flex
                justify="center"
                align="center"
                style={{ marginBottom: 20 }}
              >
                <p className="px-3 py-1 bg-red-300 text-white-100 rounded-tl-md rounded-md">
                  {razon}
                </p>
              </Flex>
            </div>
          );

          setListaNegraModalVisible(true);
          return true;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  const isInSolicitudes = async (in_dni) => {
    try {
      const responseSolicitudes =
        await ListaSolicitudApi.getListaSolicitudTotalRequest();

      if (
        !responseSolicitudes ||
        responseSolicitudes.status < 200 ||
        responseSolicitudes.status >= 300
      ) {
        return false;
      }

      const solicitudes = responseSolicitudes.data;

      const solicitudesFiltradas = solicitudes.filter(
        (solicitud) => solicitud.PacienteHuesped.Huesped.Persona.dni === in_dni
      );

      if (solicitudesFiltradas.length > 0) {
        Modal.warning({
          centered: true,
          title: "Solicitud Activa",
          content: (
            <div>
              <p className="text-lg px-3 py-2 border-dashed border-red-400 rounded-md border-2 text-red-400 mt-5">
                El DNI ingresado ya tiene una solicitud de hospedaje en proceso
              </p>
            </div>
          ),
          onOk() {},
          afterClose() {},
        });

        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const isInReservaciones = async (in_dni) => {
    try {
      const responseSolicitudes =
        await ReservacionesApi.getReservacionesActivas();

      if (
        !responseSolicitudes ||
        responseSolicitudes.status < 200 ||
        responseSolicitudes.status >= 300
      ) {
        return false;
      }

      const solicitudes = responseSolicitudes.data;

      const solicitudesFiltradas = solicitudes.filter(
        (solicitud) => solicitud.PacienteHuesped.Huesped.Persona.dni === in_dni
      );

      if (solicitudesFiltradas.length > 0) {
        Modal.warning({
          centered: true,
          title: "Reservacion Activa",
          content: (
            <div>
              <p className="text-lg px-3 py-2 border-dashed border-yellow-400 rounded-md border-2 text-red-400 mt-5">
                El dni que acaba de ingresar ya tiene una reservacion
              </p>
            </div>
          ),
          onOk() {},
          afterClose() {},
        });

        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const cargarInformacionHospedado = async (in_dni, persona) => {
    try {
      const response = await personaApi.getPersonaByDniRequest(in_dni);

      if (!response) {
        // deberia lanzar un erro
        console.log("la persona aun no existe");
      }

      if (response.status >= 200 && response.status < 300) {
        openNotification(
          2,
          "Persona ya Existe",
          "La persona que ingreso ya existe."
        );

        const {
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
        } = response.data;

        const changeuser = {
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
          id_lugar: 1,
        };

        switch (persona) {
          case 0:
            setHospedado({
              ...changeuser,
              id_patrono: null,
              dni_afiliado: "",
              nombre_afiliado: "",
            });
            break;

          case 1:
            setPaciente({ ...changeuser, becada: false });

            break;
          case 2:
            setAcompanante({ ...changeuser });
            break;

          default:
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //hace cambios de formato
  const handleSetChangeUser = async (key, value, previousValue = null) => {
    let newValue = value;

    switch (key) {
      case "dni":
        if (previousValue !== null && value.length > previousValue.length) {
          if (/^\d{4}$/.test(value) || /^\d{4}-\d{4}$/.test(value)) {
            newValue = value + "-";
          }
        }

        if (/^\d{4}-\d{4}-\d{5}$/.test(newValue)) {
          if (await isInListaNegar(newValue)) {
            ResetearAtributos();
            console.log("Esta en ngra");
            return;
          } else if (await isInSolicitudes(newValue)) {
            ResetearAtributos();
            console.log("Esta en solid");
            return;
          } else if (await isInReservaciones(newValue)) {
            ResetearAtributos();

            console.log("Eseta en reservacion");
            return;
          } else searchDni(newValue, 0);
        }
        break;

      case "dni_afiliado":
        if (previousValue !== null && value.length > previousValue.length) {
          if (/^\d{4}$/.test(value) || /^\d{4}-\d{4}$/.test(value)) {
            newValue = value + "-";
          }
        }

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

    setHospedado({ ...hospedado, [key]: newValue });
  };

  const handleChangeObservacionHuesped = (e) => {
    setHospedado({ ...hospedado, observacion_reservacion: e.target.value });
  };

  const handleSetChangePaciente = (key, value, previousValue = null) => {
    let newValue = value;

    switch (key) {
      case "dni":
        if (previousValue !== null && value.length > previousValue.length) {
          if (/^\d{4}$/.test(value) || /^\d{4}-\d{4}$/.test(value)) {
            newValue = value + "-";
          }
        }

        if (/^\d{4}-\d{4}-\d{5}$/.test(newValue)) {
          searchDni(newValue, 1);
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

      case "id_hospital":
        setPaciente({
          ...paciente,
          id_hospital: newValue,
          id_piso: null,
          id_sala: null,
        });

        return;

        break;

      default:
        break;
    }

    setPaciente({ ...paciente, [key]: newValue });
  };

  const handleSetChangeAcompanante = async (
    key,
    value,
    previousValue = null
  ) => {
    let newValue = value;

    switch (key) {
      case "dni":
        if (previousValue !== null && value.length > previousValue.length) {
          if (/^\d{4}$/.test(value) || /^\d{4}-\d{4}$/.test(value)) {
            newValue = value + "-";
          }
        }

        if (/^\d{4}-\d{4}-\d{5}$/.test(newValue)) {
          if (/^\d{4}-\d{4}-\d{5}$/.test(newValue)) {
            if (await isInListaNegar(newValue)) {
              resetearAcompanante();
              return;
            } else if (await isInSolicitudes(newValue)) {
              resetearAcompanante();
              return;
            } else if (await isInReservaciones(newValue)) {
              resetearAcompanante();
              return;
            } else searchDni(newValue, 2);
          }
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

    setAcompanante({ ...acompanante, [key]: newValue });
  };

  console.log("2024-04-23".match(dateFormat));

  const toggleAcompanante = () => {
    setAcompanante((prev) => {
      if (prev === true) {
        resetearAcompanante();
      }
      return !prev;
    });
  };

  const validarCamposHospedado = () => {
    for (const [key, value] of Object.entries(hospedado)) {
      if (
        value === "" &&
        key !== "segundo_nombre" &&
        key !== "segundo_apellido" &&
        key !== "telefono" &&
        key !== "observacion_reservacion" &&
        key !== "id_patrono" &&
        key !== "dni_afiliado" &&
        key !== "nombre_afiliado"
      ) {
        openNotification(
          2,
          "Campos Vacios en Huesped",
          "No puede dejar campos vacios"
        );
        return false;
      }

      if (key === "telefono" && value.match(telFormat) === null) {
        openNotification(
          2,
          "Telefono del huesped",
          "El formato del telefono no es valido"
        );
        return false;
      }
      if (
        key === "dni" &&
        value.match(dniFormat) === null &&
        value.match(regexFecha) === null
      ) {
        openNotification(
          2,
          "DNI del huesped",
          "El formato del DNI no es valido"
        );
        return false;
      }
    }

    return true;
  };

  const validarCamposPaciente = () => {
    for (const [key, value] of Object.entries(paciente)) {
      if (
        value === "" &&
        key !== "segundo_nombre" &&
        key !== "segundo_apellido" &&
        key !== "telefono" &&
        key !== "observacion"
      ) {
        openNotification(
          2,
          "Campos Vacios en Paciente",
          "No puede dejar campos vacios"
        );
        return false;
      }

      if (
        key === "telefono" &&
        value.length > 0 &&
        value.match(telFormat) === null
      ) {
        openNotification(
          2,
          "Telefono del Paciente Invalido",
          "El formato del telefono no es valido"
        );
        return false;
      }
      if (
        key === "dni" &&
        value.match(dniFormat) === null &&
        value.match(regexFecha) === null
      ) {
        openNotification(
          2,
          "DNI del paciente",
          "El formato del DNI no es valido"
        );
        return false;
      }
    }

    return true;
  };

  const validarCamposAcompanante = () => {
    for (const [key, value] of Object.entries(acompanante)) {
      if (
        value === "" &&
        key !== "segundo_nombre" &&
        key !== "segundo_apellido" &&
        key !== "telefono"
      ) {
        openNotification(
          2,
          "Campos Vacios en Acompañante",
          "No puede dejar campos vacios"
        );
        return false;
      }

      if (
        key === "telefono" &&
        value.length > 0 &&
        value.match(telFormat) === null
      ) {
        openNotification(
          2,
          "Telefono en Acompañante",
          "El formato del telefono no es valido"
        );
        return false;
      }
      if (
        key === "dni" &&
        value.match(dniFormat) === null &&
        value.match(regexFecha) === null
      ) {
        openNotification(
          2,
          "DNI del Acompañante",
          "El formato del DNI no es valido"
        );
        return false;
      }
    }

    return true;
  };

  const validarCampos = async () => {
    if (validarCamposHospedado() && validarCamposPaciente()) {
      if (acompanante) {
        if (validarCamposAcompanante()) {
          return true;
        } else return false;
      }

      return true;
    }

    return false;
  };

  //agarra el submit aqui va a mandar
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    if (await validarCampos()) {
      const huespedData = {
        ...hospedado,
        genero: hospedado.genero === 1 ? "FEMENINO" : "MASCULINO",
        id_lugar: usuario.id_lugar,
      };

      setContentModal(
        <p className="px-2 py-3 bg-green-400 text-white-100 rounded-md">
          Por favor, espere a que le asignemos una cama
        </p>
      );

      if (hospedado.genero === "FEMENINO" || hospedado.genero === 1) {
        if (!validarDisponibilidadMujeres()) {
          setContentModal(
            <p className="px-2 py-3 bg-red-400 text-white-100 rounded-md">
              Usted ha pasado a la lista de espera, hay muchas solicitudes
            </p>
          );
        }
      } else {
        console.log("se fue a hombre");
        if (!validarDisponibilidadHombres()) {
          setContentModal(
            <p className="px-2 py-3 bg-red-400 text-white-100 rounded-md">
              Usted ha pasado a la lista de espera, hay muchas solicitudes
            </p>
          );
        }
      }

      const pacienteData = {
        ...paciente,
        genero: paciente.genero === 1 ? "FEMENINO" : "MASCULINO",
        id_lugar: usuario.id_lugar,
      };

      const acompananteDataFunc = () => {
        if (acompanante) {
          return {
            ...acompanante,
            genero: acompanante.genero === 1 ? "FEMENINO" : "MASCULINO",
            id_lugar: usuario.id_lugar,
          };
        }

        return null;
      };

      const acompananteData = acompananteDataFunc();

      const patronoDataFunc = () => {
        if (
          paciente.id_hospital === 12 &&
          hospedado.id_patrono !== null &&
          hospedado.dni_afiliado !== "" &&
          hospedado.nombre_afiliado !== ""
        ) {
          return {
            id_patrono: hospedado.id_patrono,
            dni_afiliado: hospedado.dni_afiliado,
            nombre_afiliado: hospedado.nombre_afiliado,
          };
        } else return null;
      };

      const patronoData = patronoDataFunc();

      const solicitudData = {
        fecha_entrada: hospedado.fecha_entrada,
        fecha_salida: hospedado.fecha_salida,
        becada: paciente.becada,
        observacion: hospedado.observacion_reservacion
          ? hospedado.observacion_reservacion
          : "",
      };

      try {
        const response = await solicitudApi.createSolicitud({
          huespedData,
          pacienteData,
          acompananteData,
          solicitudData,
          patronoData,
        });

        if (response.status >= 200 && response.status < 300) {
          setSuccessModalVisible(true);

          loadCamasDisponibles();
          loadNoSolicitudes();

          resetearAcompanante();
          ResetearAtributos();

          setLoading(false);
        }
      } catch (error) {
        openNotification(4, "Error", "No se pudo crear la solicitud");
        console.log(error);
      }
    }

    setLoading(false);
  };

  const validarDisponibilidadMujeres = () => {
    if (noSolicitudesMujeres) {
      return camasDisponiblesMujeres > noSolicitudesMujeres;
    }

    return camasDisponiblesMujeres > 0;
  };

  const validarDisponibilidadHombres = () => {
    if (noSolicitudesHombrs) {
      return camasDisponiblesHombres > noSolicitudesHombrs;
    }

    return camasDisponiblesHombres > 0;
  };

  useEffect(() => {
    loadOcupaciones();
    loadProcedencias();
    //loadHospitales();
    //handleGetOcupaciones();
    //handleGetProcedencias();

    ResetearAtributos();
    setCurrentPath("/ Hospedar");
    //cargarInformacion();

    loadCamasDisponibles();

    loadNoSolicitudes();
  }, []);

  const Fechas = () => {
    return (
      <Card style={{ marginTop: 16 }} className="shadow-#1">
        <Meta title="" />
        <Row gutter={25} style={{ marginTop: 20 }}>
          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Flex
              justify=""
              align="center"
              style={{ width: "100%", height: "100%" }}
            >
              <div className="w-max mr-3 text-[16px] font-bold text-white-700 text-nowrap">
                Fecha De Entrada
              </div>
              <DatePicker
                minDate={dayjs()}
                maxDate={
                  hospedado.fecha_salida
                    ? dayjs(hospedado.fecha_salida).subtract(1, "day")
                    : null
                }
                style={{ height: "100%", width: "100%" }}
                placeholder="Fecha de Entrada"
                format={dateFormat}
                className="my-datepicker"
                value={
                  hospedado.fecha_entrada
                    ? dayjs(hospedado.fecha_entrada, dateFormat)
                    : null
                }
                onChange={(e, d) => {
                  handleSetChangeUser("fecha_entrada", d);
                }}
              />
            </Flex>
          </Col>
          <Col
            xs={{ flex: "100%" }}
            lg={{ flex: "50%" }}
            style={{ marginBottom: 25, height: 50 }}
          >
            <Flex
              justify=""
              align="center"
              style={{ width: "100%", height: "100%" }}
            >
              <div className="w-max mr-3 text-[16px] font-bold text-white-700 text-nowrap">
                Fecha De Salida
              </div>
              <DatePicker
                minDate={
                  hospedado.fecha_entrada
                    ? dayjs(hospedado.fecha_entrada).add(1, "day")
                    : dayjs().add(1, "day")
                }
                style={{ height: "100%", width: "100%" }}
                placeholder="Fecha de Salida"
                format={dateFormat}
                className="my-datepicker"
                value={
                  hospedado.fecha_salida
                    ? dayjs(hospedado.fecha_salida, dateFormat)
                    : null
                }
                onChange={(e, d) => {
                  handleSetChangeUser("fecha_salida", d);
                }}
              />
            </Flex>
          </Col>
        </Row>
      </Card>
    );
  };

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
        <Disponibilidad
          camasDisponiblesHombres={camasDisponiblesHombres}
          camasDisponiblesMujeres={camasDisponiblesMujeres}
          noSolicitudesHombres={noSolicitudesHombrs}
          noSolicitudesMujeres={noSolicitudesMujeres}
        />

        <Card style={{ marginTop: 16 }} className="shadow-#1">
          <Meta title="Informacion Personal Huesped" />

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
                value={hospedado.dni}
                onChange={(e) => {
                  handleSetChangeUser("dni", e.target.value, hospedado.dni);

                  setTimeout(async () => {
                    //await cargarInformacion();
                  });
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
                searchValue={searchOcupacion}
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
                  <Button
                    loading={loading}
                    onClick={() => {
                      handleCrearOcupacion(0);
                    }}
                  >
                    Crear Ocupacion
                  </Button>
                }
                options={ocupaciones}
                style={{ width: "100%", height: "100%" }}
                value={hospedado.id_ocupacion}
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
                value={hospedado.primer_nombre}
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
                value={hospedado.segundo_nombre}
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
                value={hospedado.primer_apellido}
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
                value={hospedado.segundo_apellido}
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
                value={hospedado.genero}
                onChange={(e) => {
                  handleSetChangeUser("genero", e);
                }}
              ></Select>
            </Col>
          </Row>
          <Row>
            <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
              <Select
                showSearch
                searchValue={searchProcedencia}
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
                  <Button
                    onClick={(e) => {
                      handleCrearProcedencia();
                    }}
                  >
                    Crear Procedencia
                  </Button>
                }
                placeholder="Procedencia"
                style={{ width: "100%", height: "100%" }}
                options={procedencias}
                size="large"
                value={hospedado.id_procedencia}
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
                value={hospedado.direccion}
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
                value={hospedado.telefono}
                onChange={(e) => {
                  handleSetChangeUser(
                    "telefono",
                    e.target.value,
                    hospedado.telefono
                  );
                }}
              />
            </Col>
          </Row>

          <br />
          <br />

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
              type={acompanante ? "default" : "primary"}
              size="large"
              onClick={toggleAcompanante}
              style={{
                marginLeft: "20px",
                backgroundColor: acompanante ? "#d9d9d9" : undefined, // Greyed out when state is true
                color: acompanante ? "#000" : "#fff",
              }}
            >
              {acompanante ? "Remover acompañante" : "Agregar acompañante"}
            </Button>
          </ConfigProvider>
        </Card>

        <div>
          {!acompanante ? (
            <div></div>
          ) : (
            <Card style={{ marginTop: 16 }} className="shadow-#1">
              <Meta title="Informacion del Acompañante" />

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
                    value={acompanante.dni}
                    onChange={(e) => {
                      handleSetChangeAcompanante(
                        "dni",
                        e.target.value,
                        acompanante.dni
                      );

                      setTimeout(async () => {
                        //await cargarInformacion();
                      });
                    }}
                  />
                </Col>
                <Col
                  xs={{ flex: "100%" }}
                  lg={{ flex: "50%" }}
                  style={{ marginBottom: 25, height: 50 }}
                >
                  <Select
                    id="selectOcupacionAcompanante"
                    showSearch
                    searchValue={searchOcupacion}
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
                      <Button
                        loading={loading}
                        onClick={() => {
                          handleCrearOcupacion(2);
                        }}
                      >
                        Crear Ocupacion
                      </Button>
                    }
                    options={ocupaciones}
                    style={{ width: "100%", height: "100%" }}
                    value={acompanante.id_ocupacion}
                    onChange={(e) => {
                      handleSetChangeAcompanante("id_ocupacion", e);
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
                    value={acompanante.primer_nombre}
                    onChange={(e) => {
                      handleSetChangeAcompanante(
                        "primer_nombre",
                        e.target.value
                      );
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
                    value={acompanante.segundo_nombre}
                    onChange={(e) => {
                      handleSetChangeAcompanante(
                        "segundo_nombre",
                        e.target.value
                      );
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
                    value={acompanante.primer_apellido}
                    onChange={(e) => {
                      handleSetChangeAcompanante(
                        "primer_apellido",
                        e.target.value
                      );
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
                    value={acompanante.segundo_apellido}
                    onChange={(e) => {
                      handleSetChangeAcompanante(
                        "segundo_apellido",
                        e.target.value
                      );
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
                    value={acompanante.genero}
                    onChange={(e) => {
                      handleSetChangeAcompanante("genero", e);
                    }}
                  ></Select>
                </Col>
              </Row>
              <Row>
                <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
                  <Select
                    id="selectProcedenciaH"
                    searchValue={searchProcedencia}
                    onSearch={(e) => {
                      setSearchProcedencia(e);
                    }}
                    showSearch
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
                      <Button onClick={handleCrearProcedencia}>
                        Crear Procedencia
                      </Button>
                    }
                    placeholder="Procedencia"
                    style={{ width: "100%", height: "100%" }}
                    options={procedencias}
                    size="large"
                    value={acompanante.id_procedencia}
                    onChange={(e) => {
                      handleSetChangeAcompanante("id_procedencia", e);
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
                    value={acompanante.direccion}
                    onChange={(e) => {
                      handleSetChangeAcompanante("direccion", e.target.value);
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
                    value={handleObtenerFechaAcompanante()}
                    onChange={(e, d) => {
                      handleSetChangeAcompanante("fecha_nacimiento", d);
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
                    value={acompanante.telefono}
                    onChange={(e) => {
                      handleSetChangeAcompanante(
                        "telefono",
                        e.target.value,
                        acompanante.telefono
                      );
                    }}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </div>

        <Card style={{ marginTop: 16 }} className="shadow-#1">
          <Meta title="Informacion Personal del Paciente" />

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
                value={paciente.dni}
                onChange={(e) => {
                  handleSetChangePaciente("dni", e.target.value, paciente.dni);

                  setTimeout(async () => {
                    //await cargarInformacion();
                  });
                }}
              />
            </Col>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                id="selectOcupacionPaciente"
                showSearch
                searchValue={searchOcupacion}
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
                  <Button
                    loading={loading}
                    onClick={() => {
                      handleCrearOcupacion(1);
                    }}
                  >
                    Crear Ocupacion
                  </Button>
                }
                options={ocupaciones}
                style={{ width: "100%", height: "100%" }}
                value={paciente.id_ocupacion}
                onChange={(e) => {
                  handleSetChangePaciente("id_ocupacion", e);
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
                value={paciente.primer_nombre}
                onChange={(e) => {
                  handleSetChangePaciente("primer_nombre", e.target.value);
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
                value={paciente.segundo_nombre}
                onChange={(e) => {
                  handleSetChangePaciente("segundo_nombre", e.target.value);
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
                value={paciente.primer_apellido}
                onChange={(e) => {
                  handleSetChangePaciente("primer_apellido", e.target.value);
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
                value={paciente.segundo_apellido}
                onChange={(e) => {
                  handleSetChangePaciente("segundo_apellido", e.target.value);
                }}
              />
            </Col>
          </Row>
          <Row>
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
                value={paciente.genero}
                onChange={(e) => {
                  handleSetChangePaciente("genero", e);
                }}
              ></Select>
            </Col>
          </Row>
          <Row>
            <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
              <Select
                showSearch
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
                  <Button onClick={handleCrearProcedencia}>
                    Crear Procedencia
                  </Button>
                }
                placeholder="Procedencia"
                disabled={isEditable ? false : true}
                style={{ width: "100%", height: "100%" }}
                options={procedencias}
                size="large"
                value={paciente.id_procedencia}
                onChange={(e) => {
                  handleSetChangePaciente("id_procedencia", e);
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
                value={paciente.direccion}
                onChange={(e) => {
                  handleSetChangePaciente("direccion", e.target.value);
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
                value={handleObtenerFechaPaciente()}
                onChange={(e, d) => {
                  handleSetChangePaciente("fecha_nacimiento", d);
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
                value={paciente.telefono}
                onChange={(e) => {
                  handleSetChangePaciente(
                    "telefono",
                    e.target.value,
                    paciente.telefono
                  );
                }}
              />
            </Col>
          </Row>
        </Card>

        <InformacionPaciente
          changeUser={paciente}
          isEditable={true}
          handleSetChangeUser={handleSetChangePaciente}
        />

        {paciente.id_hospital === null || paciente.id_hospital != 12 ? (
          <div></div>
        ) : (
          <PatronoHuesped
            changeUser={hospedado}
            isEditable={true}
            handleSetChangeUser={handleSetChangeUser}
          />
        )}

        <Fechas />

        <Card style={{ marginTop: 16 }} className="shadow-#1">
          <Row style={{ marginBottom: 20 }}>
            <Input.TextArea
              prefix={<SearchOutlined style={styleIconInput} />}
              size="large"
              placeholder="Observacion de la Reservacion"
              value={hospedado.observacion_reservacion}
              onChange={(e) => {
                e.preventDefault();

                handleSetChangeUser("observacion_reservacion", e.target.value);
              }}
            />
          </Row>

          <Row gutter={25}>
            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Checkbox
                checked={paciente.becada}
                onChange={(e) =>
                  handleSetChangePaciente("becada", e.target.checked)
                }
                className="text-lg px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow border-2 border-gray-200  text-white-800 font-semibold"
              >
                Becada
              </Checkbox>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: 16 }} className="shadow-#1">
          <Meta title="" />
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
                type="primary"
                size={"large"}
                onClick={handleSubmit}
                style={{ marginLeft: "20px" }}
                loading={loading}
              >
                Registrar
              </Button>
            </ConfigProvider>
          </div>
        </Card>

        <Modal
          title="Éxito"
          centered
          open={successModalVisible}
          onOk={() => setSuccessModalVisible(false)}
        >
          <h1 className="text-white-800 font-bold py-3 text-lg">
            Solicitud agendada Correctamente
          </h1>

          {contenModal}
        </Modal>

        <Modal
          title="Se Encontro en Lista Negra"
          open={listaNegraModalVisible}
          onOk={() => setListaNegraModalVisible(false)}
        >
          {contentModalNegra}
        </Modal>

        <Modal
          title="Error"
          open={errorModalVisible}
          onCancel={() => setErrorModalVisible(false)}
          onOk={() => setErrorModalVisible(false)}
        >
          <p>{errorMessage}</p>
        </Modal>
      </ConfigProvider>
    </Flex>
  );
}

export default Hospedar;
