const ExcelJS = require('exceljs');
const sequelize = require('../Db'); 
const { QueryTypes } = require('sequelize');

const createExcelFile = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Datos');

  worksheet.columns = [
    { header: 'ID Persona', key: 'id_persona', width: 10 },
    { header: 'DNI', key: 'dni', width: 20 },
    { header: 'Primer Nombre', key: 'primer_nombre', width: 15 },
    { header: 'Segundo Nombre', key: 'segundo_nombre', width: 15 },
    { header: 'Primer Apellido', key: 'primer_apellido', width: 15 },
    { header: 'Segundo Apellido', key: 'segundo_apellido', width: 15 },
    { header: 'Dirección', key: 'direccion', width: 30 },
    { header: 'Teléfono', key: 'telefono', width: 15 },
    { header: 'Género', key: 'genero', width: 10 },
    { header: 'Fecha de Nacimiento', key: 'fecha_nacimiento', width: 15 },
    { header: 'ID Procedencia', key: 'id_procedencia', width: 15 },
    { header: 'ID Lugar', key: 'id_lugar', width: 10 },
  ];

  try {
    const result = await sequelize.query(`
      SELECT
        p.id_persona,
        p.dni,
        p.primer_nombre,
        p.segundo_nombre,
        p.primer_apellido,
        p.segundo_apellido,
        p.direccion,
        p.telefono,
        p.genero,
        p.fecha_nacimiento,
        p.id_procedencia,
        p.id_lugar
      FROM persona p
    `, { type: QueryTypes.SELECT });

    result.forEach((row) => {
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    console.error('Error generating Excel file', error);
    throw error;
  }
};

module.exports = {
  createExcelFile,
};
