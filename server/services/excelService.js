const ExcelJS = require("exceljs");
const { Persona, Ocupacion, Procedencia, Lugar } = require("../models/persona");
const {
  Huesped,
  PacienteHuesped,
  AfiliadoHuesped,
} = require("../models/huesped");
const sequelize = require("../Db");
const Paciente = require("../models/paciente");


exports.getDataForExcel = async () => {
  try{
 const data = await sequelize.query("select * from data_excel order by fecha_entrada desc");
 
  return data;
  } catch(error){
    console.error("Error fetching excel:", error);
    throw error;
  }
};
