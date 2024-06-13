const { Sequelize } = require("../Db");
const { Reservacion, Ofrenda } = require("../models/reservaciones");
const { Reglamento } = require("../models/lista");
const { Hospital, Piso, Sala } = require("../models/hospital");

exports.createPago = async (TransData) => {
  const pago = await Ofrenda.create(TransData);
  return pago;
};

exports.getPagoById = async (id) => {
  const pago = await Ofrenda.findByPk(id);
  return pago;
};

exports.getPagosByFecha = async (fechaInicio, fechaFinal) => {
  const pagos = await Ofrenda.findAll({
    where: {
      fecha: {
        [Sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFinal)],
      },
    },
  });
  return pagos;
};

exports.getBecados = async (fechaInicio, fechaFinal) => {
  const becados = await Reservacion.findAll({
    where: {
      fecha_entrada: {
        [Sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFinal)],
      },
      fecha_salida: {
        [Sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFinal)],
      },

      becado: true,
    },
  });

  return becados;
};

exports.getDonaciones = async (fechaInicio, fechaFinal) => {
  const donacion = await Ofrenda.findAll({
    where: {
      fecha: {
        [Sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFinal)],
      },
      becada: false,
    },
  });

  return donacion;
};

exports.getValor = async (fechaInicio, fechaFinal) => {
  const Pago = await Ofrenda.findOne({
    where: {
      fecha: {
        [Sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFinal)],
      },
    },
  });
};

exports.createRegla = async (ReglaData) => {
  const regla = await Reglamento.create(ReglaData);
  return regla;
};

exports.getReglaById = async (id) => {
  const regla = await Reglamento.findByPk(id);
  return regla;
};

exports.getReglamento = async () => {
  const reglamento = await Reglamento.findAll();
  return reglamento;
};

exports.editRegla = async (id, descripcion_regla) => {
  await Reglamento.update(
    {
      descripcion_regla,
    },
    {
      where: { id_regla: id },
    }
  );
};

exports.createHospital = async (HospitalData) => {
  const hospital = await Hospital.create(HospitalData);
  return hospital;
};

exports.getHospitalById = async (id) => {
  const hospital = await Hospital.findByPk(id);
  return hospital;
};

exports.getHospitales = async () => {
  const hospitales = await Hospital.findAll();
  return hospitales;
};

exports.deleteHospitalById = async (id) => {
  await Hospital.destroy({
    where: { id_hospital: id },
  });
};

exports.createPiso = async (PisoData) => {
  const piso = await Piso.create(PisoData);
  return piso;
};

exports.getPisoById = async (id) => {
  const piso = await Piso.findByPk(id);
  return piso;
};

exports.getPisosByHospital = async (id_hospital) => {
  const pisos = await Piso.findAll({
    where: { id_hospital: id_hospital },
  });
  return pisos;
};

exports.getAllPisos = async () => {
  const pisos = await Piso.findAll();
  return pisos;
};

exports.createSala = async (SalaData) => {
  const sala = await Sala.create(SalaData);
  return sala;
};

exports.getSalaById = async (id) => {
  const sala = await Sala.findByPk(id);
  return sala;
};

exports.getAllSalas = async () => {
  const salas = await Sala.findAll();
  return salas;
};

exports.getSalasByPiso = async (id_piso) => {
  const salas = await Sala.findAll({
    where: { id_piso: id_piso },
  });
  return salas;
};
