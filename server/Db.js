const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('CasaDavid', 'postgres', 'valeria', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
});


module.exports = sequelize;
