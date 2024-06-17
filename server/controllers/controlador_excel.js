const { createExcelFile } = require('../services/excelService');

const downloadExcel = async (req, res) => {
  try {
    const buffer = await createExcelFile();
    res.setHeader('Content-Disposition', 'attachment; filename="datos.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).send('Error generating Excel file');
  }
};

module.exports = {
  downloadExcel,
};
