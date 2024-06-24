import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Layout,
  Breadcrumb,
  DatePicker,
  Input,
  Table,
  Button,
  Spin,
  ConfigProvider,
  Select,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axiosInstance from "../../../api/axiosInstance";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { BiDollar, BiDonateHeart, BiMoney } from "react-icons/bi";
import OfrendasApi from "../../../api/Ofrenda.api";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import PatronoApi from "../../../api/Patrono.api";

import ProcedenciaApi from "../../../api/Procedencia.api";

import { useLayout } from "../../../context/LayoutContext";
import { getUserFromToken } from "../../../utilities/auth.utils";

dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";
const { Header, Content } = Layout;
const { RangePicker } = DatePicker;

function Pagos() {
  const { setCurrentPath } = useLayout();

  const columns = [
    {
      title: "Nombre de Huesped",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className="p-5">
            <Input
              autoFocus
              placeholder="Ingrese Huesped aquí"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
              style={{ marginBottom: 5 }}
            ></Input>
            <Button
              className="buscar_button"
              onClick={() => {
                confirm();
              }}
            >
              Buscar
            </Button>
            <Button
              className="delete_button"
              onClick={() => {
                clearFilters();
              }}
              type="danger"
            >
              Borrar
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.nombre.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "DNI",
      dataIndex: "dni",
      key: "dni",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className="p-5">
            <Input
              autoFocus
              placeholder="DNI aquí"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
              style={{ marginBottom: 5 }}
            ></Input>
            <Button
              className="buscar_button"
              onClick={() => {
                confirm();
              }}
            >
              Buscar
            </Button>
            <Button
              className="delete_button"
              onClick={() => {
                clearFilters();
              }}
              type="danger"
            >
              Borrar
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.Cama.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Fecha de Pago",
      dataIndex: "fecha",
      key: "fecha",
      sorter: (a, b) => new Date(a.fecha) - new Date(b.fecha),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div className="p-5">
            <Input
              autoFocus
              placeholder="Ingrese fecha aquí"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
              style={{ marginBottom: 5 }}
            ></Input>
            <Button
              className="buscar_button"
              onClick={() => {
                confirm();
              }}
              type="primary"
            >
              Buscar
            </Button>
            <Button
              className="delete_button"
              onClick={() => {
                clearFilters();
              }}
              type="danger"
            >
              Borrar
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.fechaE.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      sorter: (a, b) => a.valor - b.valor,
      render: (text) => <div>Lps: {text.toFixed(2)}</div>,
    },
  ];

  const [becados, setBecados] = useState([]);
  const [donacions, setDonacions] = useState([]);
  const { userLog } = useLayout();
  const [totalBeca, setTotalBeca] = useState(0.0);
  const [totalDonacion, setTotalDonacion] = useState(0.0);

  const [procedencia, setProcedencia] = useState(-1);
  const [patrono, setPatrono] = useState(-1);

  const [genero, setGenero] = useState(-1);

  const [patronos, setPatronos] = useState([]);
  const [procedencias, setProcedencias] = useState([]);
  const [generos, setGeneros] = useState([
    { value: -1, label: "Todos los Generos" },
    { value: 1, label: "Masculino" },
    { value: 2, label: "Femenino" },
  ]);

  const [searchProcedencia, setSearchProcedencia] = useState("");
  const [searchPatrono, setSearchPatrono] = useState("");

  const [loading, setLoading] = useState(false);

  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString());
  const [fechaFinal, setFechaFinal] = useState(new Date().toISOString());

  const [dataSource, setDataSource] = useState([]);

  const loadProcedencias = async () => {
    try {
      const response = await ProcedenciaApi.getProcedenciasRequest();

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar las procedencias");
      }

      if (response.status === 201) {
        const data = response.data.map((e) => ({
          value: e.id_procedencia,
          label: e.departamento + ", " + e.municipio,
        }));

        data.unshift({ value: -1, label: "Todas las Procedencias" });

        setProcedencias(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadPatronos = async () => {
    try {
      const response = await PatronoApi.getPatronosRequest();

      if (!response) {
        // deberia lanzar un error
        throw new Error("No se pudo cargar los patronos");
      }

      if (response.status === 201) {
        const data = response.data.map((e) => ({
          value: e.id_patrono,
          label: e.nombre,
        }));

        data.unshift({ value: -1, label: "Todos los Patronos" });

        setPatronos(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const compararPatrono = (ofrenda) => {
    if (ofrenda.Reservacion.AfiliadoReservacions[0]) {
      return (
        ofrenda.Reservacion.AfiliadoReservacions[0].Afiliado.PatronoAfiliados[0]
          .id_p === patrono
      );
    }

    return false;
  };

  const loadData = async () => {
    setLoading(true);

    if (procedencias.length === 0) {
      await loadProcedencias();
    }

    if (patronos.length === 0) {
      await loadPatronos();
    }

    const data = [];

    const reponseDonaciones = await OfrendasApi.getOfrendasDonaciones(
      fechaInicio,
      fechaFinal
    );

    if (
      !reponseDonaciones &&
      reponseDonaciones.status < 200 &&
      reponseDonaciones.status >= 300
    ) {
      setLoading(false);
      return;
    }

    let donaciones =
      reponseDonaciones.data.donacion.filter(
        (ofrenda) =>
          ofrenda.Reservacion.Cama.Habitacion.id_lugar === userLog.id_lugar
      ) || [];

    if (genero !== -1) {
      donaciones = donaciones.filter(
        (ofrenda) =>
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.genero ===
          (genero === 1 ? "MASCULINO" : "FEMENINO")
      );
    }

    if (procedencia !== -1) {
      donaciones = donaciones.filter(
        (ofrenda) =>
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.id_procedencia ===
          procedencia
      );
    }

    if (patrono !== -1) {
      donaciones = donaciones.filter(compararPatrono);
    }

    donaciones.forEach((ofrenda) => {
      data.push({
        key: ofrenda.id_ofrenda,
        nombre:
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_nombre +
          " " +
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_apellido,
        dni: ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.dni,
        fecha: ofrenda.fecha,
        valor: parseFloat(ofrenda.valor),
      });
    });

    const totalDonaciones = donaciones.reduce(
      (total, reservacion) => total + parseFloat(reservacion.valor),
      0
    );

    setTotalDonacion(totalDonaciones);
    setDonacions(donaciones);

    const responseBecados = await OfrendasApi.getOfrendasBecados(
      fechaInicio,
      fechaFinal
    );

    if (
      !responseBecados &&
      responseBecados.status < 200 &&
      responseBecados.status >= 300
    ) {
      setLoading(false);
      return;
    }

    console.log(responseBecados);

    let becados =
      responseBecados.data.becados.filter((ofrenda) =>
        ofrenda.Reservacion.Cama
          ? ofrenda.Reservacion.Cama.Habitacion.id_lugar === userLog.id_lugar
          : false
      ) || [];

    if (genero !== -1) {
      becados = becados.filter(
        (ofrenda) =>
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.genero ===
          (genero === 1 ? "MASCULINO" : "FEMENINO")
      );
    }

    if (procedencia !== -1) {
      becados = becados.filter(
        (ofrenda) =>
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.id_procedencia ===
          procedencia
      );
    }

    if (patrono !== -1) {
      becados = becados.filter(compararPatrono);
    }

    becados.forEach((ofrenda) => {
      data.push({
        key: ofrenda.id_ofrenda,
        nombre:
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_nombre +
          " " +
          ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.primer_apellido,
        dni: ofrenda.Reservacion.PacienteHuesped.Huesped.Persona.dni,
        fecha: ofrenda.fecha,
        valor: parseFloat(ofrenda.valor),
      });
    });

    const totalBecados = becados.reduce(
      (total, ofrenda) => total + parseFloat(ofrenda.valor),
      0
    );

    setTotalBeca(totalBecados);
    setBecados(becados);

    setDataSource(data);

    setLoading(false);
  };

  useEffect(() => {
    loadData();

    setCurrentPath("/ Reportes / Pagos");
  }, [fechaInicio, fechaFinal, genero, procedencia, patrono]);

  // useEffect(() => {
  //   const total = becados.reduce((accumulator, becado) => accumulator + parseFloat(becado.valor), 0);
  //   setTotalBeca(total);
  // }, [becados]);

  // useEffect(() => {
  //   const total = donacions.reduce((accumulator, dona) => accumulator + parseFloat(dona.valor), 0);
  //   setTotalDonacion(total);
  // }, [donacions]);

  const onChange = (dates, dateStrings) => {
    if (dates) {
      const newFechaInicio = dateStrings[0];
      const newFechaFinal = dateStrings[1];
      setFechaInicio(newFechaInicio);
      setFechaFinal(newFechaFinal);
    }
  };

  const renderFiltros = () => {
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
        <Card className="mt-10 rounded-xl">
          <Row>
            <Col flex={"100%"} style={{ marginBottom: 25, height: 50 }}>
              <Select
                style={{ width: "100%", height: "100%" }}
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
                placeholder="Procedencia"
                options={procedencias}
                size="large"
                value={procedencia}
                onChange={(e) => {
                  setProcedencia(e);
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
                style={{ width: "100%", height: "100%" }}
                id="selectPatrono"
                showSearch
                searchValue={searchPatrono}
                onSearch={(e) => {
                  setSearchProcedencia(e);
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                placeholder="Patrono"
                options={patronos}
                size="large"
                value={patrono}
                onChange={(e) => {
                  setPatrono(e);
                }}
              />
            </Col>

            <Col
              xs={{ flex: "100%" }}
              lg={{ flex: "50%" }}
              style={{ marginBottom: 25, height: 50 }}
            >
              <Select
                style={{ width: "100%", height: "100%" }}
                placeholder="Genero"
                options={generos}
                value={genero}
                onChange={(e) => {
                  setGenero(e);
                }}
              />
            </Col>
          </Row>
        </Card>
      </ConfigProvider>
    );
  };

  const render = () => {
    return (
      <Layout>
        <Header
          style={{
            background: "#fff",
            color: "gray",
            fontSize: 20,
            padding: 5,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "right",
            borderRadius: 20,
          }}
        >
          <div>Fechas</div>
          <RangePicker
            defaultValue={[
              dayjs(fechaInicio, dateFormat),
              dayjs(fechaFinal, dateFormat),
            ]}
            style={{ color: "gray", fontSize: 20, alignItems: "center" }}
            onChange={onChange}
            format={dateFormat}
          />
        </Header>

        {renderFiltros()}

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
          <Row gutter={16}>
            <Col span={8}>
              <Card
                title={
                  <span style={{ display: "flex", alignItems: "center" }}>
                    Donaciones <BiDonateHeart />
                  </span>
                }
                bordered={false}
                style={{
                  backgroundColor: "#74dca4",
                  fontSize: 30,
                  color: "white",
                }}
                headStyle={{ color: "white", fontSize: 30 }}
              >
                {donacions.length > 0 ? (
                  <div>Lps: {totalDonacion.toFixed(2)}</div>
                ) : (
                  <p>Lps: 0.0</p>
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title={
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {" "}
                    Becados <BiDonateHeart />
                  </span>
                }
                bordered={false}
                style={{
                  backgroundColor: "#8ce4f3",
                  color: "white",
                  fontSize: 30,
                }}
                headStyle={{ color: "white", fontSize: 30 }}
              >
                {becados.length > 0 ? (
                  <div>Lps: {totalBeca.toFixed(2)}</div>
                ) : (
                  <p>Lps: 0.0</p>
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title={
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {" "}
                    Total <HiOutlineCurrencyDollar />
                  </span>
                }
                bordered={false}
                style={{
                  backgroundColor: "#fcb4b4",
                  color: "white",
                  fontSize: 30,
                }}
                headStyle={{ color: "white", fontSize: 30 }}
              >
                Total: {(totalBeca + totalDonacion).toFixed(2)}
              </Card>
            </Col>
          </Row>

          <ConfigProvider
            theme={{
              components: {
                Table: {
                  headerBg: "#77D9A1",
                  cellFontSize: 18,
                  headerColor: "#FFFFFF",
                  colorText: "#3e3e3e",
                  headerSortActiveBg: "#5fae81",
                  headerSortHoverBg: "#5fae81",
                },
              },
            }}
          >
            <div className="mt-10">
              <Table
                responsive="true"
                scroll={{ x: true }}
                dataSource={dataSource}
                columns={columns}
                pagination={{ showSizeChanger: true }}
              />
            </div>
          </ConfigProvider>
        </Content>
      </Layout>
    );
  };

  return (
    <>
      {!loading ? (
        render()
      ) : (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#77d9a1",
            },
          }}
        >
          <Spin
            style={{ height: "90vh", width: "100%", alignContent: "center" }}
            size="large"
          />
        </ConfigProvider>
      )}
    </>
  );
}

export default Pagos;
