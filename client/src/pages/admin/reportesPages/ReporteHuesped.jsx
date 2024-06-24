import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Layout,
  Breadcrumb,
  DatePicker,
  Table,
  ConfigProvider,
  Input,
  Button,
  Select,
  Spin,
  Divider,
} from "antd";
import dayjs from "dayjs";
import axiosInstance from "../../../api/axiosInstance";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { WomanOutlined, ManOutlined, TeamOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import ProcedenciaApi from "../../../api/Procedencia.api";
import ReservacionesApi from "../../../api/Reservaciones.api";
import PatronoApi from "../../../api/Patrono.api";
import { useLayout } from "../../../context/LayoutContext";

dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";
const { Header, Content } = Layout;
const { RangePicker } = DatePicker;

function ReporteHuesped() {
  const { setCurrentPath } = useLayout();

  const [procedencia, setProcedencia] = useState(-1);
  const [patrono, setPatrono] = useState(-1);

  const [genero, setGenero] = useState(-1);
  const [searchProcedencia, setSearchProcedencia] = useState("");
  const [searchPatrono, setSearchPatrono] = useState("");

  const [patronos, setPatronos] = useState([]);
  const [procedencias, setProcedencias] = useState([]);
  const [generos, setGeneros] = useState([
    { value: -1, label: "Todos los Generos" },
    { value: 1, label: "Masculino" },
    { value: 2, label: "Femenino" },
  ]);
  const [loading, setLoading] = useState(false);

  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString());
  const [fechaFinal, setFechaFinal] = useState(new Date().toISOString());

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
    if (ofrenda.AfiliadoReservacions[0]) {
      return (
        ofrenda.AfiliadoReservacions[0].Afiliado.PatronoAfiliados[0].id_patrono ===
        patrono
      );
    }

    return false;
  };

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [page1, setPage1] = useState(1);
  const [pageSize1, setPageSize1] = useState(5);

  useEffect(() => {
    loadData();

    setCurrentPath("/ Reportes / Reporte de Huespedes");
  }, [fechaInicio, fechaFinal, procedencia, patrono, genero]);

  const [hombre, setHombres] = useState([]);
  const [mujer, setMujeres] = useState([]);
  const [totalHombre, setTotalHombres] = useState(0.0);
  const [totalMujer, setTotalMujeres] = useState(0.0);

  var accent_map = {
    á: "a",
    é: "e",
    è: "e",
    í: "i",
    ó: "o",
    ú: "u",
    Á: "a",
    É: "e",
    Í: "i",
    Ó: "o",
    Ú: "u",
  };
  function accent_fold(s) {
    if (!s) {
      return "";
    }
    var ret = "";
    for (var i = 0; i < s.length; i++) {
      ret += accent_map[s.charAt(i)] || s.charAt(i);
    }
    return ret;
  }

  const cargarProcedenciaHombres = async (dataSource) => {
    try {
      const response = await ProcedenciaApi.getProcedenciasRequest();
      if (!response) {
        throw new Error("No se pudo cargar la informacion de la Persona");
      }
      if (response.status === 201) {
        const Procedencia = response.data.map((item) => ({
          id_procedencia: item.id_procedencia,
          departamento: item.departamento,
          municipio: item.municipio,
        }));

        const personasyProcedencia = dataSource.map((persona, index) => ({
          ...persona,
          departamento: Procedencia.find(
            (proc) => proc.id_procedencia === persona.id_procedencia
          ).departamento,
          municipio: Procedencia.find(
            (proc) => proc.id_procedencia === persona.id_procedencia
          ).municipio,
        }));

        setTotalHombres(personasyProcedencia);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cargarProcedenciaMujeres = async (dataSource) => {
    try {
      const response = await ProcedenciaApi.getProcedenciasRequest();
      if (!response) {
        throw new Error("No se pudo cargar la informacion de la Persona");
      }
      if (response.status === 201) {
        const Procedencia = response.data.map((item) => ({
          id_procedencia: item.id_procedencia,
          departamento: item.departamento,
          municipio: item.municipio,
        }));

        const personasyProcedencia = dataSource.map((persona, index) => ({
          ...persona,
          departamento: Procedencia.find(
            (proc) => proc.id_procedencia === persona.id_procedencia
          ).departamento,
          municipio: Procedencia.find(
            (proc) => proc.id_procedencia === persona.id_procedencia
          ).municipio,
        }));

        setTotalMujeres(personasyProcedencia);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetHombres = (fechaInicio, fechaFinal) => {
    axiosInstance
      .get(`http://localhost:3001/reservaciones/huespedPorGenero/hombres`, {
        params: {
          fechaInicio: fechaInicio,
          fechaFinal: fechaFinal,
        },
      })
      .then((response) => {
        const todo = response.data;

        const Hombrestodos = todo.hombres.rows.map((item) => ({
          key: item.id_huesped,
          dni: item.PacienteHuesped.Huesped.Persona.dni,
          nombre:
            item.PacienteHuesped.Huesped.Persona.primer_nombre +
            " " +
            item.PacienteHuesped.Huesped.Persona.segundo_nombre,
          apellido:
            item.PacienteHuesped.Huesped.Persona.primer_apellido +
            " " +
            item.PacienteHuesped.Huesped.Persona.segundo_apellido,
          reingreso: item.PacienteHuesped.Huesped.reingreso,
          id_procedencia: item.PacienteHuesped.Huesped.Persona.id_procedencia,
        }));

        cargarProcedenciaHombres(Hombrestodos);
        setHombres(todo.hombres.count);
      })
      .catch((error) => {
        console.error("Error fetching hombres:", error);
      });
  };

  const handleGetMujeres = (fechaInicio, fechaFinal) => {
    axiosInstance
      .get(`http://localhost:3001/reservaciones/huespedPorGenero/mujeres`, {
        params: {
          fechaInicio: fechaInicio,
          fechaFinal: fechaFinal,
        },
      })
      .then((response) => {
        const todo = response.data;

        const Hombrestodos = todo.hombres.rows.map((item) => ({
          key: item.id_huesped,
          dni: item.PacienteHuesped.Huesped.Persona.dni,
          nombre:
            item.PacienteHuesped.Huesped.Persona.primer_nombre +
            " " +
            item.PacienteHuesped.Huesped.Persona.segundo_nombre,
          apellido:
            item.PacienteHuesped.Huesped.Persona.primer_apellido +
            " " +
            item.PacienteHuesped.Huesped.Persona.segundo_apellido,
          reingreso: item.PacienteHuesped.Huesped.reingreso,
          id_procedencia: item.PacienteHuesped.Huesped.Persona.id_procedencia,
        }));

        cargarProcedenciaMujeres(Hombrestodos);
        setMujeres(todo.hombres.count);
      })
      .catch((error) => {
        console.error("Error fetching mujeres:", error);
      });
  };

  const loadData = async () => {
    setLoading(true);

    try {
      if (procedencias.length === 0) {
        await loadProcedencias();
      }

      if (patronos.length === 0) {
        await loadPatronos();
      }

      const response = await ReservacionesApi.getReservacionesHombres(
        fechaInicio,
        fechaFinal
      );


      if (!response || response.status < 200 || response.status >= 300) {
        throw new Error("No se pudo cargar la informacion de la Persona");
      }


      let todo = response.data.hombres.rows;

      if (genero !== -1) {
        todo = todo.filter(
          (ofrenda) =>
            ofrenda.PacienteHuesped.Huesped.Persona.genero ===
            (genero === 1 ? "MASCULINO" : "FEMENINO")
        );
      }

      if (procedencia !== -1) {
        todo = todo.filter(
          (ofrenda) =>
            ofrenda.PacienteHuesped.Huesped.Persona.id_procedencia ===
            procedencia
        );
      }

      if (patrono !== -1) {
        todo = todo.filter(compararPatrono);
      }

      if (todo) {
        let Hombrestodos = todo.map((item) => ({
          key: item.id_huesped,
          dni: item.PacienteHuesped.Huesped.Persona.dni,
          nombre:
            item.PacienteHuesped.Huesped.Persona.primer_nombre +
            " " +
            item.PacienteHuesped.Huesped.Persona.segundo_nombre,
          apellido:
            item.PacienteHuesped.Huesped.Persona.primer_apellido +
            " " +
            item.PacienteHuesped.Huesped.Persona.segundo_apellido,
          reingreso: item.PacienteHuesped.Huesped.reingreso,
          id_procedencia: item.PacienteHuesped.Huesped.Persona.id_procedencia,
          patrono:
            item.AfiliadoReservacions[0] == null
              ? "No tiene"
              : item.AfiliadoReservacions[0].Afiliado.PatronoAfiliados[0]
                  .Patrono.nombre,
        }));

        await cargarProcedenciaHombres(Hombrestodos);
        setHombres(todo.length);
      } else {
        setTotalHombres([]);
        setHombres(0);
      }

      const response1 = await ReservacionesApi.getReservacionesMujeres(
        fechaInicio,
        fechaFinal
      );

      if (!response1 || response1.status < 200 || response1.status >= 300) {
        throw new Error("No se pudo cargar la informacion de la Persona");
      }


      let todo1 = response1.data.hombres.rows;

      if (genero !== -1) {
        todo1 = todo1.filter(
          (ofrenda) =>
            ofrenda.PacienteHuesped.Huesped.Persona.genero ===
            (genero === 1 ? "MASCULINO" : "FEMENINO")
        );
      }

      if (procedencia !== -1) {
        todo1 = todo1.filter(
          (ofrenda) =>
            ofrenda.PacienteHuesped.Huesped.Persona.id_procedencia ===
            procedencia
        );
      }

      if (patrono !== -1) {
        todo1 = todo1.filter(compararPatrono);
      }

      

      let Hombrestodos1 = todo1.map((item) => ({
        key: item.id_huesped,
        dni: item.PacienteHuesped.Huesped.Persona.dni,
        nombre:
          item.PacienteHuesped.Huesped.Persona.primer_nombre +
          " " +
          item.PacienteHuesped.Huesped.Persona.segundo_nombre,
        apellido:
          item.PacienteHuesped.Huesped.Persona.primer_apellido +
          " " +
          item.PacienteHuesped.Huesped.Persona.segundo_apellido,
        reingreso: item.PacienteHuesped.Huesped.reingreso,
        id_procedencia: item.PacienteHuesped.Huesped.Persona.id_procedencia,
        patrono:
          item.AfiliadoReservacions[0] == null
            ? "No tiene"
            : item.AfiliadoReservacions[0].Afiliado.PatronoAfiliados[0].Patrono
                .nombre,
      }));

      await cargarProcedenciaMujeres(Hombrestodos1);
      setMujeres(todo1.length);

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onChange = (dates, dateStrings) => {
    if (dates) {
      const newFechaInicio = dateStrings[0];
      const newFechaFinal = dateStrings[1];
      setFechaInicio(newFechaInicio);
      setFechaFinal(newFechaFinal);
    }
  };

  const columns = [
    {
      title: "No. Identidad",
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
              placeholder="Ingrese el dni"
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
            ></Input>
            <Button
              style={{ marginTop: 5 }}
              className="buscar_button"
              onClick={() => {
                confirm();
              }}
              type="primary"
            >
              Buscar
            </Button>

            <Button
              style={{ marginTop: 5 }}
              className="delete_button"
              onClick={() => {
                clearFilters();
              }}
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.dni.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
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
              placeholder="Ingrese el Nombre"
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
            ></Input>
            <Button
              style={{ marginTop: 5 }}
              className="buscar_button"
              onClick={() => {
                confirm();
              }}
              type="primary"
            >
              Buscar
            </Button>

            <Button
              style={{ marginTop: 5 }}
              className="delete_button"
              onClick={() => {
                clearFilters();
              }}
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.nombre
          .toLowerCase()
          .includes(accent_fold(value.toLowerCase()));
      },
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
      key: "apellido",
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
              placeholder="Ingrese el Nombre"
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
            ></Input>
            <Button
              style={{ marginTop: 5 }}
              className="buscar_button"
              onClick={() => {
                confirm();
              }}
              type="primary"
            >
              Buscar
            </Button>

            <Button
              style={{ marginTop: 5 }}
              className="delete_button"
              onClick={() => {
                clearFilters();
              }}
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.apellido
          .toLowerCase()
          .includes(accent_fold(value.toLowerCase()));
      },
    },
    {
      title: "Reingreso",
      dataIndex: "reingreso",
      key: "reingreso",
      render: (reingreso) => {
        return <p>{reingreso == 1 ? "Reingreso" : "Primer Ingreso"}</p>;
      },
      filters: [
        { text: "Reingreso", value: "Reingreso" },
        { text: "Primer Ingreso", value: "Primer Ingreso" },
      ],
      onFilter: (value, record) => {
        return record.reingreso === value;
      },
    },
    {
      title: "Departamento",
      dataIndex: "departamento",
      key: "departamento",
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
              placeholder="Ingrese asi: departamento"
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
            ></Input>

            <Button
              style={{ marginTop: 5 }}
              onClick={() => {
                confirm();
              }}
              className="buscar_button"
              type="primary"
            >
              Buscar
            </Button>
            <Button
              style={{ marginTop: 5 }}
              onClick={() => {
                clearFilters();
              }}
              className="delete_button"
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return accent_fold(record.departamento.toLowerCase()).includes(
          accent_fold(value.toLowerCase())
        );
      },
    },
    {
      title: "Municipio",
      dataIndex: "municipio",
      key: "municipio",
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
              placeholder="Ingrese asi: municipio"
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
            ></Input>

            <Button
              style={{ marginTop: 5 }}
              onClick={() => {
                confirm();
              }}
              className="buscar_button"
              type="primary"
            >
              Buscar
            </Button>
            <Button
              style={{ marginTop: 5 }}
              onClick={() => {
                clearFilters();
              }}
              className="delete_button"
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return accent_fold(record.municipio.toLowerCase()).includes(
          accent_fold(value.toLowerCase())
        );
      },
    },
    {
      title: "Patrono",
      dataIndex: "patrono",
      key: "patrono",
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
              placeholder="Ingrese asi: patrono"
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
            ></Input>

            <Button
              style={{ marginTop: 5 }}
              onClick={() => {
                confirm();
              }}
              className="buscar_button"
              type="primary"
            >
              Buscar
            </Button>
            <Button
              style={{ marginTop: 5 }}
              onClick={() => {
                clearFilters();
              }}
              className="delete_button"
              type="danger"
            >
              Resetear
            </Button>
          </div>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return accent_fold(record.patrono.toLowerCase()).includes(
          accent_fold(value.toLowerCase())
        );
      },
    },
  ];

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
                    Hombres <ManOutlined />
                  </span>
                }
                bordered={false}
                style={{
                  backgroundColor: "#8ce4f3",
                  fontSize: 30,
                  color: "white",
                }}
                headStyle={{ color: "white", fontSize: 30 }}
              >
                {hombre > 0 ? (
                  <div>Cantidad: {hombre}</div>
                ) : (
                  <p>Cantidad: 0</p>
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title={
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {" "}
                    Mujeres <WomanOutlined />{" "}
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
                {mujer > 0 ? <div>Cantidad: {mujer}</div> : <p>Cantidad: 0</p>}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title={
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {" "}
                    Total <TeamOutlined />
                  </span>
                }
                bordered={false}
                style={{
                  backgroundColor: "#74dca4",
                  color: "white",
                  fontSize: 30,
                }}
                headStyle={{ color: "white", fontSize: 30 }}
              >
                {mujer + hombre > 0 ? (
                  <div>Cantidad: {mujer + hombre}</div>
                ) : (
                  <p>Cantidad: 0</p>
                )}
              </Card>
            </Col>
          </Row>
        </Content>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#77D9A1",
                cellFontSize: 17,
                headerColor: "#FFFFFF",
                colorText: "#3e3e3e",
              },
              Divider: {
                marginTop: 35,
                fontSize: 34,
                colorTextHeading: "#3e3e3e",
                colorText: "#77D9A1",
              },
            },
          }}
        >
          <Divider style={{ marginTop: 35, fontSize: 34, color: "#8ce4f3" }}>
            Hombres
          </Divider>
          <Table
            style={{ margin: "5px 0", headerBg: "#8ce4f3" }}
            dataSource={totalHombre}
            columns={columns}
            scroll={{ x: true }}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: totalHombre.length,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
          />

          <Divider style={{ marginTop: 35, fontSize: 34, color: "#fcb4b4" }}>
            Mujeres
          </Divider>
          <Table
            style={{ margin: "5px 0", headerBg: "#fcb4b4" }}
            dataSource={totalMujer}
            columns={columns}
            scroll={{ x: true }}
            pagination={{
              current: page1,
              pageSize: pageSize1,
              total: totalMujer.length,
              onChange: (page1, pageSize1) => {
                setPage1(page1);
                setPageSize1(pageSize1);
              },
            }}
          />
        </ConfigProvider>
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

export default ReporteHuesped;
