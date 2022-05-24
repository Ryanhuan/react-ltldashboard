var express = require('express');
var Sequelize = require('sequelize');
var db = require('../db/database');
var m_db = require("../model/m_db");

var router = express.Router();
var tableName = "publiccode";

//錯誤處理用設定
const err_set = {
    layout: false
};
const Op = Sequelize.Op;

//查詢 
router.post("/Query", function (req, res, next) {
    var rtn = {};
    try {
        var qry = {};
        var input = req.body;
        if (input.code_type != undefined && input.code_type != "") {
            qry.code_type = {};
            qry.code_type[Op.like] = '%' + input.code_type + '%';
        }
        var options = {
            order: [
                ["code_type"],
                ["code_seq1"],
                ["code_seq2"]
            ]
        }
        m_db.query(tableName, qry, options, function (err, result) {
            console.log(err);
            if (err != null) {
                rtn.msg = err.message;
                res.json(rtn);
            } else {
                rtn.msg = "OK";
                rtn.data = result;
                res.json(rtn);
            }
        })
    } catch (err) {
        rtn.msg = err.message;
        res.json(rtn)
    }
});


//資料修改
router.post("/DataChange", function (req, res, next) {
    var data = req.body;
    var rtn = {};
    db.transaction().then(function (t) {
        try {
            var datalist = JSON.parse(data.data);
            let requests = datalist.map((insertdata) => {
                return new Promise((resolve, reject) => {
                    DataChangePromise(insertdata, t, resolve, reject)
                });
            });
            Promise.all(requests).then(value => {
                t.commit();
                rtn.msg = "OK";
                res.json(rtn);
            }, resion => {
                t.rollback();
                rtn.msg = "儲存時發生錯誤";
                res.json(rtn);
            });

        } catch (err) {
            rtn.msg = err.message;
            res.json(rtn)
        }
    })
});

function DataChangePromise(data, t, resolve, reject) {
    try {
        if (data.guid == null || data.guid == undefined) {
            m_db.insertWithTx(data, tableName, t, function (err, result) {
                if (err != null) {
                    reject();
                } else {
                    resolve();
                }
            })
        } else {
            var qry = {};
            qry.guid = data.guid;
            delete data.guid;
            m_db.updateWithTx(data, tableName, qry, t, function (err, result) {
                if (err != null) {
                    console.log(err);
                    reject();
                } else {
                    resolve();
                }
            })
        }
    } catch (err) {
        reject();
    }
}



//刪除
router.post("/Delete", function (req, res, next) {

    var rtn = {};
    try {
        var where = {};
        where.guid = req.body.guid;

        m_db.delete(tableName, where, function (err, result) {
            if (err != null) {
                rtn.msg = err.message;
                res.json(rtn);
            } else {
                rtn.msg = "OK";
                res.json(rtn);
            }
        })

    } catch (err) {
        rtn.msg = err.message;
        res.json(rtn)
    }

});




router.get("/getPublicCode/:code_type", function (req, res, next) {
    try {
        var qry = {};
        qry.code_type = req.params.code_type;
        qry.code_seq1 = {};
        qry.code_seq1[Op.ne] = "**";

        for (var key in req.query) {
            qry[key] = req.query[key];
        }
        m_db.query_publiccode(qry, function (result) {
            res.json(result);

        })

    } catch (err) {
        res.status(500).send(error);
    }
});



module.exports = router;