const Sequelize = require("../Db");

const { ListaSolicitud } = require("../models/lista");
const { Reservacion, Habitacion } = require("../models/reservaciones");
const { PacienteHuesped, Huesped } = require("../models/huesped");
const Paciente = require("../models/paciente");

const { Cama } = require("../models/reservaciones");
const roomService = require("../services/roomService");

exports.createReservacion = async (idSolicitud, idCama) => {
  const t = await Sequelize.transaction();

  try {
    const solicitud = await ListaSolicitud.findByPk(idSolicitud, {
      include: [
        {
          model: PacienteHuesped,
          include: Paciente,
        },
      ],
    });

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    const cama = await Cama.findByPk(idCama);

    if (!cama) {
      throw new Error("Cama no encontrada");
    }

    await cama.update({ disponible: false }, { transaction: t });

    const nuevaReservacion = {
      id_paciente_huesped: solicitud.id_paciente_huesped,
      id_cama: idCama,
      id_hospital: solicitud.PacienteHuesped.Paciente.id_hospital,
      fecha_entrada: solicitud.fecha_entrada,
      fecha_salida: solicitud.fecha_salida,
      becado: solicitud.becado,
    };

    const reservacion = await Reservacion.create(nuevaReservacion, {
      transaction: t,
    });

    await solicitud.destroy({ transaction: t });

    await t.commit();

    return reservacion;
  } catch (error) {
    await t.rollback();
    throw new Error("Error al crear reservación: " + error.message);
  }
};

exports.switchCama = async (id, idCama) => {
  const t = await Sequelize.transaction();

  try {
    const reservacion = await Reservacion.findByPk(id);

    const oldCama = await Cama.findByPk(reservacion.id_cama);

    if (!oldCama) {
      throw new Error("Cama no encontrada");
    }

    await oldCama.update({ disponible: true }, { transaction: t });

    if (!reservacion) {
      throw new Error("Reservación no encontrada");
    }

    const newCama = await Cama.findByPk(idCama);

    if (!newCama) {
      throw new Error("Cama no encontrada");
    }

    await newCama.update({ disponible: false }, { transaction: t });

    await reservacion.update({ id_cama: idCama }, { transaction: t });

    await t.commit();

    await roomService.checkearDisponibilidadHabitacion(
      oldCama.id_habitacion,
      t
    );

    await roomService.checkearDisponibilidadHabitacion(
      newCama.id_habitacion,
      t
    );

    return reservacion;
  } catch (error) {
    await t.rollback();
    throw new Error("Error al cambiar cama: " + error.message);
  }
};
