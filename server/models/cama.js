const { DataTypes } = require('sequelize');
const sequelize = require('../Db');

const Cama = sequelize.define('Cama', {
  id_cama: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_habitacion: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nomre: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('matrimonial', 'camarote (cama arriba)', 'camarote (cama abajo)', 'Personal'), 
    allowNull: false,
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'cama',
  timestamps: false,
});

module.exports = Cama;