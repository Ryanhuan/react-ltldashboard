const {log} = require('async');
var express = require('express');
const Tokens = require("../middlewares/token");
const member = require("../model/member");
const codeManage = require("../model/codeManage");
const Mat = require("../model/Mat");
const utility = require("../public/javascripts/utility");

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

router.post("/signup", async function (req, res) {
  var rtn = {};
  try {
    console.log("----------api/signup_start-----------");

    //check empty
    if (req.body.email == '' || req.body.password == '' || req.body.username == '') {
      rtn.msg = "Data_Cannot_Be_Empty";
      res.json(rtn);
    }

    //check undefined
    if (req.body.email == undefined || req.body.password == undefined || req.body.username == undefined) {
      rtn.msg = "Data_Cannot_Be_Undefined";
      res.json(rtn);
    }

    //check is existed
    var getUserInfo_ = await member.getUserInfo(req.body);

    if (getUserInfo_.data.length != 0) {
      rtn.msg = "Email_Is_Exist";
      res.json(rtn);
    } else {
      //insert user(sign up)
      var insertUser_ = await member.insertUser(req.body);
      if (insertUser_.msg != 'OK') {
        // console.log(insertUser_);
        rtn.msg = "SingUp_Fail";
      } else {
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

router.get("/getAllUsers", async function (req, res) {
  var rtn = {};
  try {
    const getAllUsersInfo_ = await member.getAllUsersInfo();
    // console.log("getAllUsersInfo_",getAllUsersInfo_.data);
    if (getAllUsersInfo_.msg != 'OK') {
      rtn.msg = "getAllUsersInfo_Fail";
    } else {
      rtn.msg = "getAllUsersInfo_OK";
      rtn.data = getAllUsersInfo_.data;
    }
    res.json(rtn);
  } catch (err) {
    rtn.msg = err.message;
    res.json(rtn);
  }
});

router.post("/editUser", async function (req, res) {
  var rtn = {};
  try {
    console.log("----------api/editUser_start-----------");
    const updateUser_ = await member.updateUser(req.body);
    updateUser_.msg == 'OK' ? rtn.msg = 'Edit_User_OK' : rtn.msg = 'Edit_User_Fail';
    console.log("----------api/editUser_end-----------");
    res.json(rtn);
  } catch (err) {
    console.log(err);
    rtn.msg = err.message;
    res.json(rtn);
  }
});

router.post("/getSelectOption", async function (req, res) {
  var rtn = {};
  try {
    console.log("----------api/getSelectOption_start-----------");
    rtn.data = {};
    for (let i = 0; i < req.body.length; i++) {
      let _res = await codeManage.getCodeInfo(req.body[i]);
      if (_res.msg == 'OK') {
        rtn.msg = 'getSelectOption_OK';
        let _tmp = [];
        JSON.parse(_res.data).forEach(ele => {
          _tmp.push({
            value: ele.code_seq1,
            label: ele.code_desc1,
            guid: ele.guid
          })
        });
        rtn.data[req.body[i]] = _tmp;
      } else {
        rtn.msg = 'getSelectOption_Fail';
      }
    }
    // console.log("rtn",rtn);
    console.log("----------api/getSelectOption_end-----------");
    res.json(rtn);
  } catch (err) {
    console.log(err);
    rtn.msg = err.message;
    res.json(rtn);
  }
});

router.post("/getCodeTypeKind/:type", async function (req, res) {
  var rtn = {};
  try {
    console.log("----------api/getCodeTypeKind_start-----------");
    rtn.data = {};
 
    let _res= await codeManage.getCodeTypeKind(req.params.type);
    // console.log("_res",_res);
    if (_res.status == 'OK') {
      rtn.msg = 'getCodeTypeKind_OK';
      rtn.data=_res.data;
    } else {
      rtn.msg = 'getCodeTypeKind_Fail';
    }
    // console.log("rtn",rtn);
    console.log("----------api/getCodeTypeKind_end-----------");
    res.json(rtn);
  } catch (err) {
    console.log(err);
    rtn.msg = err.message;
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
 
    let _res= await codeManage.editCodeData({...req.body,op_user});
    // console.log("_res",_res);
    if (_res.status == 'OK') {
      rtn.status = 'editCodeData_OK';
      rtn.data=_res.data;
    } else {
      rtn.status = 'editCodeData_Fail';
    }
    // console.log("rtn",rtn);
    console.log("----------api/editCodeData_end-----------");
    res.json(rtn);
  } catch (err) {
    console.log(err);
    rtn.msg = err.message;
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
 
    let _res= await codeManage.insertCodeData({...req.body,op_user});
    // console.log("_res",_res);
    if (_res.status == 'OK') {
      rtn.status = 'insertCodeData_OK';
      rtn.data=_res.data;
    } else {
      rtn.status = 'insertCodeData_Fail';
      rtn.msg=_res.msg;
    }
    // console.log("rtn",rtn);
    console.log("----------api/insertCodeData_end-----------");
    res.json(rtn);
  } catch (err) {
    console.log(err);
    rtn.msg = err.message;
    res.json(rtn);
  }
});

router.post("/deleteCodeData", async function (req, res) {
  var rtn = {};
  try {
    console.log("----------api/deleteCodeData_start-----------");
    var TokenVerify = Tokens.accessToken.verifyToken(JSON.parse(req.headers["authorization"]));
    var op_user = TokenVerify.decodeData.email;

    let _res = await codeManage.deleteCodeData({...req.body,op_user});
    // console.log("_res",_res);
    if (_res.status == 'OK') {
      rtn.status = 'deleteCodeData_OK';
      rtn.data = _res.data;
    } else {
      rtn.status = 'deleteCodeData_Fail'
      rtn.msg = _res.msg;
    }

    console.log("----------api/deleteCodeData_end-----------");
    res.json(rtn);
  } catch (err) {
    console.log(err);
    rtn.msg = err.message;
    res.json(rtn);
  }
});

router.post("/insertMatData", async function (req, res) {
  var rtn = {};
  try {
    console.log("----------api/insertMatData_start-----------");
    var TokenVerify = Tokens.accessToken.verifyToken(JSON.parse(req.headers["authorization"]));
    var op_user = TokenVerify.decodeData.email;

    // var insertData = {
    //   ...req.body, op_user
    // };
    // let _res = await Mat.insertMat(insertData);
    let _res = await Mat.insertMat({...req.body, op_user});
    // console.log("_res",_res);
    if (_res.status == 'OK') {
      rtn.status = 'InsertMatData_OK';
      rtn.data = _res.data;
    } else {
      rtn.status = 'InsertMatData_Fail'
      rtn.msg = _res.msg;
    }

    console.log("----------api/insertMatData_end-----------");
    res.json(rtn);
  } catch (err) {
    console.log(err);
    rtn.msg = err.message;
    res.json(rtn);
  }
});

router.post("/getMatData", async function (req, res) {
  var rtn = {};
  try {
    console.log("----------api/getMatData_start-----------");
    var qryData = {
      ...req.body,
    };
    let _res = await Mat.queryMatData(qryData);
    // console.log("_res",_res);
    if (_res.status == 'OK') {
      rtn.status = 'getMatData_OK';
      rtn.data = _res.data;
    } else {
      rtn.status = 'getMatData_Fail'
      rtn.msg = _res.msg;
    }

    console.log("----------api/getMatData_end-----------");
    res.json(rtn);
  } catch (err) {
    console.log(err);
    rtn.msg = err.message;
    res.json(rtn);
  }
});

router.post("/deleteMatData", async function (req, res) {
  var rtn = {};
  try {
    console.log("----------api/deleteMatData_start-----------");
   
    var reqData = {
      ...req.body,
    };

    let _res = await Mat.deleteMatData(reqData);
    // console.log("_res",_res);
    if (_res.status == 'OK') {
      rtn.status = 'deleteMatData_OK';
      rtn.data = _res.data;
    } else {
      rtn.status = 'deleteMatData_Fail'
      rtn.msg = _res.msg;
    }

    console.log("----------api/deleteMatData_end-----------");
    res.json(rtn);
  } catch (err) {
    console.log(err);
    rtn.msg = err.message;
    res.json(rtn);
  }
});

router.post("/editMatData", async function (req, res) {
  var rtn = {};
  try {
    console.log("----------api/editMatData_start-----------");
    var TokenVerify = Tokens.accessToken.verifyToken(JSON.parse(req.headers["authorization"]));
    var op_user = TokenVerify.decodeData.email;

    var reqData = {
      ...req.body,
      op_user
    };

    let _res = await Mat.editMatData(reqData);
    // console.log("_res",_res);
    if (_res.status == 'OK') {
      rtn.status = 'editMatData_OK';
      rtn.data = _res.data;
    } else {
      rtn.status = 'editMatData_Fail'
      rtn.msg = _res.msg;
    }

    console.log("----------api/editMatData_end-----------");
    res.json(rtn);
  } catch (err) {
    console.log(err);
    rtn.msg = err.message;
    res.json(rtn);
  }
});

module.exports = router;