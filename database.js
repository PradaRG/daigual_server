const { Sequelize } = require("sequelize");

const host = process.env.HOST || 'localhost';
const name = process.env.DBNAME || 'database';
const user = process.env.DBUSER || 'postgres';
const password = process.env.DB_PASSWORD || 'test123';
const dialect = process.env.DB_TYPE || 'postgres';

const database = new Sequelize(name, user, password,  {
    dialect,
    host,
    define: {
        freezeTableName: true,
        paranoid: true
    },
    logging: false
});

module.exports = database;