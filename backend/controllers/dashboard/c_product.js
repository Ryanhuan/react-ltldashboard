const db = require('../../db/database');
const m_db = require("../../model/m_db");
const utility = require("../../public/javascripts/utility");
var Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports = {
    /**
     * Function description : 新增
     * @param  {JSON} reqData 新增資料
     */
     insertProduct: async function (reqData) {
        var rtn = {};
        try {
            console.log("reqData",reqData);
            // let chkMatId = await checkMatId(reqData.id);

            // if (!chkMatId.status) {
            //     console.log("insertMat_chkMatId_fail");
            //     rtn.status = 'Fail';
            //     rtn.msg = chkMatId.msg;
            // } else {
            //     console.log("insertMat_chkMatId_ok");
            //     var insertData = reqData;
            //     insertData.cr_date = utility.get_today();
            //     // console.log("insertData",insertData);
            //     await m_db.insert(insertData, 'materials', function (err, result) {
            //         if (err != null) {
            //             console.log(err);
            //             rtn.status = 'Fail';
            //             rtn.msg = err;
            //         } else {
            //             rtn.status = 'OK';
            //             rtn.data = result;
            //         }
            //     })
            // }
            return rtn;
        } catch (err) {
            console.log("insertProduct err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },


}

