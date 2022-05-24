'use strict';

var Sequelize = require('sequelize');
const fs = require("fs")
const path = require("path")
var omitNull_TorF
if (process.env.CONN_omitNull === 'false') {
    omitNull_TorF = false
} else {
    omitNull_TorF = true
}

const CONN_DATABASE = process.env.CONN_DATABASE || "LTL";
const CONN_USERNAME = process.env.CONN_USERNAME || "postgres";
const CONN_PASSWORD = process.env.CONN_PASSWORD || "good1234";
const CONN_DIALECT = process.env.CONN_DIALECT || "postgres";


const CONN_OPTION = {
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: CONN_DIALECT,
    logging: false,
    omitNull: omitNull_TorF,
    timezone: "+08:00",
    pool: {
        max: 20,
        min: 0,
        idle: 10000
    }
};

var dbStroage = new Sequelize(
    CONN_DATABASE,
    CONN_USERNAME,
    CONN_PASSWORD,
    CONN_OPTION);


module.exports = dbStroage;