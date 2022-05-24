'use strict'

var pad = require("pad");
const async = require("async");
var fs = require('fs');
// const nodemailer = require('nodemailer');
// var moment = require('moment');
// var os = require('os');



/**
 * 
 * @param {any} addr 門牌資料
 * are：郵遞區號
 * ad1：村里鄰
 * ad2：路街段
 * ad3：巷
 * ad4：弄
 * ad5：號
 * ad6：號之
 * ad6_1：之號
 * ad7：樓
 * ad7_1：樓之
 * ad8：室
 */
// exports.comb_addr = function (addr, callback) {
//     var result = "";
//     async.waterfall([
//         function (next) {
//             if (addr.are) {
//                 bldcode.findOne({
//                     attributes: ["code_desc1"],
//                     where: {
//                         code_type: "ZON",
//                         code_seq1: addr.are
//                     }
//                 }).then((data) => {
//                     if (data !== null) {
//                         result += data.code_desc1
//                     }
//                     next();
//                 }).catch((err) => {
//                     callback(err);
//                     return false;
//                 })
//             } else {
//                 next();
//             }
//         },
//         function (next) {
//             if (addr.ad1) {
//                 result += addr.ad1;
//             }
//             if (addr.ad2) {
//                 result += addr.ad2;
//             }
//             if (addr.ad3) {
//                 if (addr.ad4.endsWith("巷")) {
//                     result += addr.ad3;
//                 } else {
//                     result += addr.ad3 + "巷";
//                 }
//             }
//             if (addr.ad4) {
//                 if (addr.ad4.endsWith("弄") || addr.ad4.endsWith("衖")) {
//                     result += addr.ad4;
//                 } else {
//                     result += addr.ad4 + "弄";
//                 }
//             }
//             if (addr.ad5 && addr.ad6) {
//                 result += addr.ad5 + "-" + addr.ad6 + "號";
//             } else if (addr.ad5 && !addr.ad6) {
//                 result += addr.ad5 + "號";
//             }
//             if (addr.ad6_1) {
//                 if (!addr.ad7 && !addr.ad7_1 && !addr.ad8) {
//                     result += "之" + addr.ad6_1
//                 } else {
//                     result += "之" + addr.ad6_1 + "，"
//                 }
//             }
//             if (addr.ad7) {
//                 result += addr.ad7.replace("B", "地下") + "樓";
//             }
//             if (addr.ad7_1) {
//                 if (!addr.ad8) {
//                     result += "之" + addr.ad7_1
//                 } else {
//                     result += "之" + addr.ad7_1 + "，"
//                 }
//             }
//             if (addr.ad8) {
//                 result += addr.ad8 + "室";
//             }
//             next();
//         },
//         function (next) {
//             callback(null, result);
//         }
//     ])
// }

// exports.getLocalIP = function () {
//     var ifaces = os.networkInterfaces();
//     var result = "";
//     for (var ifname in ifaces) {
//         var iface = ifaces[ifname];
//         for (var i = 0; i < iface.length; i++) {
//             if (iface[i].family !== "IPv4" || iface[i].internal !== false) {
//                 continue;
//             }
//             result = iface[i].address;
//         }
//     }
//     return result;
// }
/**
 * 取得民國年yyyMMdd
 */
exports.get_today = function () {
    var today = new Date();
    var yyy = pad(3, today.getFullYear() - 1911, "0");
    var month = pad(2, today.getMonth() + 1, "0");
    var day = pad(2, today.getDate(), "0");
    return yyy + month + day;
}
/**
 * 取得西元年yyyyMMdd
 */
exports.get_now = function () {
    var today = new Date();
    var yyy = pad(3, today.getFullYear(), "0");
    var month = pad(2, today.getMonth() + 1, "0");
    var day = pad(2, today.getDate(), "0");
    return yyy + month + day;
}

/**
 * 取得日期編碼yyyMMdd
 * @param {*} src 
 */
exports.get_taiday = function (src) {
    var yyy = pad(3, src.getFullYear() - 1911, "0");
    var month = pad(2, src.getMonth() + 1, "0");
    var day = pad(2, src.getDate(), "0");
    return yyy + month + day;
}
/**
 * 取得民國年編碼
 */
exports.getyyy = function () {
    var strDate = new Date();
    return strDate.getFullYear() - 1911;
}
/**
 * 取得民國年編碼
 */
