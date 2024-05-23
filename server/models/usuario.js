const { DataTypes } = require('sequelize');
const sequelize = require('../Db');
const hospital = require('./hospital')
const persona = require('./persona')

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_persona: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    id_hospital: {
        type: DataTypes.INTEGER,
        allowNull: true, 
    },
    nickname: {
        type: DataTypes.STRING(25),
        unique: true,
        allowNull: false,
    },
    contrasena: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM('admin', 'usuario', 'otro'), 
        allowNull: false,
    },
},
    {
        tableName: 'persona',
        timestamp: false
    }
);

const UsuarioPrivilegio = sequelize.define('UsuarioPrivilegio', {
    id_usuario_privilegio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_privilegio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'usuario_privilegio',
    timestamps: false,
  });

  const Privilegio = sequelize.define('Privilegio', {
    id_privilegio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    descripcion: {
      type: DataTypes.STRING(355),
      allowNull: false,
    },
  }, {
    tableName: 'privilegio',
    timestamps: false,
  });

UsuarioPrivilegio.hasMany(Usuario, {foreignKey: 'id_usuario'})
UsuarioPrivilegio.hasMany(Privilegio, {foreignKey: 'id_privilegio'});

Usuario.hasOne(Persona, {foreignKey: 'id_persona'})
Usuario.hasMany(Hospital, {foreignKey: 'id_hospital'})
module.exports = Usuario;

