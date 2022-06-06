'use strict';

var Sequelize = require('sequelize');
var db = require("./database");
var object = db.define("member", {
    email: {
        field: "email",
        type: Sequelize.STRING,
    },
    displayname: {
        field: "displayname",
        type: Sequelize.STRING(20),
    },
    photourl: {
        field: "photourl",
        type: Sequelize.STRING,
    },
    isemailnotification: {
        field: "isemailnotification",
        type: Sequelize.BOOLEAN,
    },
    isthirdlogin: {
        field: "isthirdlogin",
        type: Sequelize.BOOLEAN,
    },
    root: {
        field: "root",
        type: Sequelize.STRING,
    },

    cr_date: {
        field: "cr_date",
        type: Sequelize.STRING(7),
    },
    up_date: {
        field: "up_date",
        type: Sequelize.STRING(7),
    },
    op_user: {
        field: "op_user",
        type: Sequelize.STRING(100),
    },
    isenabled: {
        field: "isenabled",
        type: Sequelize.BOOLEAN,
    },
    guid: {
        field: 'guid',
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4'),
        allowNull: false,
        primaryKey: true,
    },


}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = object;