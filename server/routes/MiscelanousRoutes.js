const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/listaSolicitudController');

router.get('/solicitudes', solicitudController.getSolicitudes);

module.exports = router;

