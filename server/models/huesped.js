const { DataTypes } = require('sequelize');
const sequelize = require('../Db');
const Persona = require('./persona');
const Afiliado = require('./afiliado');
const Paciente = require('./paciente')
const Iglesia = require ('./iglesia')


const Huesped = sequelize.define('Huesped', {
    id_huesped: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parentesco_paciente: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    reingreso: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'huesped',
    timestamps: false
  });
  
  const PacienteHuesped = sequelize.define('PacienteHuesped', {
    id_paciente_huesped: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_huesped: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    
  }, {
    tableName: 'paciente_huesped',
    timestamps: false
  });

  const AfiliadoHuesped = sequelize.define('AfiliadoHuesped', {
    id_afiliado_huesped: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_afiliado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_huesped: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  } ,{
    tableName: 'afiliado_huesped',
    timestamps: false
  });

  const IglesiaHuesped = sequelize.define('IglesiaHuesped', {
    id_iglesia_huesped: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_iglesia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_huesped: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'iglesia_huesped',
    timestamps:false
  });

  Huesped.hasOne(Persona, {foreignKey: 'id_persona'})


  IglesiaHuesped.hasMany(Huesped, {foreignKey: 'id_huesped'});
  IglesiaHuesped.hasMany(Iglesia, {foreignKey: 'id_iglesia'});

  AfiliadoHuesped.hasMany(Huesped, {foreignKey: 'id_huesped'});
  AfiliadoHuesped.hasMany(Afiliado, {foreignKey: 'id_afiliado'})
  
  PacienteHuesped.hasMany(Huesped, {foreignKey: 'id_huesped'});
  PacienteHuesped.hasMany(Paciente, {foreignKey: 'id_paciente'})

  module.exports = Huesped;