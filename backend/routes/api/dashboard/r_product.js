// const log = require('async');
var express = require('express');
const Tokens = require("../../../middlewares/token");
const utility = require("../../../public/javascripts/utility");

const product = require("../../../controllers/dashboard/c_product");

var router = express.Router();

router.post("/handleProductData", async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/handleProductData_start-----------");
        var TokenVerify = Tokens.accessToken.verifyToken(JSON.parse(req.headers["authorization"]));
        var op_user = TokenVerify.decodeData.email;
        let _res = await product.handleProduct({ ...req.body, op_user });
        rtn.ack = _res.ack;
        if (_res.ack == 'OK') {
            rtn.ackDesc = 'handleProductData_OK';
        } else {
            rtn.ackDesc = 'handleProductData_Fail'
        }
        console.log("----------api/handleProductData_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("handleProductData err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});

router.post("/getProductData", async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/getProductData_start-----------");
        let _res = await product.getProduct(req.body);
        rtn.ack = _res.ack;
        if (_res.ack == 'OK') {
            rtn.ackDesc = 'getProductData_OK';
            rtn.data = _res.data;
        } else {
            rtn.ackDesc = 'getProductData_Fail'
        }
        console.log("----------api/getProductData_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("getProductData err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});

router.post('/getProductBomData/:sku', async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/getProductBomData_start-----------");
        let _res = await product.getProductBom(req.params.sku);
        rtn.ack = _res.ack;
        if (_res.ack == 'OK') {
            rtn.ackDesc = 'getProductBomData_OK';
            rtn.data = _res.data;
        } else {
            rtn.ackDesc = 'getProductBomData_Fail'
        }
        console.log("----------api/getProductBomData_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("getProductBomData err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});

router.post('/deleteProductInfo/:sku', async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/deleteProductInfo_start-----------");
        let _res = await product.deleteProduct(req.params.sku);
        rtn.ack = _res.ack;
        if (_res.ack == 'OK') {
            rtn.ackDesc = 'deleteProductInfo_OK';
            rtn.data = _res.data;
        } else {
            rtn.ackDesc = 'deleteProductInfo_Fail'
        }
        console.log("----------api/getProductBomData_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("deleteProductInfo err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});



module.exports = router;
