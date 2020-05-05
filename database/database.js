const Sequelize = require('sequelize');

const connection = new Sequelize('projetoblog', 'root', 'hashiba', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;