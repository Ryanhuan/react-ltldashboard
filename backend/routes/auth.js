var express = require('express');
var m_db = require("../model/m_db");
const bcrypt = require("bcrypt");
const Tokens = require("../middlewares/token");
const member = require("../model/member");

var router = express.Router();


router.post("/signin", function (req, res) {
    const {email,password} = req.body;

    var rtn = {};
    rtn.token = {
        "accessToken": "",
        "refreshToken": ""
    }

    try {
        var qry = {};
        qry.email = email;
        var options = {};
        var tableName = 'auth';
        m_db.query(tableName, qry, options, async function (err, result) {
            console.log("auth query");
            if (err != null) {
                console.log("err-----:", err);
                rtn.msg = err.message;
                res.json(rtn);
            }
            if (result.length === 0) {
                rtn.msg = 'ACCOUNT_NOT_EXIST';
                res.json(rtn);
            }
            if(result.isenabled == false) {
                rtn.msg = 'ACCOUNT_NOT_ENABLE';
                res.json(rtn);
            }
            //compare pwd
            const psRes = bcrypt.compareSync(password, result[0].password);
            if (!psRes) { // compare fail
                console.log("bcrypt compareSync fail");
                rtn.msg = 'WRONG_PASSWORD';
                res.json(rtn);
            }

            //createToken
            rtn.token.accessToken = await Tokens.accessToken.createToken(result[0]);
            rtn.token.refreshToken = await Tokens.refreshToken.createToken(result[0]);
            //return userId
            const userId_= await member.getUserInfo(req.body);
            
            rtn.userId= userId_.data[0];
            //return ok and data
            rtn.msg = "OK_LOGIN_SUCCESSFULLY";
            rtn.data = result;
            console.log("--------------signIn ok");
            return res.json(rtn);
        })
    } catch (err) {
        rtn.msg = err.message;
        res.json(rtn)
    }
});


router.post("/refreshToken", async function (req, res) {
    var rtn = {};
    rtn.token={};
    var TokenVerifyAccessToken='';
    var TokenVerifyRefreshToken='';
    try {
        console.log("refreshToken=====================");
        const token = JSON.parse(req.headers["authorization"]);
        console.log(token);
        TokenVerifyAccessToken =await Tokens.accessToken.verifyToken(token);
        TokenVerifyRefreshToken =await Tokens.refreshToken.verifyToken(token);
        console.log("refreshToken=====================");

        if (!TokenVerifyRefreshToken.result) {
            rtn.msg = 'Login Fail!'
            return res.status(403).json(rtn);
        } else {
            rtn.token.accessToken =await Tokens.accessToken.createToken(TokenVerifyAccessToken.decodeData);
            rtn.token.refreshToken =await Tokens.refreshToken.createToken(TokenVerifyAccessToken.decodeData);
            return res.json(rtn); 
        }

    } catch (err) {
        rtn.msg = err.message;
        return res.json(rtn)
    }
});


module.exports = router;