import React, { useState } from "react";
import { Modal, DatePicker, Space, Input, Button, ConfigProvider } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import OfrendaApi from "../../api/Ofrenda.api";

const PagarModal = ({ isVisible, handleClose, handleOk }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [amount, setAmount] = useState(null);

  return (
    <Modal
      visible={isVisible}
      onCancel={handleClose}
      footer={null}
      centered
      width={600}
      closeIcon={<CloseOutlined style={{ fontSize: "24px" }} />}
      bodyStyle={{ textAlign: "center" }}
    >
      <Space direction="vertical" size={30} style={{ width: "60%" }}>
        <span
          style={{ fontSize: "24px", color: "#AFAFAF", fontWeight: "bold" }}
        >
          Ofrenda Ha Depositar
        </span>

        <ConfigProvider
          theme={{
            components: {
              Input: {
                addonBg: "rgb(119, 217, 161)",
                hoverBorderColor: "#77D9A1",
                activeBorderColor: "#77D9A1",
              },
            },
          }}
        >
          <Input
            addonBefore={
              <span
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                Monto a depositar
              </span>
            }
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Monto a depositar"
            style={{ fontSize: "20px" }}
          />
        </ConfigProvider>
        <Button
          key="submit"
          type="primary"
          onClick={() => handleOk(amount)}
          style={{ fontSize: "18px", height: "auto", padding: "10px 20px" }}
        >
          Depositar
        </Button>
      </Space>
    </Modal>
  );
};

export default PagarModal;
