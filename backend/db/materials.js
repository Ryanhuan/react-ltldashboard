'use strict';

const {
    INTEGER
} = require('sequelize');
var Sequelize = require('sequelize');
var db = require("./database");
var object = db.define("materials", {
    id: {
        field: "id",
        type: Sequelize.STRING,
        allowNull: false,
    },
    type: {
        field: "type",
        type: Sequelize.STRING(50),
    },
    name: {
        field: "name",
        type: Sequelize.STRING(50),
    },
    size: {
        field: "size",
        type: Sequelize.STRING(50),
    },
    quality: {
        field: "quality",
        type: Sequelize.STRING(50),
    },
    price: {
        field: "price",
        type: INTEGER,
    },
    num: {
        field: "num",
        type: INTEGER,
    },
    price_per: {
        field: "price_per",
        type: INTEGER,
    },
    store_name: {
        field: "store_name",
        type: Sequelize.STRING(100),
    },
    memo: {
        field: "memo",
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