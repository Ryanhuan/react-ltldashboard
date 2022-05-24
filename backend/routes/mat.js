var express = require('express');
var Sequelize = require('sequelize');
var async = require("async");
var db = require('../db/database');
var m_db = require("../model/m_db");

var router = express.Router();


//錯誤處理用設定
const err_set = {
    layout: false
};
const Op = Sequelize.Op;

//查詢 
router.post("/Query", function (req, res, next) {
    var rtn = {};
    db.transaction().then(function (t) {
        try {
            async.series([
                function (next) {
                    var qry = {};
                    var input = req.body;
                    // console.log(req.body);
                    if (input.id != undefined && input.id != "") {
                        qry.id = {};
                        qry.id[Op.like] = '%' + input.id + '%';
                    }
                    if (input.type != undefined && input.type != "") {
                        qry.type = input.type;
                    }
                    if (input.name != undefined && input.name != "") {
                        qry.name = {};
                        qry.name[Op.like] = '%' + input.name + '%';
                    }
                    if (input.size != undefined && input.size != "") {
                        qry.size = {};
                        qry.size[Op.like] = '%' + input.size + '%';
                    }
                    if (input.quality != undefined && input.quality != "") {
                        qry.quality = input.quality;
                    }
                    if (input.store_name != undefined && input.store_name != "") {
                        qry.store_name = {};
                        qry.store_name[Op.like] = '%' + input.store_name + '%';
                    }
                    if (input.memo != undefined && input.memo != "") {
                        qry.memo = {};
                        qry.memo[Op.like] = '%' + input.memo + '%';
                    }
                    if (input.price_per_s != undefined && input.price_per_s != "") {
                        qry.price_per = {};
                        qry.price_per[Op.gte] = input.price_per_s;
                    }
                    if (input.price_per_e != undefined && input.price_per_e != "") {
                        if (qry.price_per == undefined) {
                            qry.price_per = {};
                        }
                        qry.price_per[Op.lte] = input.price_per_e;
                    }
                    var options = {};
                    m_db.query("materials", qry, options, function (err, result) {
                        if (err != null) {
                            console.log(err);
                            rtn.msg = err.message;
                            res.json(rtn);
                        } else {
                            rtn.data = result;
                            next();
                        }
                    })
                },
                function (next) {
                    //quality=>Get desc
                    var datalist = rtn.data;
                    let requests = datalist.map((dataele) => {
                        return new Promise((resolve, reject) => {
                            codeDescPromise(dataele, "quality", t, resolve, reject)
                        });
                    });
                    Promise.all(requests).then(value => {
                        for (var i = 0; i < value.length; i++) {
                            if (value[i].length != 0) {
                                // console.log(rtn.data[i].dataValues.quality);
                                // console.log(value[i][0].dataValues.code_desc1);
                                rtn.data[i].dataValues.quality = value[i][0].dataValues.code_desc1;
                            }
                        }
                        next();
                    }, resion => {
                        t.rollback();
                        rtn.msg = "err";
                        res.json(rtn);
                    });
                },
                function (next) {
                    //type=>Get desc
                    var datalist = rtn.data;
                    let requests = datalist.map((dataele) => {
                        return new Promise((resolve, reject) => {
                            codeDescPromise(dataele, "type", t, resolve, reject)
                        });
                    });
                    Promise.all(requests).then(value => {
                        for (var i = 0; i < value.length; i++) {
                            if (value[i].length != 0) {
                                // console.log(rtn.data[i].dataValues.type);
                                // console.log(value[i][0].dataValues.code_desc1);
                                rtn.data[i].dataValues.type = value[i][0].dataValues.code_desc1;
                            }
                        }
                        t.commit();
                        rtn.msg = "OK";
                        res.json(rtn);
                    }, resion => {
                        t.rollback();
                        rtn.msg = "err";
                        res.json(rtn);
                    });
                }
            ])
        } catch (err) {
            rtn.msg = err.message;
            res.json(rtn)
        }
    })
});

function codeDescPromise(data, search, t, resolve, reject) {
    try {
        var qry = {};
        var tmp = search;
        if (search == "type") {
            qry.code_seq1 = data.type;
        }
        if (search == "quality") {
            qry.code_seq1 = data.quality;
        }
        var options = {};
        m_db.query("publiccode", qry, options, function (err, result) {
            if (err != null) {
                console.log("err");
                console.log(err);
                reject();
            } else {
                // console.log("result");
                // console.log(result);
                resolve(result);
            }
        })
    } catch (err) {
        reject();
    }
}

