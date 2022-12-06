const db = require('../../db/database');
const m_db = require("../../model/m_db");
const utility = require("../../public/javascripts/utility");
var Sequelize = require('sequelize');
const path = require("path");
const Op = Sequelize.Op;
const fse = require('fs-extra');
var fs = require('fs');
const { FileFolderUrl } = require('../../config/ltlConfig');

module.exports = {
    /**
     * Function description : 新增
     * @param  {JSON} reqData 新增資料
     */
    insertProduct: async function (reqData) {
        var rtn = {};
        try {
            let data = reqData;
            let skuRes = await createSKUCode(reqData);
            if (skuRes.ack == 'FAIL') {
                rtn.ack = skuRes.ack;
                rtn.ackDesc = skuRes.ackDesc;
                console.log("!ERR! skuRes", skuRes.ackDesc);
            } else {
                data.insertData.sku = skuRes.ackDesc;
                const { sku } = data.insertData;
                console.log("insertData================", data.insertData);

                rtn = db.transaction().then(function (t) {
                    var rtn_ = {};

                    // insert product data
                    let req_productData = new Promise((resolve, reject) => {
                        handleProductDataPromise(data.insertData, data.op_user, t, resolve, reject);
                    });

                    // upload img
                    let req_imgData = new Promise((resolve, reject) => {
                        let picPath = path.join(FileFolderUrl, sku);
                        fse.ensureDirSync(picPath);
                        data.fileList.map((item, index) => {
                            let target = path.join(picPath, sku + "_" + index + ".jpg");
                            handleImgDataPromise(item.imageUrl, target, t, resolve, reject);
                        })
                    });

                    // insert bom
                    let req_bomData = new Promise((resolve, reject) => {
                        data.maList.map((item) => {
                            item.sku = data.insertData.sku;
                            handleBomDataPromise(item, t, resolve, reject);
                        })
                    });

                    return Promise.all([req_productData, req_imgData, req_bomData])
                        .then(value => {
                            t.commit();
                            rtn_.ack = "OK";
                            return rtn_;
                        }, resion => {
                            t.rollback();
                            rtn_.ack = "FAIL";
                            rtn_.ackDesc = "新增時發生錯誤";
                            return rtn_;
                        })
                        .catch(err => {
                            console.log("insertProduct err", err);
                            rtn_.ack = "FAIL";
                            rtn_.ackDesc = err.message;
                            return rtn_;
                        });
                })
            }

            return rtn;
        } catch (err) {
            console.log("insertProduct err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },

}


/**
   * Function description : handle Product Data Promise
   * @param  {object} insertData 新增資料
   * @param  {string} op_user op user
   * @param  {transaction} t transaction
   * @param  {resolve} resolve resolve
   * @param  {reject} reject reject
   */
function handleProductDataPromise(data, op_user, t, resolve, reject) {
    try {
        const insertData = data;
        insertData.cr_date = utility.get_today();
        insertData.op_user = op_user;

        m_db.insertWithTx(insertData, 'products', t, function (err, result) {
            err != null ? (console.log("handleProductDataPromise1 err", err), reject()) : resolve();
        })
    } catch (err) {
        console.log("handleProductDataPromise err", err)
        reject();
    }
}

/**
   * Function description : handle Img Data Promise
   * @param  {file} file imgFile
   * @param  {string} target 目的
   * @param  {transaction} t transaction
   * @param  {resolve} resolve resolve
   * @param  {reject} reject reject
   */
function handleImgDataPromise(file, target, t, resolve, reject) {
    try {
        let image = file.replace(/^data:image\/(png|png|gif|bmp|jpg|jpeg);base64,/, "");
        var binImage = Buffer.from(image, 'base64').toString('binary');
        fs.writeFile(target, binImage, "binary", function (err) {
            if (!err)
                resolve();
            else
                reject();
        });

    } catch (err) {
        console.log("handleImgDataPromise err", err)
        reject();
    }
}

/**
   * Function description : handle Bom Data Promise
   * @param  {JSON} data data
   * @param  {transaction} t transaction
   * @param  {resolve} resolve resolve
   * @param  {reject} reject reject
   */
function handleBomDataPromise(data, t, resolve, reject) {
    try {
        const insertData = data;
        insertData.cr_date = utility.get_today();
        m_db.insertWithTx(insertData, 'bom', t, function (err, result) {
            err != null ? (console.log("handleBomDataPromise1 err", err), reject()) : resolve();
        })
    } catch (err) {
        console.log("handleBomDataPromise err", err)
        reject();
    }
}


/**
   * Function description : 系列+商品種類+6碼
   * @param  {JSON} data data
   */
async function createSKUCode(data) {
    const rtn = {};
    try {
        if (data.insertData.catena_belong.length > 3 || data.insertData.single_belong.length > 3) {
            rtn.ack = 'FAIL';
            rtn.ackDesc = 'catenaBelong or singleBelong length too long';
        } else if (data.insertData.catena_belong.length < 3 || data.insertData.single_belong.length < 3) {
            rtn.ack = 'FAIL';
            rtn.ackDesc = 'catenaBelong or singleBelong length too short';
        } else {
            // 建前六碼
            let _tmpSKU = data.insertData.catena_belong.toUpperCase() + data.insertData.single_belong.toUpperCase();
            let products = await getProducts(_tmpSKU);
            if (products.ack == 'FAIL') {
                rtn.ack = products.ack;
                rtn.ackDesc = products.ackDesc;
                console.log("!ERR! createSKUCode", products.ackDesc);
            } else {
                if (products.data.length == 0) {
                    _tmpSKU = _tmpSKU + "000001";
                } else {
                    //後六碼
                    let _tmpSKUNum = Number(products.data[products.data.length - 1].sku.split(_tmpSKU)[1]) + 1;
                    // join
                    _tmpSKU = _tmpSKU + utility.padLeft(_tmpSKUNum.toString(), 6, '0');
                }
                rtn.ack = 'OK';
                rtn.ackDesc = _tmpSKU;
            }
        }
        return rtn;
    } catch (err) {
        console.log("updateUser err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        return rtn;
    }
}

// getProducts by Sku
async function getProducts(reqSku) {
    const rtn = {};
    try {
        var options = {};
        var qry = {};
        if (reqSku != undefined && reqSku != "") {
            qry.sku = {};
            qry.sku[Op.like] = '%' + reqSku + '%';
        }

        await m_db.query("products", qry, options, function (err, result) {
            err != null ? (rtn.ack = 'FAIL', rtn.ackDesc = err.message) : (rtn.ack = "OK", rtn.data = JSON.parse(JSON.stringify(result)));
        })

        return rtn;
    } catch (err) {
        console.log("getProducts err:", err);
        rtn.ack = 'FAIL';
        rtn.ackDesc = err.message;
        return rtn;
    }
}
