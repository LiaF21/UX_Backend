const { DataTypes } = require('sequelize');
const sequelize = require('../Db');
const {Huesped} = require('./huesped')
const {Hospital} = require('./hospital')

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
    },
  }, {
    tableName: 'reservacion',
    timestamps: false,
  });

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
      type: DataTypes.ENUM('MASCULINO', 'FEMENINO', 'OTRO'),
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
  
  const Cama = sequelize.define('Cama', {
    id_cama: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_habitacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nomre: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('INDIVIDUAL', 'MATRIMONIAL', 'CAMAROTE'),
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
  
  const Transaccion = sequelize.define('Transaccion', {
    id_transaccion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_huesped: {
      type: DataTypes.INTEGER,
    },
    valor: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    becada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'transaccion',
    timestamps: false,
  });
  

  Reservacion.belongsTo(Huesped, { foreignKey: 'id_huesped' });
  Reservacion.belongsTo(Cama, { foreignKey: 'id_cama' });
  Reservacion.belongsTo(Hospital, { foreignKey: 'id_hospital' });
  
  Huesped.hasMany(Reservacion, { foreignKey: 'id_huesped' });
  Cama.hasMany(Reservacion, { foreignKey: 'id_cama' });
  Hospital.hasMany(Reservacion, { foreignKey: 'id_hospital' });
  
  Cama.belongsTo(Habitacion, { foreignKey: 'id_habitacion' });
  Habitacion.hasMany(Cama, { foreignKey: 'id_habitacion' });
  
  Transaccion.belongsTo(Huesped, { foreignKey: 'id_huesped' });
  Huesped.hasMany(Transaccion, { foreignKey: 'id_huesped' });

  module.exports = {Reservacion, Habitacion, Cama, Transaccion};