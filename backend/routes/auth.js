var express = require('express');
var m_db = require("../model/m_db");
const bcrypt = require("bcrypt");
const Tokens = require("../middlewares/token");
const user = require("../controllers/dashboard/c_user");

var router = express.Router();


router.post("/signin", function (req, res) {
    const { email, password } = req.body;
    var rtn = {};
    rtn.token = { "accessToken": "", "refreshToken": "" }

    try {
        var options = {};
        var qry = {};
        qry.email = email;

        m_db.query('auth', qry, options, async function (err, result) {
            console.log("auth query");
            if (err != null) {
                console.log("auth err-----:", err);
                rtn.ack = 'FAIL';
                rtn.ackDesc = err.message;
                res.json(rtn);
            }
            if (result.length === 0) {
                rtn.ack = 'FAIL';
                rtn.ackDesc = 'ACCOUNT_NOT_EXIST';
                res.json(rtn);
            }
            if (result.isenabled == false) {
                rtn.ack = 'FAIL';
                rtn.ackDesc = 'ACCOUNT_NOT_ENABLE';
                res.json(rtn);
            }
            //compare pwd
            const psRes = bcrypt.compareSync(password, result[0].password);
            if (!psRes) { // compare fail
                console.log("WRONG_PASSWORD[bcrypt_compareSync_fail]");
                rtn.ack = 'FAIL';
                rtn.ackDesc = 'WRONG_PASSWORD';
                res.json(rtn);
            }

            //createToken
            rtn.token.accessToken = await Tokens.accessToken.createToken(result[0]);
            rtn.token.refreshToken = await Tokens.refreshToken.createToken(result[0]);
            //return userId
            const userId_ = await user.getUserInfo(req.body);

            rtn.userId = userId_.data[0];
            //return ok and data
            rtn.ack = 'OK';
            rtn.ackDesc = "OK_LOGIN_SUCCESSFULLY";
            rtn.data = result;
            console.log("--------------signIn ok");
            return res.json(rtn);
        })
    } catch (err) {
        console.log("signIn err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn)
    }
});


router.post("/refreshToken", async function (req, res) {
    var rtn = {};
    rtn.token = {};
    var TokenVerifyAccessToken = '';
    var TokenVerifyRefreshToken = '';
    try {
        console.log("refreshToken=====================");
        const token = JSON.parse(req.headers["authorization"]);
        console.log("token", token);
        TokenVerifyAccessToken = await Tokens.accessToken.verifyToken(token);
        TokenVerifyRefreshToken = await Tokens.refreshToken.verifyToken(token);
        console.log("refreshToken=====================");

        if (!TokenVerifyRefreshToken.result) {
            rtn.ack = 'FAIL';
            rtn.ackDesc = 'Login Fail!';
            return res.status(403).json(rtn);
        } else {
            rtn.ack = 'OK';
            rtn.ackDesc = 'Login Success!';
            rtn.token.accessToken = await Tokens.accessToken.createToken(TokenVerifyAccessToken.decodeData);
            rtn.token.refreshToken = await Tokens.refreshToken.createToken(TokenVerifyAccessToken.decodeData);
            return res.json(rtn);
        }

    } catch (err) {
        console.log("refreshToken err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        rtn.accessToken = err.message;
        return res.json(rtn)
    }
});


module.exports = router;