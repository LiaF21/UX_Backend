const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('CasaDavid', 'postgres', 'InsertarContraseñaAquiDeLaBDLocal', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
});*/


const sequelize = new Sequelize('Casa_David', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
});


module.exports = sequelize;
