const express = require('express');
const router = express.Router();
const patientController = require('../controllers/MiscelanousController');

router.get('/lista-espera', patientController.getPersonsInListaEspera);

module.exports = router;
