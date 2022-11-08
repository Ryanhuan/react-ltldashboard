const log = require('async');
var express = require('express');
const utility = require("../../../public/javascripts/utility");

const user = require("../../../controllers/dashboard/c_user");

var router = express.Router();

router.post("/signup", async function (req, res) {
  var rtn = {};
  try {
    console.log("----------api/signup_start-----------");
    //check empty
    if (req.body.email == '' || req.body.password == '' || req.body.username == '') {
      rtn.ack = "FAIL";
      rtn.ackDesc = "Data_Cannot_Be_Empty";
      res.json(rtn);
    }

    //check undefined
    if (req.body.email == undefined || req.body.password == undefined || req.body.username == undefined) {
      rtn.ack = "FAIL";
      rtn.ackDesc = "Data_Cannot_Be_Undefined";
      res.json(rtn);
    }

    //check is existed
    var getUserInfo_ = await user.getUserInfo(req.body);

    if (getUserInfo_.data.length != 0) {
      rtn.ack = "FAIL";
      rtn.ackDesc = "Email_Is_Exist";
      res.json(rtn);
    } else {
      //insert user(sign up)
      var _insertUser = await user.insertUser(req.body);
      rtn.ack = _insertUser.ack;
      if (_insertUser.ack != 'OK') {
        rtn.ackDesc = "SingUp_Fail";
      } else {
        rtn.ackDesc = "SingUp_OK";
      }
      console.log("----------api/signup_end-----------");
      res.json(rtn);
    }
  } catch (err) {
    console.log("signup err:", err);
    rtn.ack = 'FAIL';
    rtn.ackDesc = err.message;
    res.json(rtn);
  }
});

router.get("/getAllUsers", async function (req, res) {
  var rtn = {};
  try {
    const _getAllUsersInfo = await user.getAllUsersInfo();
    rtn.ack = _getAllUsersInfo.ack
    if (_getAllUsersInfo.ack == 'OK') {
      rtn.ackDesc = "getAllUsersInfo_OK";
      rtn.data = _getAllUsersInfo.data;
    } else {
      rtn.ackDesc = "getAllUsersInfo_Fail";
    }
    res.json(rtn);
  } catch (err) {
    console.log("getAllUsers err:", err);
    rtn.ack = 'FAIL';
    rtn.ackDesc = err.message;
    res.json(rtn);
  }
});

router.post("/editUser", async function (req, res) {
  var rtn = {};
  try {
    console.log("----------api/editUser_start-----------");
    const _updateUser = await user.updateUser(req.body);
    rtn.ack = _updateUser.ack;
    rtn.ackDesc = _updateUser.ackDesc == 'OK' ? 'Edit_User_OK' : 'Edit_User_Fail';
    console.log("----------api/editUser_end-----------");
    res.json(rtn);
  } catch (err) {
    console.log("editUser err:", err);
    rtn.ack = 'FAIL';
    rtn.ackDesc = err.message;
    res.json(rtn);
  }
});




module.exports = router;