const db = require('../../db/database');
const m_db = require("../../model/m_db");
const utility = require("../../public/javascripts/utility");
var Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports = {

    /**
     * Function description : 新增材料
     * @param  {JSON} reqData 新增材料資料
     */
    insertMat: async function (reqData) {
        var rtn = {};
        try {
            let chkMatId = await checkMatId(reqData.id);

            if (chkMatId.ack == 'FAIL') {
                rtn.ack = chkMatId.ack;
                rtn.ackDesc = chkMatId.ackDesc;
                console.log("!ERR! insertMat_chkMatId_fail", chkMatId.ackDesc);
            } else {
                console.log("insertMat_chkMatId_ok");
                var insertData = reqData;
                insertData.cr_date = utility.get_today();
                // console.log("insertData",insertData);
                await m_db.insert(insertData, 'materials', function (err, result) {
                    err != null ? (rtn.ack = 'FAIL', rtn.ackDesc = err.message) : (rtn.ack = "OK", rtn.data = result);
                })
            }
            return rtn;
        } catch (err) {
            console.log("insertMat err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },

    queryMatData: async function (reqData) {
        var rtn = {};
        try {
            var options = {};
            var qry = {};
            if (reqData.id != undefined && reqData.id != "") {
                qry.id = {};
                qry.id[Op.like] = '%' + reqData.id + '%';
            }
            if (reqData.type != undefined && reqData.type != "") {
                qry.type = reqData.type;
            }
            if (reqData.name != undefined && reqData.name != "") {
                qry.name = {};
                qry.name[Op.like] = '%' + reqData.name + '%';
            }
            if (reqData.size != undefined && reqData.size != "") {
                qry.size = {};
                qry.size[Op.like] = '%' + reqData.size + '%';
            }
            if (reqData.quality != undefined && reqData.quality != "") {
                qry.quality = reqData.quality;
            }
            if (reqData.store_name != undefined && reqData.store_name != "") {
                qry.store_name = {};
                qry.store_name[Op.like] = '%' + reqData.store_name + '%';
            }
            if (reqData.memo != undefined && reqData.memo != "") {
                qry.memo = {};
                qry.memo[Op.like] = '%' + reqData.memo + '%';
            }

            if (reqData.lowPricePer != undefined && reqData.lowPricePer != "") {
                qry.price_per = {};
                qry.price_per[Op.gte] = reqData.lowPricePer;
            }
            if (reqData.highPricePer != undefined && reqData.highPricePer != "") {
                if (qry.price_per == undefined) {
                    qry.price_per = {};
                }
                qry.price_per[Op.lte] = reqData.highPricePer;
            }

            await m_db.query("materials", qry, options, async function (err, result) {
                err != null ? (rtn.ack = 'FAIL', rtn.ackDesc = err.message) :
                    (rtn.ack = "OK", rtn.data = JSON.parse(JSON.stringify(result)));
            })

            for (let ele in rtn.data) {
                rtn.data[ele].type = await this.codeDesc(rtn.data[ele].type, "ma_type");
                rtn.data[ele].quality = await this.codeDesc(rtn.data[ele].quality, "ma_quality");
            }

            return rtn;
        } catch (err) {
            console.log("queryMatData err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },

    //delete
    deleteMatData: async function (reqData) {
        var rtn = {};
        try {
            var where = {};
            where.guid = reqData.guid;

            await m_db.delete("materials", where, function (err, result) {
                err != null ? (rtn.ack = 'FAIL', rtn.ackDesc = err.message) : rtn.ack = "OK";
            })
            return rtn;
        } catch (err) {
            console.log("deleteMatData err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },
    //edit
    editMatData: async function (reqData) {
        var rtn = {};
        try {
            var where = {};
            where.guid = reqData.guid;
            upData = { ...reqData }
            upData.up_date = utility.get_today();

            await m_db.update(upData, "materials", where, function (err, result) {
                if (err != null) {
                    console.log(err);
                    if (err = 'Validation error') {
                        rtn.ack = 'FAIL';
                        rtn.ackDesc = 'ID_Repeated';
                    } else {
                        rtn.ack = 'FAIL';
                        rtn.ackDesc = err.message;
                    }
                } else {
                    rtn.ack = "OK";
                }
            })
            return rtn;
        } catch (err) {
            console.log("editMatData err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },

    codeDesc: async function (data, searchCodeType) {
        var qry = {};
        var rtn = '';
        if (data != null && data != undefined) {
            qry.code_seq1 = data;
            qry.code_type = searchCodeType;

            var options = {};

            await m_db.query("publiccode", qry, options, function (err, result) {
                if (err != null) {
                    console.log("codeDesc_err", err);
                    rtn = data;
                } else {
                    let _res = JSON.parse(JSON.stringify(result));
                    rtn = _res.length != 0 ? _res[0].code_desc1 : data;
                }
            })
        }
        return rtn;
    }

}



//檢查mat id 是否重複
async function checkMatId(Id) {
    var rtn = {};
    try {
        var options = {};
        var qry = {};
        qry.id = Id;
        await m_db.query("materials", qry, options, function (err, result) {
            if (err != null) {
                rtn.ack = 'FAIL';
                rtn.ackDesc = err.message;
            } else {
                if (result.length == 0) {
                    rtn.ack = 'OK';
                } else {
                    rtn.ack = 'FAIL';
                    rtn.ackDesc = "ID_Repeated";
                }
            }
        })
        return rtn;
    } catch (err) {
        console.log("function checkMatId err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        return rtn;
    }
}


// async function codeDesc(data, searchCodeType) {
//     var qry = {};
//     var rtn = '';
//     if (data != null && data != undefined) {
//         qry.code_seq1 = data;
//         qry.code_type = searchCodeType;

//         var options = {};

//         await m_db.query("publiccode", qry, options, function (err, result) {
//             if (err != null) {
//                 console.log("codeDesc_err", err);
//                 rtn = data;
//             } else {
//                 let _res = JSON.parse(JSON.stringify(result));
//                 rtn = _res.length != 0 ? _res[0].code_desc1 : data;
//             }
//         })
//     }
//     return rtn;
// }