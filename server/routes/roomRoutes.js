const { Router } = require('express');
const roomController = require('../controllers/roomController');
const lugarController = require('../controllers/lugarController');
const roomRouter = Router();
const lugarRouter = Router();

lugarRouter.post('/habitaciones', lugarController.crearlugar);
lugarRouter.get('/habitaciones', lugarController.getAllLugar);
lugarRouter.get('/habitaciones/:id', lugarController.getlugar);
lugarRouter.put('/habitaciones/:id', lugarController.editarlugar);
lugarRouter.delete('/habitaciones/:id', lugarController.eliminarlugar);

roomRouter.post('/:id/verificar-disponibilidad', async (req, res) => {
    const { id } = req.params;
    try {
      const todasCamasNoDisponibles = await roomController.verificarDisponibilidadHabitacion(id);
      await roomController.actualizarDisponibilidadHabitacion(id, !todasCamasNoDisponibles);
      res.status(200).json({ message: 'Disponibilidad de la habitación actualizada correctamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar la disponibilidad de la habitación.' });
    }
  });

roomRouter.post('/habitaciones', roomController.createHabitacion);
roomRouter.get('/habitaciones', roomController.getAllHabitaciones);
roomRouter.get('/habitaciones/:id', roomController.getHabitacionById);
roomRouter.put('/habitaciones/:id', roomController.editHabitacion);
roomRouter.delete('/habitaciones/:id', roomController.deleteHabitacionById)


roomRouter.get('/camas', roomController.getAllCamas)
roomRouter.post('/camas', roomController.createCama);
roomRouter.get('/camasbyroom/:id', roomController.getCamasByRoom);
roomRouter.get('/camas/:id', roomController.getCamaById);
roomRouter.put('/camas/:id', roomController.editCama);
roomRouter.get ('/camasDisp', roomController.getCamasByDisponibilidad)
roomRouter.delete('/camas/:id', roomController.deleteCamaById);

roomRouter.post('/reservaciones', roomController.createReservacion);
roomRouter.get('/reservaciones/:id', roomController.getReservacionById);
roomRouter.put('/reservaciones/:id', roomController.editReservacion);
roomRouter.get('/reservaciones/huesped/:id', roomController.getReservacionByIdHuespedActiva);

module.exports = roomRouter;