exports.getyyy = function () {
    var today = new Date();
    var strYYY = pad(3, today.getFullYear() - 1911, "0");
    return strYYY;
}

exports.getMM = function () {
    var today = new Date();
    var strYYY = pad(2, today.getMonth() + 1, "0");
    return strYYY;
}

exports.getdd = function () {
    var today = new Date();
    var strdd = pad(2, today.getDate(), "0");
    return strdd;
}


/**
 * 日期檢核
 * @param {*} dateString yyymmdd yyy=民國年
 */
exports.isValidDate = function (dateString) {
    // First check for the pattern
    if (dateString.length != 7 || !/^[0-9]*$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var year = parseInt(dateString.substring(0, 3)) + 1911;
    var month = parseInt(dateString.substring(3, 5));
    var day = parseInt(dateString.substring(5, 7));

    // Check the ranges of month
    if (month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

// exports.sendemail = function (toEmail, subject, html, callback) {
//     var mailOptions = {
//         from: login_config.FROMEMAIL,
//         to: toEmail,
//         subject: subject,
//         html: html
//     }

//     var transjson = {
//         host: login_config.mail_host, //寄信的host
//         port: login_config.mail_port //寄信的port
//     };
    
//     transjson.secure = false;
//     transjson.tls = {
//         rejectUnauthorized: false
//     }
//     //如果協定是https 需要增加兩個安全性才可寄出
//     // if (html.includes("https")) {
//     //     transjson.secure = false;
//     //     transjson.tls = {
//     //         rejectUnauthorized: false
//     //     }
//     // }

//     //如果有帳號密碼
//     if (login_config.user !== "" && login_config.pass !== "") {
//         transjson.auth = {
//             user: login_config.user,
//             pass: login_config.pass
//         }
//     }
//     //console.log(transjson)

//     //建!!!!!!!!!!
//     var transporter = nodemailer.createTransport(transjson);

//     //送!!!!!!!!!!
//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             callback(new Error(error));
//         } else {
//             callback(null);
//         }
//     });
// };
//字串半形轉全形
exports.halfToFull = function (inputString) {
    var temp = "";
    for (var i = 0; i < inputString.length; i++) {
        var charCode = inputString.charCodeAt(i);
        if (charCode <= 126 && charCode >= 33) {
            charCode += 65248;
        } else if (charCode == 32) { // 半形空白轉全形
            charCode = 12288;
        }
        temp = temp + String.fromCharCode(charCode);
    }
    return temp;
};

/**
 * get timestamp for system log
 */
exports.get_timestamp = function () {
    var today = new Date();
    var yyy = pad(3, today.getFullYear(), "0");
    var month = pad(2, today.getMonth() + 1, "0");
    var day = pad(2, today.getDate(), "0");
    var hour = pad(2, today.getHours(), "0");
    var minute = pad(2, today.getMinutes(), "0");
    var second = pad(2, today.getSeconds(), "0");
    var ms = pad(3, today.getMilliseconds(), "0");
    return yyy + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second + ":" + ms;
}

/**
 * 取得時間 HHMM
 */
 exports.get_nowtime = function () {
    var today = new Date();
    var hour = pad(2, today.getHours(), "0");
    var minute = pad(2, today.getMinutes(), "0");
    return hour + minute;
}

/**
 * @param {JSON} path  路徑
 * @param {callback} callback function(err, result)  
 */
// exports.createFolder = function (path, callback) {
//     try {
//         path = path.replace(/\\/g, "/");
//         var pathArray = path.split("/");
//         pathArray.splice(0, 1) //刪掉第一個
//         if (pathArray[0] == "") { //開頭兩斜線 = 網芳
//             pathArray[1] = "//" + pathArray[1]; //第一個跟第二個合併
//             pathArray.splice(0, 1) //刪掉第一個
//         }
//         if (pathArray[pathArray.length - 1].indexOf(".") != -1) { //看最後一個是不是檔案
//             pathArray.pop(); //是的話從陣列中刪除
//         }
//         var dir = "";
//         for (var ele of pathArray) {
//             if (ele.indexOf("/") == -1) {
//                 dir = dir + "/" + ele;
//             } else {
//                 dir = dir + ele;
//             }
//             if (!fs.existsSync(dir)) {
//                 fs.mkdirSync(dir);
//             }
//         }
//         callback(null, "success")
//     } catch (error) {
//         callback(error)
//     }
// }

