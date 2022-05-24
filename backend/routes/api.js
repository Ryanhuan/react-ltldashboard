const { log } = require('async');
var express = require('express');
const Tokens = require("../middlewares/token");
const member = require("../model/member");

var router = express.Router();

/*  api route. */
router.all('/*', async function (req, res, next) {
  try {
    var TokenVerify = {};
    var rtn = {};
    console.log("----------api_start-----------");
    //get token from header
    const token = JSON.parse(req.headers["authorization"]);

    //check token 
    if (!token) {
      rtn.msg = 'No token provided!';
      return res.status(403).json(rtn);
    }
    var TokenVerify = await Tokens.accessToken.verifyToken(token);
    if (!TokenVerify.result) {
      if (TokenVerify.msg == 'AccessToken_Is_Expired') {
        rtn.msg = 'Login Expired!'
        return res.status(401).json(rtn);
      } else {
        rtn.msg = 'Login Fail!'
        return res.status(403).json(rtn);
      }
    } else {
      next();
    }
    console.log("----------api_end-----------");

  } catch (err) {
    rtn.msg = err.message;
    res.json(rtn);
  }
});



router.post("/signup",async function (req, res) {
  var rtn = {};
  try {
    console.log("----------api/signup_start-----------");

    //check empty
    if(req.body.email=='' || req.body.password=='' || req.body.username==''){
      rtn.msg = "Data_Cannot_Be_Empty";
      res.json(rtn);
    }

    //check undefined
    if(req.body.email==undefined || req.body.password==undefined || req.body.username==undefined){
      rtn.msg = "Data_Cannot_Be_Undefined";
      res.json(rtn);
    }

    //check is existed
    var getUserInfo_ = await member.getUserInfo(req.body);
    console.log("getUserInfo_=================================");
    console.log(getUserInfo_.data.length);
    console.log("getUserInfo_=================================");

    if(getUserInfo_.data.length!=0){
        rtn.msg = "Email_Is_Exist";
        res.json(rtn);
    }else{
        //insert user(sign up)
        var insertUser_=await member.insertUser(req.body);
        if(insertUser_.msg!='OK'){
          console.log(insertUser_);
          rtn.msg = "SingUp_Fail";
        }else{
          rtn.msg = "SingUp_OK";
        }
        console.log("----------api/signup_end-----------");
        res.json(rtn);
    }
  } catch (err) {
    console.log(err);
    rtn.msg = err.message;
    res.json(rtn);
  }
});


router.get("/getAllUsers",async function (req, res) {
  var rtn = {};
  try {
    const getAllUsersInfo_ =await member.getAllUsersInfo();
    if(getAllUsersInfo_.msg!='OK'){
      rtn.msg = "getAllUsersInfo_Fail";
    }else{
      rtn.msg = "getAllUsersInfo_OK";
      rtn.data=getAllUsersInfo_.data;
    }
    res.json(rtn);
  } catch (err) {
    rtn.msg = err.message;
    res.json(rtn);
  }
});




router.post("/editUser",async function (req, res) {
  var rtn = {};
  try {
    console.log("----------api/editUser_start-----------");
    const updateUser_ =await member.updateUser(req.body);
    updateUser_.msg=='OK'?rtn.msg='Edit_User_OK':rtn.msg='Edit_User_Fail';
    console.log("----------api/editUser_end-----------");
    res.json(rtn);
  } catch (err) {
    console.log(err);
    rtn.msg = err.message;
    res.json(rtn);
  }
});





module.exports = router;