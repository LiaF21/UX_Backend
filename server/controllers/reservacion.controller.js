const reservacionService = require("../services/reservacion.services");

exports.createReservacion = async (req, res) => {
  try {
    const { idSolicitud, idCama } = req.body;

    const reservacion = await reservacionService.createReservacion(
      idSolicitud,
      idCama
    );

    if (!reservacion) {
      return res.status(404).json({ message: "Reservacion no encontrada" });
    }

    return res.status(201).json(reservacion);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
