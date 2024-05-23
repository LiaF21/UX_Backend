const { Sequelize, DataTypes, Op } = require('sequelize');
const Transaccion = require('../models/reservaciones');
const Reglamento = require('../models/lista');
const{Hospital, Piso, Sala}  = require('../models/hospital');


exports.createTransaccion = async (id_huesped, valor, fecha, becada) => {
  const transaccion = await Transaccion.create({
    id_huesped,
    valor,
    fecha,
    becada,
  });
  return transaccion;
};

exports.getTransaccionById = async (id) => {
  const transaccion = await Transaccion.findByPk(id);
  return transaccion;
};

exports.getTransaccionesByFecha = async (fechaInicio, fechaFinal) => {
  const transacciones = await Transaccion.findAll({
    where: {
      fecha: {
        [Sequelize.Op.between]: [fechaInicio, fechaFinal],
      },
    },
  });
  return transacciones;
};

exports.createRegla = async (numero_regla, descripcion_regla) => {
  const regla = await Reglamento.create({
    numero_regla,
    descripcion_regla,
  });
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

exports.editRegla = async (id, numero_regla, descripcion_regla) => {
  await Reglamento.update(
    {
      numero_regla,
      descripcion_regla,
    },
    {
      where: { id_regla: id },
    }
  );
};

exports.createHospital = async (nombre, direccion) => {
  const hospital = await Hospital.create({
    nombre,
    direccion,
  });
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

exports.createPiso = async (id_hospital, nombre_piso) => {
  const piso = await Piso.create({
    id_hospital,
    nombre_piso,
  });
  return piso;
};

exports.getPisoById = async (id) => {
  const piso = await Piso.findByPk(id);
  return piso;
};

exports.createSala = async (id_piso, nombre_sala) => {
  const sala = await Sala.create({
    id_piso,
    nombre_sala,
  });
  return sala;
};

exports.getSalaById = async (id) => {
  const sala = await Sala.findByPk(id);
  return sala;
};
