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
roomRouter.get('/reservaciones', roomController.getReservaciones);

module.exports = roomRouter;