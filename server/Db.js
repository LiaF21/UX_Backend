const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'MissingLure2005', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
});

module.exports = sequelize;
