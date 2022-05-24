'use strict';

const {
    INTEGER
} = require('sequelize');
var Sequelize = require('sequelize');
var db = require("./database");
var object = db.define("publiccode", {
    code_type: {
        field: "code_type",
        type: Sequelize.STRING(10),
        allowNull: false,
    },
    code_seq1: {
        field: "code_seq1",
        type: Sequelize.STRING(10),
    },
    code_seq2: {
        field: "code_seq2",
        type: Sequelize.STRING(10),
    },
    code_seq3: {
        field: "code_seq3",
        type: Sequelize.STRING(10),
    },
    code_desc1: {
        field: "code_desc1",
        type: Sequelize.STRING(50),
    },
    code_desc2: {
        field: "code_desc2",
        type: Sequelize.STRING(50),
    },
    mark: {
        field: "mark",
        type: Sequelize.STRING,
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