const ExcelJS = require('exceljs');
const serviceExcel = require("../services/excelService");

function _calculateAge(birthday) {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs); // milliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function handleNull(value, customMessage = 'N/A') {
  return value === null || value === undefined ? customMessage : value;
}


exports.generateExcelAllTables = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    worksheet.columns = [
      { header: 'Marca Temporal', key: 'marca', width: 30 },
      { header: 'Nombre Completo del Huesped', key: 'nombre', width: 40 },
      { header: 'Numero de Identidad', key: 'dni', width: 30 },
      { header: 'Lugar de Procedencia', key: 'procedencia', width: 30 },
      { header: 'Telefono', key: 'telefono', width: 25 },
      { header: 'Sexo', key: 'genero', width: 20 },
      { header: 'Edad', key: 'edad', width: 20 },
      { header: 'Profesion u oficio', key: 'ocupacion', width: 30 },
      { header: 'Iglesia', key: 'iglesia', width: 40 },
      { header: 'Nombre Completo del Afiliado', key: 'nombreAfiliado', width: 40 },
      { header: 'Numero de Identidad del Afiliado', key: 'dniAfiliado', width: 30 },
      { header: 'Patrono', key: 'patrono', width: 30 },
      { header: 'Nombre del Paciente', key: 'nombrePaciente', width: 40 },
      { header: 'Hospital en el que se ubica', key: 'hospital', width: 40 },
      { header: 'Parentesco con el Paciente', key: 'parentesco', width: 30 },
      { header: 'Telefono del Paciente', key: 'telefonoPaciente', width: 25 },
      { header: 'Causa de visita al IHSS', key: 'causa', width: 40 },
      { header: 'Observaciones', key: 'observaciones', width: 40 }
    ];


  

    const response = await serviceExcel.getDataForExcel();
    
    const arrayData = response[0].map((item, index) => {
      console.log(item.fecha_nacimiento_huesped);

      return {
        marca: item.fecha_entrada,
        nombre: `${handleNull(item.primer_nombre_huesped)} ${handleNull(item.segundo_nombre_huesped)} ${handleNull(item.primer_apellido_huesped)} ${handleNull(item.segundo_apellido_huesped)}`,
        dni: item.dni_huesped,
        procedencia: item.departamento_huesped,
        telefono: handleNull(item.telefono_huesped, 'N/A'),
        genero: item.genero_huesped,
        edad: item.fecha_nacimiento_huesped ? _calculateAge(new Date(item.fecha_nacimiento_huesped)) : 'N/A',
        ocupacion: handleNull(item.ocupacion_huesped, 'N/A'),
        iglesia: handleNull(item.iglesia, 'N/A'),
        nombreAfiliado: handleNull(item.nombre_afiliado, 'N/A'),
        dniAfiliado: handleNull(item.dni_afiliado, 'N/A'),
        patrono: handleNull(item.nombre_patrono, 'N/A'),
        nombrePaciente: `${handleNull(item.primer_nombre_paciente)} ${handleNull(item.segundo_nombre_paciente)} ${handleNull(item.primer_apellido_paciente)} ${handleNull(item.segundo_apellido_paciente)}`,
        hospital: handleNull(item.hospital_nombre, 'N/A'),
        parentesco: handleNull(item.parentesco_paciente, 'N/A'),
        telefonoPaciente: handleNull(item.telefono_paciente, 'N/A'),
        causa: item.causa_visita,
        observaciones: handleNull(item.observaciones, 'N/A')
      };
    });


    worksheet.addRows(arrayData);

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.font = { name: 'Roboto', size: 12 };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    const headerRow = worksheet.getRow(1);
    headerRow.font = { name: 'Roboto', size: 14, bold: true, color: { argb: 'FFFFFF' } };

    headerRow.eachCell((cell, colNumber) => {
      if (cell.value) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: "ff77d9a1" }
        };
      }
    });

    worksheet.views = [
      { state: 'frozen', ySplit: 1 }
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Reporte.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  
    console.log('File write done.');
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).send('Error generating Excel file');
  }
};

exports.getDataExcel = async (req, res) => {
  try {
    const response = await serviceExcel.getDataForExcel();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
