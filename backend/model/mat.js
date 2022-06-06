const db = require('../db/database');
const m_db = require("./m_db");
const utility = require("../public/javascripts/utility");


module.exports = {

    /**
     * Function description : 新增材料
     * @param  {JSON} reqData 新增材料資料
     */
    insertMat: async function (reqData) {
        var rtn = {};
        try {
            let chkMatId = await checkMatId(reqData.id);

            if (!chkMatId.status) {
                console.log("insertMat_chkMatId_fail");
                rtn.status = 'Fail';
                rtn.msg = chkMatId.msg;
            } else {
                console.log("insertMat_chkMatId_ok");
                var insertData = reqData;
                insertData.cr_date = utility.get_today();
                // console.log("insertData",insertData);
                await m_db.insert(insertData, 'materials', function (err, result) {
                    if (err != null) {
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

    queryMatData: async function (reqData) {
        var rtn = {};
        try {
            var options = {};
            var qry = {};
    
            await m_db.query("materials", qry, options, async function (err, result) {
                if (err != null) {
                    rtn.status = "Fail";
                    rtn.msg = err;
                } else {
                    rtn.status = "OK";
                    let _data = JSON.parse(JSON.stringify(result));
                    rtn.data = _data;
                }
            })

           for (let i = 0; i < rtn.data.length; i++) {
                rtn.data[i].type=await codeDesc(rtn.data[i].type, "ma_type");
                rtn.data[i].quality=await codeDesc(rtn.data[i].quality, "ma_quality");
            }
 
            return rtn;
        } catch (err) {
            rtn.status = 'Fail';
            rtn.msg = err;
            return rtn;
        }
    },
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
                rtn.status = false;
                rtn.msg = err;
            } else {
                if (result.length == 0) {
                    rtn.status = true;
                } else {
                    rtn.status = false;
                    rtn.msg = "ID_Repeated";
                }
            }
        })
        return rtn;
    } catch (err) {
        rtn.status = false;
        rtn.msg = err;
        return rtn;
    }
}


async function codeDesc(data, searchCodeType) {
    var qry = {};
    var rtn='';
    if(data!=null && data!=undefined) {
        qry.code_seq1 = data;
        qry.code_type = searchCodeType;
    
        var options = {};
    
        await m_db.query("publiccode", qry, options, function (err, result) {
            if (err != null) {
                console.log("codeDesc_err", err);
                rtn=data;
            } else {
                let _res=JSON.parse(JSON.stringify(result));
                rtn = _res.length!=0 ?_res[0].code_desc1:data;
            }
        })
    }
    return rtn;
}

