const { Router } = require('express');
const roomController = require('../controllers/roomController');

const roomRouter = Router();

roomRouter.post('/habitaciones', roomController.createHabitacion);
roomRouter.get('/habitaciones', roomController.getAllHabitaciones);
roomRouter.get('/habitaciones/:id', roomController.getHabitacionById);
roomRouter.put('/habitaciones/:id', roomController.editHabitacion);


roomRouter.post('/camas', roomController.createCama);
roomRouter.get('/camasbyroom/:id', roomController.getCamasByRoom);
roomRouter.get('/camas/:id', roomController.getCamaById);
roomRouter.put('/camas/:id', roomController.editCama);


roomRouter.post('/reservaciones', roomController.createReservacion);
roomRouter.get('/reservaciones/:id', roomController.getReservacionById);
roomRouter.put('/reservaciones/:id', roomController.editReservacion);

module.exports = roomRouter;