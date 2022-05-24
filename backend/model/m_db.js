'use strict'

var db = require('../db/database');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

var publiccode = require("../db/publiccode");

//-------------------------------------------
// 要公開之 function
module.exports = {
    /**
     * free format查詢
     * @param  {JSON} qry 查詢條件
     * @param  {JSON} qryinfo 
     * @param  {any} callback 
     */
    Query_free: function (qry, qryinfo, callback) {
        var option = {
            where: qry
        }
        if (qryinfo.order != null) {
            option.order = qryinfo.order;
        }
        if (qryinfo.attributes != null) {
            option.attributes = qryinfo.attributes;
        }
        if (qryinfo.limit != null) {
            option.limit = qryinfo.limit;
        }
        if (qryinfo.group != null) {
            option.group = qryinfo.group;
        }
        qryinfo.table.findAll(option).then(function (result) {
            callback(null, result);
        }).catch(function (err) {
            callback(err);
        })
    },

    /**
     * DB查詢
     * @param  {String} table 資料表名稱
     * @param  {JSON} qry 查詢條件
     * @param  {JSON} options Sequelize Options
     * @param  {any} callback 
     */
    query:async function (table, qry, options, callback) {
        var tb = require('../db/' + table);
        options.where = qry;
       await tb.findAll(options).then(function (result) {
            callback(null, result);
        }).catch(function (err) {
            callback(err);
        })
    },

    /**
     * DB新增
     * @param  {JSON} insertdata 新增資料
     * @param  {String} table 資料表名稱
     * @param  {any} callback 
     */
    insert: function (insertdata, table, callback) {
        var tb = require('../db/' + table);

        tb.create(insertdata).then(function (result) {
            callback(null, result);
        }).catch(function (err) {
            callback(err);
        })
    },

    /**
     * DB新增(含交易)
     * @param  {JSON} insertdata 新增資料
     * @param  {String} table 資料表名稱
     * @param  {Transaction} t DB Transaction
     * @param  {any} callback 
     */
    insertWithTx: function (insertdata, table, t, callback) {
        var tb = require('../db/' + table);
        tb.create(
            insertdata, {
                transaction: t
            }).then(function (result) {
            callback(null, result);
        }).catch(function (err) {
            callback(err);
        })
    },

    /**
     * DB更新
     * @param  {JSON} updatedata 更新資料
     * @param  {String} table 資料表名稱
     * @param  {JSON} where 更新條件
     * @param  {any} callback 
     */
    update:async function (updatedata, table, where, callback) {
        var tb = require('../db/' + table);
        await tb.update(updatedata, {
            where: where
        }).then(function (result) {
            callback(null, result);
        }).catch(function (err) {
            callback(err);
        })
    },

    /**
     * DB更新(含交易)
     * @param  {JSON} updatedata 更新資料
     * @param  {String} table 資料表名稱
     * @param  {JSON} where 更新條件
     * @param  {Transaction} t DB Transaction
     * @param  {any} callback 
     */
    updateWithTx: function (updatedata, table, where, t, callback) {
        var tb = require('../db/' + table);
        tb.update(
            updatedata, {
                where: where
            }, {
                transaction: t
            }).then(function (result) {
            callback(null, result);
        }).catch(function (err) {
            callback(err);
        })
    },

    /**
     * DB刪除
     * @param  {String} table 資料表名稱
     * @param  {JSON} where 刪除條件
     * @param  {any} callback 
     */
    delete: function (table, where, callback) {
        var tb = require('../db/' + table);
        tb.destroy({
            where: where
        }).then(function (result) {
            callback(null, result);
        }).catch(function (err) {
            callback(err);
        })
    },

    /**
     * DB刪除(含交易)
     * @param  {String} table 資料表名稱
     * @param  {JSON} where 刪除條件
     * @param  {Transaction} t DB Transaction
     * @param  {any} callback 
     */
    deleteWithTx: function (table, where, t, callback) {
        var tb = require('../db/' + table);
        tb.destroy({
            where: where
        }, {
            transaction: t
        }).then(function (result) {
            callback(null, result);
        }).catch(function (err) {
            callback(err);
        })
    },

    /**
     * Raw SQL 查詢
     * @param  {String} sql 查詢語法
     * @param  {JSON} replacements 替換資料
     * @param  {any} callback 
     */
    execSelectSQL: function (sql, replacements, callback) {
        db.query(sql, {
            replacements: replacements,
            type: Sequelize.QueryTypes.SELECT
        }).then(function (data) {
            callback(null, data);
        }).catch(function (err) {
            callback(err);
        });
    },

    query_publiccode: function (qry, callback) {
        publiccode.findAll({
            where: qry,
            order: [
                ["code_seq1", "asc"]
            ]
        }).then(function (result) {
            callback(result);
        }).catch(function (err) {
            throw err
        })
    },

}

function insertPromise(table, data, t, resolve, reject) {
    try {
        table.create(
            data, {
                transaction: t
            }).then(function (result) {
            resolve();
        }).catch(function (err) {
            reject();
        })
    } catch (err) {
        reject();
    }
}

function updatePromise(table, data, where, t, resolve, reject) {
    try {

        table.update(data, {
            where: where
        }).then(function (result) {
            resolve();
        }).catch(function (err) {
            reject();
        })

    } catch (err) {
        reject();
    }
}