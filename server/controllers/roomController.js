const roomService = require("../services/roomService");

const { Habitacion, Cama } = require("../models/reservaciones");

exports.verificarDisponibilidadHabitacion = async (habitacionId) => {
  const camas = await Cama.findAll({ where: { id_habitacion: habitacionId } });
  const todasCamasNoDisponibles = camas.every(cama => !cama.disponible);
  return todasCamasNoDisponibles;
};

 exports.actualizarDisponibilidadHabitacion = async (habitacionId, disponible) => {
  await Habitacion.update({ disponible }, { where: { id_habitacion: habitacionId } });
};
exports.createHabitacion = async (req, res) => {
  try {
    const habitacion = await roomService.createHabitacion(req.body);
    res.status(201).json(habitacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHabitacionById = async (req, res) => {
  try {
    const habitacion = await roomService.getHabitacionById(req.params.id);
    if (habitacion) {
      res.status(200).json(habitacion);
    } else {
      res.status(404).json({ message: "Habitacion no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllHabitaciones = async (req, res) => {
  try {
    const habitaciones = await roomService.getAllHabitaciones();
    if (habitaciones.length > 0) {
      res.status(200).json(habitaciones);
    } else {
      res.status(404).json({ message: "No se encontraron habitaciones" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteHabitacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHabitacion = await roomService.deleteHabitacionById(id);
    if (deletedHabitacion) {
      res.status(201).json({ message: "Habitacion eliminada exitosamente" });
    } else {
      res.status(404).json({ message: "Habitacion no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCamas = async (req, res) => {
  try {
    const camas = await roomService.getAllCamas();
    if (camas.length > 0) {
      res.status(200).json(camas);
    } else {
      res.status(404).json({ message: "No se encontraron camas" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editHabitacion = async (req, res) => {
  try {
    await roomService.editHabitacion(req.params.id, req.body);
    res.status(200).json({ message: "Habitacion modificada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCama = async (req, res) => {
  try {
    const cama = await roomService.createCama(req.body);
    res.status(201).json(cama);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCamaById = async (req, res) => {
  try {
    const cama = await roomService.getCamaById(req.params.id);
    if (cama) {
      res.status(200).json(cama);
    } else {
      res.status(404).json({ message: "Cama no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCamasByRoom = async (req, res) => {
  try {
    const camas = await roomService.getCamasByRoom(req.params.id);
    if (camas && camas.length > 0) {
      res.status(200).json({data: camas});
    } else {
      res.json({ message: "No se encontraron camas para esta habitación", data: [] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCamas = async (req, res) => {
  try {
    const camas = await roomService.getCamas();
    res.status(200).json(camas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editCama = async (req, res) => {
  try {
    await roomService.editCama(req.params.id, req.body);
    res.status(200).json({ message: "Cama modificada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCamasByDisponibilidad = async (req, res) => {
  try {
    const camas = await roomService.getCamasByDisponible();
    if (camas && camas.length > 0) {
      res.status(200).json({data: camas});
    } else {
      res.json({ message: "No se encontraron camas disponibles", data: [] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.createReservacion = async (req, res) => {
  try {
    const reservacion = await roomService.createReservacion(req.body);
    res.status(201).json(reservacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReservacionById = async (req, res) => {
  try {
    const reservacion = await roomService.getReservacionById(req.params.id);
    if (reservacion) {
      res.status(200).json(reservacion);
    } else {
      res.status(404).json({ message: "Reservacion no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReservacionByIdHuespedActiva = async (req, res) => {
  try {
    const reservacion = await roomService.getReservacionByIdHuespedActiva(
      req.params.id
    );
    if (reservacion) {
      res.status(200).json(reservacion);
    } else {
      res.status(404).json({ message: "Reservacion no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReservaciones = async (req, res)=>{
  try{
    const reservacion = await roomService.getReservacion();
    if(reservacion){
      res.status(200).json(reservacion);
    } else {
      res.status(404).json({ message: "Reservacion no encontrada" });
    }
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editReservacion = async (req, res) => {
  try {
    await roomService.editReservacion(req.params.id, req.body);
    res.status(200).json({ message: "Reservacion modificada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCamaById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCama = await roomService.deleteCamaById(id);
    if (deletedCama) {
      res.status(201).json({ message: "Cama eliminada exitosamente" });
    } else {
      res.status(404).json({ message: "Cama no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
