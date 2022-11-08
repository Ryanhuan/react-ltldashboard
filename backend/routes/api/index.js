var express = require('express');
const Tokens = require("../../middlewares/token");

const matRouter = require('./dashboard/r_mat');
const userRouter = require('./dashboard/r_user');
const productRouter = require('./dashboard/r_product');
const codeManageRouter = require('./dashboard/r_codeManage');

var app = express();
var router = express.Router();

/**
   * Res description 
   * @param  {string} ack 'OK' || 'FAIL'
   * @param  {string} ackDesc ack description
   * @param  {JSON} data res data
   */

router.all('/*', async function (req, res, next) {
    try {
        var TokenVerify = {};
        var rtn = {};
        console.log("----------api_start-----------");
        //get token from header
        const token = JSON.parse(req.headers["authorization"]);

        //check token 
        if (!token) {
            rtn.ack = 'FAIL';
            rtn.ackDesc = 'No token provided!';
            // rtn.msg = 'No token provided!';
            return res.status(403).json(rtn);
        }
        var TokenVerify = await Tokens.accessToken.verifyToken(token);
        if (TokenVerify.ack == 'FAIL') {
            rtn.ack = TokenVerify.ack;
            if (TokenVerify.msg == 'AccessToken_Is_Expired') {
                rtn.ackDesc = 'Login Expired!'
                // rtn.msg = 'Login Expired!'
                return res.status(401).json(rtn);
            } else {
                rtn.ackDesc = 'Login Fail!'
                // rtn.msg = 'Login Fail!'
                return res.status(403).json(rtn);
            }
        } else {
            next();
        }
        console.log("----------api_end-----------");

    } catch (err) {
        console.log("api index err :", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});

app.use('/user', userRouter);
app.use('/mat', matRouter);
app.use('/product', productRouter);
app.use('/codeManage', codeManageRouter);



module.exports = app;

