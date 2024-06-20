const express = require('express');
const excelController = require('../controllers/excelController');
const router = express.Router();

//router.get('/download-excel', downloadExcel);'
router.get("/downloadExcel", excelController.generateExcelAllTables)
router.get("/getData", excelController.getDataExcel)
module.exports = router;
