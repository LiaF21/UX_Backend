const { Router } = require("express");
const roomController = require("../controllers/roomController");
const reservacionCtrl = require("../controllers/reservacion.controller");

const roomRouter = Router();

roomRouter.post("/habitaciones", roomController.createHabitacion);
roomRouter.get("/habitaciones", roomController.getAllHabitaciones);
roomRouter.get("/habitaciones/:id", roomController.getHabitacionById);
roomRouter.put("/habitaciones/:id", roomController.editHabitacion);
roomRouter.delete("/habitaciones/:id", roomController.deleteHabitacionById);

roomRouter.get("/camas", roomController.getAllCamas);
roomRouter.post("/camas", roomController.createCama);
roomRouter.get("/camasbyroom/:id", roomController.getCamasByRoom);
roomRouter.get("/camas/:id", roomController.getCamaById);
roomRouter.put("/camas/:id", roomController.editCama);
roomRouter.get("/camasDisp", roomController.getCamasByDisponibilidad);
roomRouter.delete("/camas/:id", roomController.deleteCamaById);

roomRouter.post("/reservaciones", reservacionCtrl.createReservacion);
roomRouter.get("/reservaciones/:id", roomController.getReservacionById);
roomRouter.put("/reservaciones/:id", roomController.editReservacion);
roomRouter.get(
  "/reservaciones/huesped/:id",
  roomController.getReservacionByIdHuespedActiva
);
roomRouter.get("/getreservacion/:id", roomController.getReservacion)

module.exports = roomRouter;
