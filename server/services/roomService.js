const { Habitacion, Cama, Reservacion } = require('../models');

exports.createHabitacion = async (habitacionData) => {
  const habitacion = await Habitacion.create(habitacionData);
  return habitacion;
};

exports.getHabitacionById = async (id) => {
  const habitacion = await Habitacion.findByPk(id);
  return habitacion;
};

exports.editHabitacion = async (id, habitacionData) => {
  await Habitacion.update(habitacionData, { where: { id_habitacion: id } });
};

exports.createCama = async (camaData) => {
  const cama = await Cama.create(camaData);
  return cama;
};

exports.getCamaById = async (id) => {
  const cama = await Cama.findByPk(id);
  return cama;
};

exports.editCama = async (id, camaData) => {
  await Cama.update(camaData, { where: { id_cama: id } });
};

exports.createReservacion = async (reservacionData) => {
  const reservacion = await Reservacion.create(reservacionData);
  return reservacion;
};

exports.getReservacionById = async (id) => {
  const reservacion = await Reservacion.findByPk(id);
  return reservacion;
};

exports.editReservacion = async (id, reservacionData) => {
  await Reservacion.update(reservacionData, { where: { id_reservacion: id } });
};