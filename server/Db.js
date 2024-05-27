const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('CasaDavid', 'postgres', 'elote200', {
  host: '44.202.106.102',
  dialect: 'postgres',
  logging: console.log,
});

module.exports = sequelize;
