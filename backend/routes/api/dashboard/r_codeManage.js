
const log = require('async');
var express = require('express');
const Tokens = require("../../../middlewares/token");
const utility = require("../../../public/javascripts/utility");

const codeManage = require("../../../controllers/dashboard/c_codeManage");

var router = express.Router();


router.post("/getSelectOption", async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/getSelectOption_start-----------");
        rtn.data = {};
        for (let i = 0; i < req.body.length; i++) {
            let _res = await codeManage.getCodeInfo(req.body[i]);
            rtn.ack = _res.ack;
            if (_res.ack == 'OK') {
                rtn.ackDesc = 'getSelectOption_OK';
                let _tmp = [];
                JSON.parse(_res.data).forEach(ele => {
                    _tmp.push({
                        value: ele.code_seq1,
                        label: ele.code_desc1,
                        mark: ele.mark,
                        guid: ele.guid
                    })
                });
                rtn.data[req.body[i]] = _tmp;
            } else {
                rtn.ackDesc = 'getSelectOption_Fail';
            }
        }
        // console.log("rtn",rtn);
        console.log("----------api/getSelectOption_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("getSelectOption err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});

router.post("/getCodeTypeKind/:type", async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/getCodeTypeKind_start-----------");
        rtn.data = {};

        let _res = await codeManage.getCodeTypeKind(req.params.type);
        rtn.ack = _res.ack;
        if (_res.ack == 'OK') {
            rtn.ackDesc = 'getCodeTypeKind_OK';
            rtn.data = _res.data;
        } else {
            rtn.ackDesc = 'getCodeTypeKind_Fail';
        }
        console.log("----------api/getCodeTypeKind_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("getCodeTypeKind err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});

router.post("/getCodeMark/:codeType/:codeSeq1", async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/getCodeMark_start-----------");
        rtn.data = {};
        let _res = await codeManage.getCodeInfo(req.params.codeType);
        rtn.ack = _res.ack;
        if (_res.ack == 'OK') {
            rtn.ackDesc = 'getCodeMark_OK';
            JSON.parse(_res.data).forEach(ele => {
                if (ele.code_seq1 == req.params.codeSeq1) {
                    rtn.data.mark = ele.mark;
                }
            });
        } else {
            rtn.ackDesc = 'getCodeMark_Fail';
        }
        console.log("----------api/getCodeMark_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("getCodeMark err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});

router.post("/editCodeData", async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/editCodeData_start-----------");
        rtn.data = {};
        var TokenVerify = Tokens.accessToken.verifyToken(JSON.parse(req.headers["authorization"]));
        var op_user = TokenVerify.decodeData.email;
        let _res = await codeManage.editCodeData({ ...req.body, op_user });
        rtn.ack = _res.ack;
        if (_res.ack == 'OK') {
            rtn.ackDesc = 'editCodeData_OK';
            rtn.data = _res.data;
        } else {
            rtn.ackDesc = 'editCodeData_Fail';
        }
        console.log("----------api/editCodeData_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("editCodeData err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});

router.post("/insertCodeData", async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/insertCodeData_start-----------");
        rtn.data = {};
        var TokenVerify = Tokens.accessToken.verifyToken(JSON.parse(req.headers["authorization"]));
        var op_user = TokenVerify.decodeData.email;
        //新增代碼 自產code_seq1(code_type+_+seq)
        //先取現在code_seq1 順序
        // req.body { type: 'ma_quality', label: '1111' }
        let _codeSeq = await codeManage.getCodeSeq1_seq(req.body.type);
        if (_codeSeq.ack == 'OK') {
            let _res = await codeManage.insertCodeData({ ...req.body, _codeSeq, op_user });
            rtn.ack = _res.ack;
            if (_res.ack == 'OK') {
                rtn.ackDesc = 'insertCodeData_OK';
                rtn.data = _res.data;
            } else {
                rtn.ackDesc = 'insertCodeData_Fail';
            }
        }
        console.log("----------api/insertCodeData_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("insertCodeData err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});

router.post("/deleteCodeData", async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/deleteCodeData_start-----------");
        var TokenVerify = Tokens.accessToken.verifyToken(JSON.parse(req.headers["authorization"]));
        var op_user = TokenVerify.decodeData.email;
        let _res = await codeManage.deleteCodeData({ ...req.body, op_user });
        rtn.ack = _res.ack;
        if (_res.ack == 'OK') {
            rtn.ackDesc = 'deleteCodeData_OK';
            rtn.data = _res.data;
        } else {
            rtn.ackDesc = 'deleteCodeData_Fail'
        }
        console.log("----------api/deleteCodeData_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("deleteCodeData err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});



module.exports = router;
