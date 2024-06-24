import React from "react";
import { Card, ConfigProvider, Table, Button } from "antd";
import { HeartOutlined } from "@ant-design/icons";

function OfrendasHuesped({ dataSource, handleShowModal }) {
  const { Meta } = Card;

  const columns = [
    
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#77D9A1",
            cellFontSize: 15,
            headerColor: "#FFFFFF",
            colorText: "#3e3e3e",
          },
        },
        token: {
          colorPrimaryHover: "#92e1b4",
          colorPrimary: "#77d9a1",
          colorText: "#626262",
          colorBgContainerDisabled: "#fcfcfc",
          colorTextDisabled: "#939393",
        },
      }}
    >
      <Card>
        <div className=" select-none mb-5">
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{ pageSize: 7 }}
          />
        </div>

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
            icon={<HeartOutlined />}
            type="primary"
            size={"large"}
            onClick={handleShowModal}
          >
            Depositar Ofrenda
          </Button>
        </ConfigProvider>
      </Card>
    </ConfigProvider>
  );
}

export default OfrendasHuesped;
