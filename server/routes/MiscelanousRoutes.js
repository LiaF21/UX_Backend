const express = require("express");
const router = express.Router();
const solicitudController = require("../controllers/listaSolicitudController");
const MiscelanousController = require("../controllers/MiscelanousController")

router.get("/solicitudes", solicitudController.getSolicitudes);
router.post("/solicitudes", solicitudController.crearSolicitud);
router.get('/getSalidas', MiscelanousController.getReservaciones);

module.exports = router;
