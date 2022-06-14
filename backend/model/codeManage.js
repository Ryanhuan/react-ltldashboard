const db = require('../db/database');
const m_db = require("./m_db");
const utility = require("../public/javascripts/utility");
const bcrypt = require("bcrypt");

var Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {

    /**
     * Function description : 取得代碼Type之seq&desc
     * @param  {string} type 使用者查詢條件資料
     */
    getCodeInfo: async function (type) {
        var rtn = {};
        try {
            var qry = {};
            if (type != undefined && type != "") {
                qry.code_type = {};
                qry.code_type = type;
            }
            var options = {
                order: [
                    ["code_type"],
                    ["code_seq1"],
                    ["code_seq2"]
                ]
            }
            await m_db.query("publiccode", qry, options, function (err, result) {
                result = JSON.stringify(result);
                err != null ? rtn.msg = err : rtn.msg = "OK", rtn.data = result;
            })
            return rtn;
        } catch (err) {
            rtn.status = 'Fail';
            rtn.msg = err;
            return rtn;
        }
    },

    /**
     * Function description : 取得code_Type 種類
     * @param  {string} type  要查詢之條件 ex: 要查詢 [ma_...]開頭請傳入[ma]
     * @param  {Array Object} return [{name:value},{name:value}]
     */
    getCodeTypeKind: async function (type) {
        var rtn = {};
        try {
            var qry = {};
            var options = {
                order: [
                    ["code_type"],
                    ["code_seq1"],
                    ["code_seq2"]
                ],
                attributes: ['code_type', 'code_seq1', 'code_desc1']
            }

            let _res;
            await m_db.query("publiccode", qry, options, function (err, result) {
                result = JSON.parse(JSON.stringify(result));
                if (err != null) {
                    rtn.status = 'Fail';
                    rtn.msg = err;
                } else {
                    _res = result;
                }
            })

            let _tmp = [];
            for (let ele in _res) {
                if (_res[ele].code_seq1 == '**') {
                    let _x = {};
                    _x.value = _res[ele].code_type;
                    _x.label = _res[ele].code_desc1;
                    _tmp.push(_x);
                }
            }
            rtn.status = "OK"
            rtn.data = _tmp;
            return rtn;
        } catch (err) {
            rtn.status = 'Fail';
            rtn.msg = err;
            return rtn;
        }
    },
     /**
     * Function description : 新增代碼Type之seq&desc
     * @param  {JSON} reqData 資料
     */
      insertCodeData: async function (reqData) {
        var rtn = {};
        try {
            let ChkRepeated = await _ChkRepeated(reqData);

            if (!ChkRepeated.status) {
                console.log("insertCode_ChkRepeated_fail");
                rtn.status = 'Fail';
                rtn.msg = ChkRepeated.msg;
            } else {
                var insertData = {};
                insertData.code_type=reqData.type;
                insertData.code_seq1=reqData.value;
                insertData.code_desc1=reqData.label;
                insertData.op_user=reqData.op_user;
                insertData.cr_date = utility.get_today();
 
                await m_db.insert(insertData, 'publiccode', function (err, result) {
                    if (err != null) {
                        console.log(err);
                        rtn.status = 'Fail';
                        rtn.msg = err;
                    } else {
                        rtn.status = 'OK';
                        rtn.data = result;
                    }
                })
            }
            return rtn;
        } catch (err) {
            rtn.status = 'Fail';
            rtn.msg = err;
            return rtn;
        }
    },
    /**
     * Function description : 修改代碼Type之seq&desc
     * @param  {JSON} reqData 資料
     */
     editCodeData: async function (reqData) {
        var rtn = {};
        try {
            var where = {};
            where.guid = reqData.guid;
            var upData={};
            upData.code_seq1=reqData.value;
            upData.code_desc1=reqData.label;
            upData.op_user=reqData.op_user;
            upData.up_date = utility.get_today();

            await m_db.update(upData, "publiccode", where, function (err, result) {
                if (err != null) {
                    console.log(err);
                    rtn.status = 'Fail';
                    rtn.msg = err.message;
                } else {
                    rtn.status = "OK";
                }
            })
            return rtn;
        } catch (err) {
            rtn.status = 'Fail';
            rtn.msg = err;
            return rtn;
        }
    },
    //delete
    deleteCodeData: async function (reqData) {
        var rtn = {};
        try {
            var where = {};
            where.guid = reqData.guid;

            await m_db.delete("publiccode", where, function (err, result) {
                if (err != null) {
                    rtn.status = "Fail";
                    rtn.msg = err.message;
                } else {
                    rtn.status = "OK";
                }
            })
            return rtn;
        } catch (err) {
            rtn.status = 'Fail';
            rtn.msg = err;
            return rtn;
        }
    },
}

async function _ChkRepeated(data){
    var rtn = {};
    try {
        var options = {};
        var qry = {};
        qry.code_type = data.type;
        let _res;
        await m_db.query("publiccode", qry, options, function (err, result) {
            if (err != null) {
                rtn.status = false;
                rtn.msg = err;
            } else {
               _res=JSON.parse(JSON.stringify(result)) ;
            }
        })

        for(let ele in _res){
            if(_res[ele].code_seq1==data.value || _res[ele].code_desc1==data.label){
                rtn.status = false;
                rtn.msg = 'code_ChkRepeated';
            }else{
                rtn.status = true;
            }
        }
       
        return rtn;
    }catch (err) {
        rtn.status = false;
        rtn.msg = err;
        return rtn;
    }

}