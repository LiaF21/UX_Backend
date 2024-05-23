const { DataTypes } = require('sequelize');
const sequelize = require('../Db');

const Hospital = sequelize.define('Hospital', {
    id_hospital: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'hospital',
    timestamps: false,
  });

  const Sala = sequelize.define('Sala', {
    id_sala: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_piso: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre_sala: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    tableName: 'sala',
    timestamps: false
  });

  const Piso = sequelize.define('Piso', {
    id_piso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_hospital: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre_piso: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    tableName: 'piso',
    timestamps: false
  });
  
  Piso.hasMany(Hospital, {foreignKey: 'id_hospital'})

  
  module.exports = {Hospital, Piso, Sala};