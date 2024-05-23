const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  host: '54.91.54.29',
  dialect: 'postgres',
  logging: console.log,
});

module.exports = sequelize;
