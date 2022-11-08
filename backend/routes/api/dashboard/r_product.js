const log = require('async');
var express = require('express');
const Tokens = require("../../../middlewares/token");
const utility = require("../../../public/javascripts/utility");

const product = require("../../../controllers/dashboard/c_product");

var router = express.Router();

router.post("/insertProductData", async function (req, res) {
    var rtn = {};
    try {
        console.log("----------api/insertProductData_start-----------");
        var TokenVerify = Tokens.accessToken.verifyToken(JSON.parse(req.headers["authorization"]));
        var op_user = TokenVerify.decodeData.email;
        var reqData = { ...req.body, op_user };
        let _res = await product.insertProduct(reqData);
        rtn.ack= _res.ack;
        if (_res.ack == 'OK') {
            rtn.ackDesc = 'insertProductData_OK';
            rtn.data = _res.data;
        } else {
            rtn.ackDesc = 'insertProductData_Fail'
        }
        console.log("----------api/insertProductData_end-----------");
        res.json(rtn);
    } catch (err) {
        console.log("insertProductData err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        res.json(rtn);
    }
});




module.exports = router;
