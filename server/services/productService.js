const  {Sequelize} = require('../Db');
const {Transaccion} = require('../models/reservaciones');
const {Reglamento} = require('../models/lista');
const{Hospital, Piso, Sala}  = require('../models/hospital');


exports.createTransaccion = async (TransData) => {
  const transaccion = await Transaccion.create(TransData);
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
        [Sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFinal)],
      },
    },
  });
  return transacciones;
};

exports.getBecados = async(fechaInicio, fechaFinal)=>{
  const becados = await Transaccion.findAll({
    where:{
      fecha: {
        [Sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFinal)],
      },
      becada:true
    }
  });

  return becados;
};

exports.getDonaciones = async(fechaInicio, fechaFinal)=>{
  const donacion = await Transaccion.findAll({
    where:{
      fecha: {
        [Sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFinal)],
      },
      becada:false
    }
  });

  return donacion;
};

exports.getValor = async (fechaInicio, fechaFinal)=>{
  const transaccion = await Transaccion.findOne({
    where:{
      fecha: {
        [Sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFinal)],
      },
    }
  })
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

exports.createSala = async (SalaData) => {
  const sala = await Sala.create(SalaData);
  return sala;
};

exports.getSalaById = async (id) => {
  const sala = await Sala.findByPk(id);
  return sala;
};
