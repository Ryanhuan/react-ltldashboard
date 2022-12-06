'use strict';

const {INTEGER} = require('sequelize');
var Sequelize = require('sequelize');
var db = require("./database");
var object = db.define("bom", {
    id: {
        field: "id",
        type: Sequelize.STRING,
        allowNull: false,
    },
	sku: {
        field: "sku",
        type: Sequelize.STRING,
        allowNull: false,
    },
    name: {
        field: "name",
        type: Sequelize.STRING(50),
    },
    size: {
        field: "size",
        type: Sequelize.STRING(50),
    },
	cnt_num: {
        field: "cnt_num",
        type: INTEGER,
    },
	price_per: {
        field: "price_per",
        type: INTEGER,
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