//資料修改
router.post("/EditChange", function (req, res, next) {
    var data = req.body;
    var datalist = JSON.parse(data.data);
    var rtn = {};
    db.transaction().then(function (t) {
        try {
            async.series([
                function (next) {
                    //type=>Get SEQ
                    let requests = datalist.map((dataele) => {
                        return new Promise((resolve, reject) => {
                            codeSeqPromise(dataele, "type", t, resolve, reject)
                        });
                    });
                    Promise.all(requests).then(value => {
                        for (var i = 0; i < value.length; i++) {
                            if (value[i].length != 0) {
                                datalist[i].type = value[i][0].dataValues.code_seq1;
                            }
                        }
                        next();
                    }, resion => {
                        t.rollback();
                        rtn.msg = "err";
                        res.json(rtn);
                    });
                },
                function (next) {
                    //quality=>Get SEQ
                    let requests = datalist.map((dataele) => {
                        return new Promise((resolve, reject) => {
                            codeSeqPromise(dataele, "quality", t, resolve, reject)
                        });
                    });
                    Promise.all(requests).then(value => {
                        for (var i = 0; i < value.length; i++) {
                            if (value[i].length != 0) {
                                datalist[i].quality = value[i][0].dataValues.code_seq1;
                            }
                        }
                        next();
                    }, resion => {
                        t.rollback();
                        rtn.msg = "err";
                        res.json(rtn);
                    });
                },
                function (next) {
                    let requests = datalist.map((updatedata) => {
                        return new Promise((resolve, reject) => {
                            EditPromise(updatedata, t, resolve, reject)
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
                }
            ])
        } catch (err) {
            rtn.msg = err.message;
            res.json(rtn)
        }
    })
});


function codeSeqPromise(data, search, t, resolve, reject) {
    try {
        var qry = {};
        if (search == "type") {
            qry.code_desc1 = data.type;
        }
        if (search == "quality") {
            qry.code_desc1 = data.quality;
        }
        var options = {};
        m_db.query("publiccode", qry, options, function (err, result) {
            if (err != null) {
                console.log("err");
                console.log(err);
                reject();
            } else {
                // console.log("result");
                // console.log(result);
                resolve(result);
            }
        })
    } catch (err) {
        reject();
    }
}



function EditPromise(data, t, resolve, reject) {
    try {
        var qry = {};
        qry.guid = data.guid;
        delete data.guid;
        m_db.updateWithTx(data, 'materials', qry, t, function (err, result) {
            if (err != null) {
                console.log(err);
                reject();
            } else {
                resolve();
            }
        })
    } catch (err) {
        reject();
    }
}

//新增
router.post("/Insert", function (req, res, next) {
    var rtn = {};
    try {
        var cols = [
            "id", "type", "name", "size", "unit", "quality",
            "price", "num", "price_per", "store_name", "memo"
        ];
        var todbdata = {};
        cols.forEach(col => {
            if (req.body.data["add_" + col] != undefined && req.body.data["add_" + col] != "") {
                todbdata[col] = req.body.data["add_" + col];
            }
        });
        // console.log(todbdata);
        // todbdata.cr_date = utility.get_today();

        m_db.insert(todbdata, 'materials', function (err, result) {
            if (err != null) {
                console.log(err);
                if (err = 'Validation error') {
                    rtn.msg = 'ID重複';
                    res.json(rtn);
                } else {
                    rtn.msg = err.message;
                    res.json(rtn);
                }
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


//編輯
router.post("/Edit", function (req, res, next) {
    var rtn = {};
    try {
        var todbdata = req.body;
        async.series([
            function (next) {
                //type=>Get SEQ
                var qry = {};
                qry.code_desc1 = todbdata.type;
                var options = {};

                m_db.query("publiccode", qry, options, function (err, result) {
                    if (err != null) {
                        console.log("err");
                        console.log(err);
                        res.json(rtn);
                    } else {
                        todbdata.type = result[0].dataValues.code_seq1;
                        next();
                    }
                })
            },
            function (next) {
                //quality=>Get SEQ
                var qry = {};
                qry.code_desc1 = todbdata.quality;
                var options = {};

                m_db.query("publiccode", qry, options, function (err, result) {
                    if (err != null) {
                        console.log("err");
                        console.log(err);
                        res.json(rtn);
                    } else {
                        todbdata.quality = result[0].dataValues.code_seq1;
                        console.log(todbdata);
                        next();
                    }
                })
            },
            function (next) {
                var where = {};
                where.guid = req.body.guid;
                // todbdata.up_date = utility.get_today();
                m_db.update(todbdata, "materials", where, function (err, result) {
                    if (err != null) {
                        console.log(err);
                        if (err = 'Validation error') {
                            rtn.msg = 'ID重複';
                            res.json(rtn);
                        } else {
                            rtn.msg = err.message;
                            res.json(rtn);
                        }
                    } else {
                        rtn.msg = "OK";
                        res.json(rtn);
                    }
                })
            }
        ])
    } catch (err) {
        rtn.msg = err.message;
        res.json(rtn)
    }
});




//刪除
router.post("/Delete", function (req, res, next) {

    var rtn = {};
    try {
        var where = {};
        where.guid = req.body.guid;

        m_db.delete("materials", where, function (err, result) {
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



router.post("/Detail", function (req, res, next) {
    var rtn = {};
    try {
        var qry = {};
        qry.guid = req.body.guid;
        var options = {};

        m_db.query("materials", qry, options, function (err, result) {
            if (err != null) {
                console.log(err);
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


module.exports = router;