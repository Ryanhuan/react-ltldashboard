'use strict';

const {INTEGER} = require('sequelize');
var Sequelize = require('sequelize');
var db = require("./database");
var object = db.define("products", {
    sku: {
        field: "sku",
        type: Sequelize.STRING,
        allowNull: false,
    },
    name: {
        field: "name",
        type: Sequelize.STRING(50),
    },
	kind: {
        field: "kind",
        type: Sequelize.STRING(50),
    },
    size: {
        field: "size",
        type: Sequelize.STRING(50),
    },
	inventory: {
        field: "inventory",
        type: INTEGER,
    },
	status: {
        field: "status",
        type: Sequelize.STRING(50),
    },
	catena_belong: {
        field: "catena_belong",
        type: Sequelize.STRING(20),
    },
	single_belong: {
        field: "single_belong",
        type: Sequelize.STRING(20),
    },
	catena_intro: {
        field: "catena_intro",
        type: Sequelize.STRING(50),
    },
	product_intro: {
        field: "product_intro",
        type: Sequelize.STRING(50),
    },
	other_intro: {
        field: "other_intro",
        type: Sequelize.STRING(50),
    },
	scheduled_date: {
        field: "scheduled_date",
        type: Sequelize.STRING(24),
    },
	limit_date_beg: {
        field: "limit_date_beg",
        type: Sequelize.STRING(24),
    },
	limit_date_end: {
        field: "limit_date_end",
        type: Sequelize.STRING(24),
    },
	product_items_total_price: {
        field: "product_items_total_price",
        type: Sequelize.STRING(10),
    },
	product_profit: {
        field: "product_profit",
        type: Sequelize.STRING(10),
    },
	product_price: {
        field: "product_price",
        type: Sequelize.STRING(10),
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