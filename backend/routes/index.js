var express = require('express');

var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  var rtn={};
  try {
    res.json('/main');
  } catch (err) {
    rtn.ack = 'FAIL';
    rtn.ackDesc = err.message;
    console.log("index err:",err);
    res.json(rtn);
  }
});



module.exports = router;