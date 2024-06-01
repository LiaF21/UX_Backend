const { DataTypes } = require('sequelize');
const sequelize = require('../Db');
const Usuario = require('./usuario');

const Persona = sequelize.define('Persona', {
    id_persona: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_ocupacion: {
      type: DataTypes.INTEGER,
    },
    id_procedencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dni: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
    primer_nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    segundo_nombre: {
      type: DataTypes.STRING(30),
    },
    primer_apellido: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    segundo_apellido: {
      type: DataTypes.STRING(30),
    },
    direccion: {
      type: DataTypes.TEXT,
    },
    telefono: {
      type: DataTypes.STRING(15),
    },
    genero: {
      type: DataTypes.ENUM('MASCULINO', 'FEMENINO', 'OTRO'),
      allowNull: false,
    },
    fecha_nacimiento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'persona',
    timestamps: false,
  });
  
  const Ocupacion = sequelize.define('Ocupacion', {
    id_ocupacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'ocupacion',
    timestamps: false
  });

  const Procedencia = sequelize.define('Procedencia', {
    id_procedencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    departamento: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    municipio: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'procedencia',
    timestamps: false
  });

  Persona.belongsTo(Ocupacion, {foreignKey: 'id_ocupacion'})
  Persona.belongsTo(Procedencia, {foreignKey: 'id_procedencia'})

  Ocupacion.hasMany(Persona, {foreignKey: 'id_ocupacion'})
  Procedencia.hasMany(Persona, {foreignKey: 'id_procedencia'})


  module.exports = {Persona, Ocupacion, Procedencia};

  