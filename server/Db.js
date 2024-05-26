const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('CasaDavid', 'postgres', '200521912', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
});

module.exports = sequelize;
