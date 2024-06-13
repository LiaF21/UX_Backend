const { Router } = require("express");
const roomController = require("../controllers/roomController");
const lugarController = require("../controllers/lugarController");
const reservacionController = require("../controllers/reservacion.controller");

const Product = require("../controllers/productController");
const ofrendaController = require("../controllers/ofrendas.controller");
const roomRouter = Router();

roomRouter.post("/lugar", lugarController.crearlugar);
roomRouter.get("/lugar", lugarController.getAllLugar);
roomRouter.get("/lugar/:id", lugarController.getlugar);
roomRouter.put("/lugar/:id", lugarController.editarlugar);
roomRouter.delete("/lugar/:id", lugarController.eliminarlugar);

roomRouter.post("/:id/verificar-disponibilidad", async (req, res) => {
  const { id } = req.params;
  try {
    const todasCamasNoDisponibles =
      await roomController.verificarDisponibilidadHabitacion(id);
    await roomController.actualizarDisponibilidadHabitacion(
      id,
      !todasCamasNoDisponibles
    );
    res
      .status(200)
      .json({
        message: "Disponibilidad de la habitación actualizada correctamente.",
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "Error al actualizar la disponibilidad de la habitación.",
      });
  }
});

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

roomRouter.post("/reservaciones", reservacionController.createReservacion);
roomRouter.get("/reservaciones/:id", roomController.getReservacionById);
roomRouter.put("/reservaciones/:id", roomController.editReservacion);
roomRouter.get(
  "/reservaciones/huesped/:id",
  roomController.getReservacionByIdHuespedActiva
);
roomRouter.get("/reservaciones/becados", Product.getBecados);

roomRouter.post("/ofrendas", ofrendaController.createOfrenda);
roomRouter.get("/ofrendas", ofrendaController.getAllOfrendas);
roomRouter.get("/ofrendas/:id", ofrendaController.getOfrendaById);
roomRouter.put("/ofrendas/:id", ofrendaController.updateOfrenda);
roomRouter.delete("/ofrendas/:id", ofrendaController.deleteOfrenda);
roomRouter.get(
  "/ofrendas/reservacion/:id_reservacion",
  ofrendaController.getOfrendasByReservacion
);

module.exports = roomRouter;
