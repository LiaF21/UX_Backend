const { Sequelize } = require("../Db");

const { ListaSolicitud } = require("../models/lista");
const { Reservacion } = require("../models/reservaciones");

exports.createReservacion = async (idSolicitud, idCama) => {
  const t = await Sequelize.transaction();

  try {
    const solicitud = await ListaSolicitud.findByPk(idSolicitud);

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    const nuevaReservacion = {
      id_paciente_huesped: solicitud.id_paciente_huesped,
      id_cama: idCama,
      id_hospital: solicitud.id_hospital,
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
