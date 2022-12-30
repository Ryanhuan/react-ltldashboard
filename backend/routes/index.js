var express = require('express');
const product = require("../controllers/dashboard/c_product");
var router = express.Router();

/* GET home page. */
// router.get('/', function (req, res, next) {
//   var rtn={};
//   try {
//     res.json('/main');
//   } catch (err) {
//     rtn.ack = 'FAIL';
//     rtn.ackDesc = err.message;
//     console.log("index err:",err);
//     res.json(rtn);
//   }
// });


router.post('/getProductImgData/:sku', async function (req, res) {
  var rtn = {};
  try {
      console.log("----------api/getProductImgData_start-----------");
      let _res = await product.getProductImg(req.params.sku);
      rtn.ack = _res.ack;
      if (_res.ack == 'OK') {
          rtn.ackDesc = 'getProductImgData_OK';
          rtn.data = _res.data;
      } else {
          rtn.ackDesc = 'getProductImgData_Fail'
      }
      console.log("----------api/getProductImgData_end-----------");
      res.json(rtn);
  } catch (err) {
      console.log("getProductImgData err:", err);
      rtn.ack = 'FAIL';
      rtn.ackDesc = err.message;
      res.json(rtn);
  }
});

module.exports = router;