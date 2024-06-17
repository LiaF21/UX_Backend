const express = require('express');
const { downloadExcel } = require('../controllers/controlador_excel');
const router = express.Router();

router.get('/download-excel', downloadExcel);

module.exports = router;
