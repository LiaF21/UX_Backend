const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('CasaDavid', 'postgres', 'elote200', {
  host: '44.204.47.57',
  dialect: 'postgres',

});


module.exports = sequelize;
