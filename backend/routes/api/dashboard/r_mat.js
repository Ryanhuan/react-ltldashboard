const log = require('async');
var express = require('express');
const Tokens = require("../../../middlewares/token");
const utility = require("../../../public/javascripts/utility");

const mat = require("../../../controllers/dashboard/c_mat");

var router = express.Router();

router.post("/insertMatData", async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/insertMatData_start-----------");
        var TokenVerify = Tokens.accessToken.verifyToken(JSON.parse(req.headers["authorization"]));
        var op_user = TokenVerify.decodeData.email;
        let _res = await mat.insertMat({ ...req.body, op_user });
        rtn.ack = _res.ack;
        if (_res.ack == 'OK') {
            rtn.ackDesc = 'InsertMatData_OK';
            rtn.data = _res.data;
        } else {
            rtn.ackDesc = 'InsertMatData_Fail'
        }
        console.log("----------api/insertMatData_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("insertMatData err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});

router.post("/getMatData", async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/getMatData_start-----------");
        var qryData = { ...req.body, };
        let _res = await mat.queryMatData(qryData);
        rtn.ack = _res.ack;
        if (_res.ack == 'OK') {
            rtn.ackDesc = 'getMatData_OK';
            rtn.data = _res.data;
        } else {
            rtn.ackDesc = 'getMatData_Fail'
        }
        console.log("----------api/getMatData_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("getMatData err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});

router.post("/deleteMatData", async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/deleteMatData_start-----------");
        var reqData = { ...req.body, };
        let _res = await mat.deleteMatData(reqData);
        rtn.ack = _res.ack;
        if (_res.ack == 'OK') {
            rtn.ackDesc = 'deleteMatData_OK';
            rtn.data = _res.data;
        } else {
            rtn.ackDesc = 'deleteMatData_Fail'
        }
        console.log("----------api/deleteMatData_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("deleteMatData err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});

router.post("/editMatData", async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/editMatData_start-----------");
        var TokenVerify = Tokens.accessToken.verifyToken(JSON.parse(req.headers["authorization"]));
        var op_user = TokenVerify.decodeData.email;
        var reqData = { ...req.body, op_user };
        let _res = await mat.editMatData(reqData);
        rtn.ack = _res.ack;
        if (_res.ack == 'OK') {
            rtn.ackDesc = 'editMatData_OK';
            rtn.data = _res.data;
        } else {
            rtn.ackDesc = 'editMatData_Fail'
        }
        console.log("----------api/editMatData_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("editMatData err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});




module.exports = router;
