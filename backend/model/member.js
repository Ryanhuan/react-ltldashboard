const db = require('../db/database');
const m_db = require("./m_db");
const utility = require("../public/javascripts/utility");
const bcrypt = require("bcrypt");



module.exports = {

    /**
     * Function description : 取得全部使用者資料
     */
    getAllUsersInfo:async function(){
        var rtn={};
        var options = {};
        var qry = {};

        await m_db.query("member", qry, options, function (err, result){
           err!=null? rtn.msg=err : rtn.msg="OK",rtn.data=result;
        })
        return rtn;
    },

    /**
     * Function description : 取得指定使用者資料
     * @param  {JSON} userInfo 使用者查詢條件資料
     */
    getUserInfo: async function(userInfo){
        var rtn={};
        var options = {};
        var qry = {};
        qry.email = userInfo.email;

       await m_db.query("member", qry, options, function (err, result){
           err!=null? rtn.msg=err+console.log("getUserInfo fail") : rtn.msg="OK",rtn.data=result;
       })
        return rtn;

    },

    /**
     * Function description : 新增使用者資料(註冊)_Auth&Member
     * @param  {JSON} userInfo 使用者查詢條件資料
     */
    insertUser: function (userInfo) {
        var rtn = db.transaction().then(function (t) {
            var rtn_ = {};
            let requests_insertUserAuth = new Promise((resolve, reject) => {
                insertUserAuthPromise(userInfo, t, resolve, reject);
            });

            let requests_insertUserMember = new Promise((resolve, reject) => {
                insertUserMemberPromise(userInfo, t, resolve, reject);
            });

            return Promise.all([requests_insertUserAuth, requests_insertUserMember])
                .then(value => {
                    t.commit();
                    rtn_.msg = "OK";
                    return rtn_;
                }, resion => {
                    t.rollback();
                    rtn_.msg = "新增時發生錯誤";
                    return rtn_;
                })
                .catch(err => {
                    console.log(err);
                    rtn_.msg = err;
                    return rtn_;
                });
        })
        return rtn;
    },

    /**
     * Function description : 更新使用者資料_Member
     * @param  {JSON} userInfo 使用者修改資料
     */
     updateUser: async function(userInfo) {
        const rtn ={};
        const where = {};
        where.email = userInfo.email;
        const updateData={};
        updateData.isenabled=userInfo.isenabled;
        
        const root_tmp=[];
        userInfo.rootData.forEach(ele=>{
            ele.check?root_tmp.push(ele.value):'';
        })
        updateData.root=root_tmp.toString();

        await m_db.update(updateData,"member", where, function (err, result){
            err!=null?rtn.msg=err+console.log("updateUser fail"):rtn.msg='OK';
        });

        return rtn;
    },


  
}



/**
 * Function description : 新增使用者資料(註冊)_Auth_Promise
 * @param  {JSON} userInfo 使用者查詢條件資料
 * @param  {Transaction} t DB Transaction
 * @param  resolve resolve
 * @param  reject reject
 */
function insertUserAuthPromise(userInfo, t, resolve, reject) {
    try {
        const { email, password } = userInfo;
        passwordHash = bcrypt.hashSync(password, 10); // 將使用者輸入的密碼進行加密

        var insertData = {};
        insertData.email=email;
        insertData.password=passwordHash;
        insertData.cr_date = utility.get_today();
        insertData.op_user="admin";
        insertData.isenabled=true;

        m_db.insertWithTx(insertData, 'auth', t, function (err, result) {
            err!=null ? console.log(err)+reject() : resolve();
        })
    } catch (err) {
        reject();
    }
};

/**
 * Function description : 新增使用者資料(註冊)_Member_Promise
 * @param  {JSON} userInfo 使用者查詢條件資料
 * @param  {Transaction} t DB Transaction
 * @param  resolve resolve
 * @param  reject reject
 */
function insertUserMemberPromise(userInfo, t, resolve, reject) {
    try {
        const {email,username} = userInfo;

        var insertData = {};
        insertData.email = email;
        insertData.displayname = username;
        insertData.cr_date = utility.get_today();
        insertData.op_user = "admin";
        insertData.isenabled = true;

        root_tmp=[];

        for(var ele in userInfo.root) {
            userInfo.root[ele].check? root_tmp.push(userInfo.root[ele].value):'';
         }
        insertData.root=root_tmp.toString();

        m_db.insertWithTx(insertData, 'member', t, function (err, result) {
            err!=null ? console.log(err)+reject() : resolve();
        })
    } catch (err) {
        reject();
    }
};


