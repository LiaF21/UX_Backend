const { DataTypes } = require('sequelize');
const sequelize = require('../Db');
const { Piso, Sala, hospital } = require('./hospital');
const persona = require('./persona');
const { PAGLOCK } = require('sequelize/lib/table-hints');

const Paciente = sequelize.define('Paciente', {
    id_paciente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_person: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_hospital: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_piso: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_sala: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    causa_visita: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    observacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  Paciente.hasOne(persona, {foreignKey: 'id_persona'})
  Paciente.hasMany(hospital, {foreignKey: 'id_hospital'})
  Paciente.hasMany(Sala, {foreignKey: 'id_sala'})
  Paciente.hasMany(Piso, {foreignKey: 'id_piso'})

  module.exports = Paciente;