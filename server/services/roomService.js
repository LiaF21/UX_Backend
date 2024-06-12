const { Habitacion, Cama, Reservacion } = require('../models/reservaciones');


exports.createHabitacion = async (habitacionData) => {
  const habitacion = await Habitacion.create(habitacionData);
  return habitacion;
};

exports.getHabitacionById = async (id) => {
  const habitacion = await Habitacion.findByPk(id);
  return habitacion;
};

exports.getAllHabitaciones = async () => {
  try {
    const habitaciones = await Habitacion.findAll(); 
    return habitaciones;
  } catch (error) {
    throw Error("Error al obtener las habitaciones: " + error.message);
  }
};

exports.deleteHabitacionById = async (id) =>{
  const borrar = await Habitacion.destroy({
      where:{
          id_habitacion:id
      }
  });
  return borrar;
};

exports.editHabitacion = async (id, habitacionData) => {
  await Habitacion.update(habitacionData, { where: { id_habitacion: id } });
};

exports.getAllCamas = async () => {
  const camas = await Cama.findAll({include: 'Habitacion'})
  return camas;
}

exports.getCamasByRoom = async (habitacionId) => {
  try {
    const camas = await Cama.findAll({ where: { id_habitacion: habitacionId } });
    return camas;
  } catch (error) {
    throw new Error('Error al obtener las camas de la habitación: ' + error.message);
  }
};

exports.getCamasByDisponible = async() => {
  try {
    const camas = await Cama.findAll({ where: { disponible: true } });
    return camas;
  } catch (error) {
    throw new Error('Error al obtener las camas disponibles: ' + error.message);
  }


}
exports.deleteCamaById = async (id) =>{
  const borrar = await Cama.destroy({
      where:{
          id_cama:id
      }
  });
  return borrar;
};



exports.createCama = async (camaData) => {
  const cama = await Cama.create(camaData);
  return cama;
};

exports.getCamaById = async (id) => {
  const cama = await Cama.findByPk(id, { include: Habitacion });
  return cama;
};

exports.getCamas = async () => {
  const camas = await Cama.findAll({ include: Habitacion });
  return camas;
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

exports.getReservacionByIdHuespedActiva = async (id) => {
  const reservacion = await Reservacion.findOne({
    where: { id_huesped: id, activa: true },
  });
  return reservacion;
};

exports.editReservacion = async (id, reservacionData) => {
  await Reservacion.update(reservacionData, { where: { id_reservacion: id } });
};
