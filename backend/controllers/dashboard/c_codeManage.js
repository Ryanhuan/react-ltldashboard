const m_db = require("../../model/m_db");
const utility = require("../../public/javascripts/utility");

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
                order: [["code_type"], ["code_seq1"], ["code_seq2"]]
            }

            await m_db.query("publiccode", qry, options, function (err, result) {
                result = JSON.stringify(result);
                err != null ? (rtn.ack = 'FAIL', rtn.ackDesc = err.message) : (rtn.ack = "OK", rtn.data = result);
            })
            return rtn;
        } catch (err) {
            console.log("getCodeInfo err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
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
                order: [["code_type"], ["code_seq1"], ["code_seq2"]],
                attributes: ['code_type', 'code_seq1', 'code_desc1']
            }

            let _res;
            await m_db.query("publiccode", qry, options, function (err, result) {
                result = JSON.parse(JSON.stringify(result));
                err != null ? (rtn.ack = 'FAIL', rtn.ackDesc = err.message) : _res = result;
            })

            let _tmp = [];
            for (let ele in _res) {
                if (_res[ele].code_type.split('_')[0] == type) {
                    if (_res[ele].code_seq1 == '**') {
                        let _x = {};
                        _x.value = _res[ele].code_type;
                        _x.label = _res[ele].code_desc1;
                        _tmp.push(_x);
                    }
                }
            }
            rtn.ack = "OK"
            rtn.data = _tmp;
            return rtn;
        } catch (err) {
            console.log("getCodeTypeKind err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },

    /**
    * Function description : 取得 code_seq1 最後序
    * @param  {string} code_type  要查詢的code_type
    * @param  {string} return 回傳最後seq
    */
    getCodeSeq1_seq: async function (code_type) {
        var rtn = {};
        try {
            var qry = { code_type: code_type, };
            var options = { order: [["code_type"], ["code_seq1"]], }
            let _res;
            await m_db.query("publiccode", qry, options, function (err, result) {
                result = JSON.parse(JSON.stringify(result));
                err != null ? (rtn.ack = 'FAIL', rtn.ackDesc = err.message) : _res = result;
            })

            let _seq = '';
            for (let ele in _res) {
                // console.log("_res.length", _res.length);
                if (_res.length == 1) {
                    //只有描述(code_seq1='**') 沒有其他 row data
                    _seq = '1';
                } else {
                    let _splitTmp = _res[_res.length - 1].code_seq1.split('_');
                    _seq = (Number(_splitTmp[_splitTmp.length - 1]) + 1).toString();
                    if (_seq == 'NaN') { _seq = '1'; }
                }
            }
            rtn.ack = "OK"
            rtn.data = _seq;
            return rtn;
        } catch (err) {
            console.log("getCodeSeq1_seq err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
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
            let ChkRepeated = await _ChkRepeated(reqData, { 'code_type': 'type', 'code_seq1': 'value' });

            if (ChkRepeated.ack == 'FAIL') {
                rtn.ack = ChkRepeated.ack;
                rtn.ackDesc = ChkRepeated.ackDesc;
                console.log("!ERR! insertCode_ChkRepeated_fail", ChkRepeated.ackDesc);
            } else {
                var insertData = {};
                insertData.code_type = reqData.type;
                insertData.code_seq1 = reqData.value == undefined ? reqData.type + "_" + reqData._codeSeq : reqData.value.toUpperCase();
                insertData.code_desc1 = reqData.label;
                insertData.mark = reqData.mark;
                insertData.op_user = reqData.op_user;
                insertData.cr_date = utility.get_today();

                await m_db.insert(insertData, 'publiccode', function (err, result) {
                    err != null ? (rtn.ack = 'FAIL', rtn.ackDesc = err.message) : (rtn.ack = "OK", rtn.data = result);
                })
            }
            return rtn;
        } catch (err) {
            console.log("insertCodeData err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
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
            var upData = {};
            upData.code_seq1 = reqData.value;
            upData.code_desc1 = reqData.label;
            upData.mark = reqData.mark;
            upData.op_user = reqData.op_user;
            upData.up_date = utility.get_today();

            await m_db.update(upData, "publiccode", where, function (err, result) {
                err != null ? (rtn.ack = 'FAIL', rtn.ackDesc = err.message) : (rtn.ack = "OK");
            })
            return rtn;
        } catch (err) {
            console.log("editCodeData err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
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
                err != null ? (rtn.ack = 'FAIL', rtn.ackDesc = err.message) : (rtn.ack = "OK");
            })
            return rtn;
        } catch (err) {
            console.log("deleteCodeData err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },
}


/**
    * Function description : 檢查是否重複
    * @param  {JSON} data 資料
    * @param  {JSON} chkCols 要檢查的欄位及對應之Data Name{'code_type':'type', 'code_seq1':'value','code_desc1':'label'}
*/
async function _ChkRepeated(data, chkCols) {
    var rtn = {};
    try {
        var options = {};
        var qry = {};
        for (let ele in chkCols) qry[ele] = data[chkCols[ele]];
        

        let _res = {};
        await m_db.query("publiccode", qry, options, function (err, result) {
            err != null ? (rtn.ack = 'FAIL', rtn.ackDesc = err.message) : (_res = JSON.parse(JSON.stringify(result)));
        })

        for (let ele in _res) {
            if (_res[ele].code_seq1 == data.value || _res[ele].code_desc1 == data.label) {
                rtn.ack = 'FAIL';
                rtn.ackDesc = 'code_ChkRepeated';
            } else {
                rtn.ack = 'OK';
            }
        }

        return rtn;
    } catch (err) {
        console.log("_ChkRepeated err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        return rtn;
    }

}