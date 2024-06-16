const express = require("express");
const router = express.Router();
const solicitudController = require("../controllers/listaSolicitudController");

router.get("/solicitudes", solicitudController.getSolicitudes);
router.post("/solicitudes", solicitudController.crearSolicitud);

module.exports = router;
