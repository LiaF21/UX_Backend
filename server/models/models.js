const { DataTypes } = require('sequelize');
const sequelize = require('../Db');
const Sequelize = require('sequelize');
const fs = require('fs');

const models = {};

fs.readdirSync(__dirname)
  .filter(file => file !== 'models.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    Object.assign(models, model);
  });

  module.exports = models;