const db = require('../../db/database');
const m_db = require("../../model/m_db");
const utility = require("../../public/javascripts/utility");
const bcrypt = require("bcrypt");

module.exports = {

    /**
     * Function description : 取得全部使用者資料
     */
    getAllUsersInfo: async function () {
        var rtn = {};
        try {
            var options = {};
            var qry = {};

            await m_db.query("user", qry, options, function (err, result) {
                err != null ? (rtn.ack = 'FAIL', rtn.ackDesc = err.message) : (rtn.ack = "OK", rtn.data = JSON.parse(JSON.stringify(result)));
            })
            return rtn;
        } catch (err) {
            console.log("getAllUsersInfo err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },

    /**
     * Function description : 取得指定使用者資料
     * @param  {JSON} userInfo 使用者查詢條件資料
     */
    getUserInfo: async function (userInfo) {
        var rtn = {};
        try {
            var options = {};
            var qry = {};
            qry.email = userInfo.email;
            await m_db.query("user", qry, options, function (err, result) {
                err != null ? (rtn.ack = 'FAIL', rtn.ackDesc = err.message) : (rtn.ack = "OK", rtn.data = result);
            })
            return rtn;
        } catch (err) {
            console.log("getUserInfo err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },

    /**
     * Function description : 新增使用者資料(註冊)_Auth&user
     * @param  {JSON} userInfo 使用者查詢條件資料
     */
    insertUser: function (userInfo) {
        var rtn = db.transaction().then(function (t) {
            var rtn_ = {};
            let requests_insertUserAuth = new Promise((resolve, reject) => {
                insertUserAuthPromise(userInfo, t, resolve, reject);
            });

            let requests_insertUser = new Promise((resolve, reject) => {
                insertUserUserPromise(userInfo, t, resolve, reject);
            });

            return Promise.all([requests_insertUserAuth, requests_insertUser])
                .then(value => {
                    t.commit();
                    rtn_.ack = "OK";
                    return rtn_;
                }, resion => {
                    t.rollback();
                    rtn_.ack = "FAIL";
                    rtn_.ackDesc = "新增時發生錯誤";
                    return rtn_;
                })
                .catch(err => {
                    console.log("insertUser err", err);
                    rtn_.ack = "FAIL";
                    rtn_.ackDesc = err.message;
                    return rtn_;
                });
        })
        return rtn;
    },

    /**
     * Function description : 更新使用者資料_user
     * @param  {JSON} userInfo 使用者修改資料
     */
    updateUser: async function (userInfo) {
        const rtn = {};
        try {
            const where = {};
            where.email = userInfo.email;
            const updateData = {};
            updateData.isenabled = userInfo.isenabled;
            console.log("userInfo========", userInfo);
            updateData.root = userInfo._root;
            updateData.op_user = userInfo.op_user;

            await m_db.update(updateData, "user", where, function (err, result) {
                err != null ? (rtn.ack = 'FAIL', rtn.ackDesc = err.message) : (rtn.ack = "OK", rtn.data = result);
            });

            return rtn;
        } catch (err) {
            console.log("updateUser err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
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
        let passwordHash = bcrypt.hashSync(password, 10); // 將使用者輸入的密碼進行加密

        var insertData = {};
        insertData.email = email;
        insertData.password = passwordHash;
        insertData.cr_date = utility.get_today();
        insertData.op_user = "admin";
        insertData.isenabled = true;

        m_db.insertWithTx(insertData, 'auth', t, function (err, result) {
            err != null ? (console.log("insertUserAuthPromise1 err",err), reject()) : resolve();
        })
    } catch (err) {
        console.log("insertUserAuthPromise err",err)
        reject();
    }
};

/**
 * Function description : 新增使用者資料(註冊)_User_Promise
 * @param  {JSON} userInfo 使用者查詢條件資料
 * @param  {Transaction} t DB Transaction
 * @param  resolve resolve
 * @param  reject reject
 */
function insertUserUserPromise(userInfo, t, resolve, reject) {
    try {
        const { email, username, op_user } = userInfo;

        var insertData = {};
        insertData.email = email;
        insertData.displayname = username;
        insertData.cr_date = utility.get_today();
        insertData.op_user = op_user;
        insertData.isenabled = true;
        insertData.root = userInfo._root;

        m_db.insertWithTx(insertData, 'user', t, function (err, result) {
            err != null ? (console.log("insertUserUserPromise1 err",err) , reject()) : resolve();
        })
    } catch (err) {
        console.log("insertUserUserPromise err",err)
        reject();
    }
};


