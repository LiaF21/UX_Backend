const { DataTypes } = require('sequelize');
const sequelize = require('../Db');

const Reservacion = sequelize.define('Reservacion', {
  id_reservacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_huesped: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_cama: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_hospital: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  becada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fecha_entrada: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_salida: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'reservacion',
  timestamps: false,
});

module.exports = Reservacion;