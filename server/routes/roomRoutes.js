const { Router } = require('express');
const roomController = require('../controllers/roomController');

const roomRouter = Router();

roomRouter.post('/habitaciones', roomController.createHabitacion);
roomRouter.get('/habitaciones', roomController.getHabitaciones);
roomRouter.get('/habitaciones/:id', roomController.getHabitacionById);
roomRouter.put('/habitaciones/:id', roomController.editHabitacion);


roomRouter.post('/camas', roomController.createCama);
roomRouter.get('/camas', roomController.getCamas);
roomRouter.get('/camas/:id', roomController.getCamaById);
roomRouter.put('/camas/:id', roomController.editCama);

roomRouter.post('/reservaciones', roomController.createReservacion);
roomRouter.get('/reservaciones/:id', roomController.getReservacionById);
roomRouter.put('/reservaciones/:id', roomController.editReservacion);
roomRouter.get('/reservaciones/huesped/:id', roomController.getReservacionByIdHuespedActiva);

module.exports = roomRouter;