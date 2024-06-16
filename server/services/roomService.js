const { PacienteHuesped, Huesped } = require("../models/huesped");
const { Persona, Ocupacion, Procedencia, Lugar } = require("../models/persona");
const Paciente = require("../models/paciente");
const { Hospital } = require("../models/hospital");
const {
  Habitacion,
  Cama,
  Reservacion,
  Ofrenda,
} = require("../models/reservaciones");
const { Sequelize } = require("../Db");

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

exports.getHabitacionesPorLugar = async (id_lugar) => {
  const habitacion = await Habitacion.findAll({
    where: {
      id_lugar: id_lugar,
    },
  });
  return habitacion;
};

exports.checkearDisponibilidadHabitacion = async (id, t) => {
  const camas = await Cama.findAll({
    where: { id_habitacion: id },
  });

  let camasDisponibles = true;
  camas.forEach((cama) => {
    if (!cama.disponible) {
      camasDisponibles = false;
      return;
    }
  });

  const habitacion = await Habitacion.findByPk(id);
  await habitacion.update({ disponible: camasDisponibles });
};

exports.deleteHabitacionById = async (id) => {
  const borrar = await Habitacion.destroy({
    where: {
      id_habitacion: id,
    },
  });
  return borrar;
};

exports.editHabitacion = async (id, habitacionData) => {
  await Habitacion.update(habitacionData, { where: { id_habitacion: id } });
};

exports.getAllCamas = async () => {
  const camas = await Cama.findAll({ include: "Habitacion" });
  return camas;
};

exports.getCamasByRoom = async (habitacionId) => {
  try {
    const camas = await Cama.findAll({
      where: { id_habitacion: habitacionId },
    });
    return camas;
  } catch (error) {
    throw new Error(
      "Error al obtener las camas de la habitación: " + error.message
    );
  }
};

exports.getCamasByDisponible = async () => {
  try {
    const camas = await Cama.findAll({
      where: { disponible: true },
      include: Habitacion,
    });
    return camas;
  } catch (error) {
    throw new Error("Error al obtener las camas disponibles: " + error.message);
  }
};
exports.deleteCamaById = async (id) => {
  const borrar = await Cama.destroy({
    where: {
      id_cama: id,
    },
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

exports.getCamaByGender = async (genero) => {
  if (genero != "MASCULINO" && genero != "FEMENINO") {
    return null;
  }
  //FinaAndCountAll te devuelve un objeto que cuenta el total de filas y te devuelve los objetos tambien.
  const Camas = await Cama.findAndCountAll({
    include: {
      model: Habitacion,
      where: { genero: genero },
    },
  });

  //En el JSON se devuelven como rows and count. Rows son los objetos y count el numero
  //Para el componente, usare count.
  return Camas;
};

exports.createReservacion = async (reservacionData) => {
  const reservacion = await Reservacion.create(reservacionData);
  return reservacion;
};

exports.getReservacionById = async (id) => {
  const reservacion = await Reservacion.findByPk(id, {
    include: [
      { model: Cama, include: Habitacion },
      {
        model: PacienteHuesped,
        include: [
          {
            model: Huesped,
            include: [
              {
                model: Persona,
                include: [
                  { model: Ocupacion },
                  { model: Procedencia },
                  { model: Lugar },
                ],
              },
            ],
          },
          {
            model: Paciente,
            include: [
              {
                model: Hospital,
              },
              {
                model: Persona,
                include: [
                  { model: Ocupacion },
                  { model: Procedencia },
                  { model: Lugar },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
  return reservacion;
};

exports.getReservacionByIdHuespedActiva = async (id) => {
  const reservacion = await Reservacion.findOne({
    where: { id_huesped: id, activa: true },
  });
  return reservacion;
};

exports.getBecados = async (fechaInicio, fechaFinal) => {
  const becados = await Reservacion.findAll({
    where: {
      fecha_entrada: {
        [Sequelize.Op.gte]: fechaInicio,
      },
      fecha_salida: {
        [Sequelize.Op.lte]: fechaFinal,
      },
      becado: true,
    },
    include: [{ model: Ofrenda }],
  });

  return becados;
};

exports.getDonaciones = async (fechaInicio, fechaFinal) => {
  const donacion = await Reservacion.findAll({
    where: {
      fecha_entrada: {
        [Sequelize.Op.gte]: fechaInicio,
      },
      fecha_salida: {
        [Sequelize.Op.lte]: fechaFinal,
      },
      becado: false,
    },
    include: [{ model: Ofrenda }],
  });

  return donacion;
};

exports.getHombres = async (fechaInicio, fechaFinal) => {
  const men = await Reservacion.findAndCountAll({
    where: {
      fecha_entrada: {
        [Sequelize.Op.gte]: fechaInicio,
      },
      fecha_salida: {
        [Sequelize.Op.lte]: fechaFinal,
      },
    },
    include: [
      {
        model: PacienteHuesped,
        include: [
          {
            model: Huesped,
            include: [
              {
                model: Persona,
                where: {
                  genero: "MASCULINO",
                },
              },
            ],
          },
        ],
      },
    ],
  });
  return men;
};

exports.getMujeres = async (fechaInicio, fechaFinal) => {
  const women = await Reservacion.findAndCountAll({
    where: {
      fecha_entrada: {
        [Sequelize.Op.gte]: fechaInicio,
      },
      fecha_salida: {
        [Sequelize.Op.lte]: fechaFinal,
      },
    },
    include: [
      {
        model: PacienteHuesped,
        include: [
          {
            model: Huesped,
            include: [
              {
                model: Persona,
                where: {
                  genero: "FEMENINO",
                },
              },
            ],
          },
        ],
      },
    ],
  });
  return women;
};

exports.editReservacion = async (id, reservacionData) => {
  await Reservacion.update(reservacionData, { where: { id_reservacion: id } });
};

exports.getReservacion = async () => {
  const reservacion = await Reservacion.findAll({
    include: [
      { model: Cama, include: Habitacion },
      {
        model: PacienteHuesped,
        include: [
          {
            model: Huesped,
            include: [
              {
                model: Persona,
                include: [
                  { model: Ocupacion },
                  { model: Procedencia },
                  { model: Lugar },
                ],
              },
            ],
          },
          {
            model: Paciente,
            include: [
              {
                model: Hospital,
              },
              {
                model: Persona,
                include: [
                  { model: Ocupacion },
                  { model: Procedencia },
                  { model: Lugar },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
  return reservacion;
};
