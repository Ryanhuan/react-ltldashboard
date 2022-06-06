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
    getCodeInfo:async function(type){
        var rtn={};
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
        await m_db.query("publiccode", qry, options, function (err, result){
            result =JSON.stringify(result);
            err!=null? rtn.msg=err : rtn.msg="OK",rtn.data=result;
        })
        return rtn;
    },

    
  

  
}
