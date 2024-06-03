const { DataTypes } = require('sequelize');
const sequelize = require('../Db');

const Habitacion = sequelize.define('Habitacion', {
  id_habitacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  genero: {
    type: DataTypes.ENUM('masculino', 'femenino', 'mixto'), 
    allowNull: false,
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'habitacion',
  timestamps: false,
});

module.exports = Habitacion;