import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  IdcardOutlined,
  PushpinOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Input,
  Select,
  Button,
  DatePicker,
  ConfigProvider,
} from "antd";
import dayjs from "dayjs";
import { useLayout } from "../../context/LayoutContext";
import customParseFormat from "dayjs/plugin/customParseFormat";
import OcupacionesApi from "../../api/Ocupaciones.api";
import ProcedenciaApi from "../../api/Procedencia.api";

import { getUserFromToken } from '../../utilities/auth.utils';

const { Meta } = Card;
const { TextArea } = Input;

dayjs.extend(customParseFormat);

const dateFormat = "YYYY-MM-DD";

const generos = [
  { value: 1, label: "Masculino" },
  { value: 2, label: "Femenino" },
];

const styleIconInput = { fontSize: 24, color: "#dedede", paddingRight: 10 };

/*

OJO necesita un objeto user que tenga los siguientes atributos

dni,
ocupacion,
primerNombre
segundoNombre
primerApellido
procedencia
direccion
genero
fechaNacimiento
telefono

Se necesita una copia de este mismo en el caso de que se editen estos valores
y se quiere volver a los originales.

(se podria volver a los originales, realizando un peticion al servidor, pero asi nos ahorramos esa peticion xD)

*/



const InformacionPersonal = ({
  user,
  changeUser,
  isEditable,
  handleSetChangeUser,
}) => {


  const usuario = getUserFromToken();
  const rolLog = usuario.rol;

  const [ocupaciones, setOcupaciones] = useState([]);
  const [procedencias, setProcedencias] = useState([]);  

  const { openNotification } = useLayout();

  const [searchOcupacion, setSearchOcupacion] = useState("");
  const [searchProcedencia, setSearchProcedencia] = useState("");

  const [loading, setLoading] = useState(false);

  const validarFormatoProcedencia = () => {
    const procedenciaFormat = searchProcedencia.split(",");

    if (procedenciaFormat.length !== 2) {
      // Deberia lanzar una notificacion de error
      openNotification(
        2,
        "Procedencia Incorrecta",
        "Formato de procedencia invalido\n Ejemplo: Atlantida, La Ceiba"
      );
      return false;
    }

    return true;
  };
  const loadOcupaciones = async () => {
    try {
      const response = await OcupacionesApi.getOcupacionesRequest();

      if (response.status >= 200 && response.status < 300) {
        setOcupaciones(
          response.data.map((e) => ({
            value: e.id_ocupacion,
            label: e.descripcion,
          }))
        );
        return;
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

      if (response.status === 201) {
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

        loadProcedencias();

        handleSetChangeUser("id_procedencia", id_procedencia_creada);

        document.getElementById("selectProcedencia").blur();

        // Validar que retorna porque tenemos que asignarle ese id al user
      } catch (error) {
        openNotification(3, "Error", error);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    loadOcupaciones();
    loadProcedencias();
  }, []);

    

  return (
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
              disabled={isEditable ? false : true}
              size="large"
              placeholder="No. de Identidad"
              maxLength={15}
              type="text"
              style={{ height: "100%" }}
              value={isEditable ? changeUser.dni : user.dni}
              onChange={(e) => {
                handleSetChangeUser("dni", e.target.value, changeUser.dni);
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
              disabled={isEditable ? false : true}
              size="large"
              searchValue={searchOcupacion}
              onSearch={(e) => {
                setSearchOcupacion(e);
              }}
              notFoundContent={
                rolLog === "admin" ? (
                  <Button loading={loading} onClick={handleCrearOcupacion}>
                    Crear Ocupacion
                  </Button>
                ) : (
                  <p className="p-3">No se encontro</p>
                )
              }
              options={ocupaciones}
              style={{ width: "100%", height: "100%" }}
              value={isEditable ? changeUser.id_ocupacion : user.id_ocupacion}
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
              value={isEditable ? changeUser.primer_nombre : user.primer_nombre}
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
              disabled={isEditable ? false : true}
              placeholder="Segundo Nombre"
              type="text"
              style={{ height: "100%" }}
              value={
                isEditable ? changeUser.segundo_nombre : user.segundo_nombre
              }
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
              value={
                isEditable ? changeUser.primer_apellido : user.primer_apellido
              }
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
              value={
                isEditable ? changeUser.segundo_apellido : user.segundo_apellido
              }
              onChange={(e) => {
                handleSetChangeUser("segundo_apellido", e.target.value);
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
              disabled={isEditable ? false : true}
              options={generos}
              style={{ width: "100%", height: "100%" }}
              value={isEditable ? changeUser.genero : user.genero}
              onChange={(e) => {
                handleSetChangeUser("genero", e);
              }}
            ></Select>
          </Col>
        </Row>
        <Row>
          <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
            <Select
              id="selectProcedencia"
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
                  loading={loading}
                  onClick={(e) => {
                    handleCrearProcedencia();
                  }}
                >
                  Crear Procedencia
                </Button>
              }
              placeholder="Procedencia"
              disabled={isEditable ? false : true}
              style={{ width: "100%", height: "100%" }}
              options={procedencias}
              size="large"
              value={
                isEditable ? changeUser.id_procedencia : user.id_procedencia
              }
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
              value={isEditable ? changeUser.direccion : user.direccion}
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
              value={dayjs(
                isEditable
                  ? changeUser.fecha_nacimiento
                  : user.fecha_nacimiento,
                dateFormat
              )}
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
              value={isEditable ? changeUser.telefono : user.telefono}
              onChange={(e) => {
                handleSetChangeUser(
                  "telefono",
                  e.target.value,
                  changeUser.telefono
                );
              }}
            />
          </Col>
        </Row>
      </Card>
    </ConfigProvider>
  );
};

export default InformacionPersonal;
