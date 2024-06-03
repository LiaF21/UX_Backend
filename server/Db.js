const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('CasaDavid', 'postgres', 'elote200', {
  host: '184.73.20.14',
  dialect: 'postgres',
  logging: console.log,
});


module.exports = sequelize;
