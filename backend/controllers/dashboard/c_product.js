const db = require('../../db/database');
const m_db = require("../../model/m_db");
const utility = require("../../public/javascripts/utility");
var Sequelize = require('sequelize');
const path = require("path");
const Op = Sequelize.Op;
const fse = require('fs-extra');
var fs = require('fs');
const { FileFolderUrl } = require('../../config/ltlConfig');
const { codeDesc } = require('./c_mat');

module.exports = {
    /**
     * Function description : 新增
     * @param  {JSON} reqData 新增資料
     */
    handleProduct: async function (reqData) {
        var rtn = {};
        try {
            let data = reqData;

            return rtn = db.transaction().then(async function (t) {
                var rtn_ = {};
                let req_productData;
                let req_imgData;
                let req_bomData;
                let req_bomDataDelete;

                if (data.insertData.sku === undefined || data.insertData.sku === null || data.insertData.sku === '') {
                    // insert
                    // insert product data

                    let skuRes = await createSKUCode(reqData);
                    if (skuRes.ack == 'FAIL') {
                        rtn.ack = skuRes.ack;
                        rtn.ackDesc = skuRes.ackDesc;
                        console.log("!ERR! skuRes", skuRes.ackDesc);
                    } else {
                        data.insertData.sku = skuRes.ackDesc;
                        const { sku } = data.insertData;

                        req_productData = new Promise((resolve, reject) => {
                            handleInsertProductDataPromise(data.insertData, data.op_user, t, resolve, reject);
                        });

                        // upload img
                        req_imgData = new Promise((resolve, reject) => {
                            if (data.fileList.length != 0) {
                                let picPath = path.join(FileFolderUrl, sku);
                                fse.ensureDirSync(picPath);
                                data.fileList.map((item, index) => {
                                    let target = path.join(picPath, sku + "_" + index + ".jpg");
                                    handleImgDataPromise(item.imageUrl, target, t, resolve, reject);
                                })
                            } else {
                                return resolve();
                            }
                        });

                        req_bomDataDelete = new Promise((resolve, reject) => {
                            return resolve();
                        })
                    }
                } else {
                    // update
                    const { sku } = data.insertData;
                    // update product data
                    req_productData = new Promise((resolve, reject) => {
                        handleUpdateProductDataPromise(data.insertData, data.op_user, t, resolve, reject);
                    });

                    // rm and upload img
                    req_imgData = new Promise((resolve, reject) => {
                        let picPath = path.join(FileFolderUrl, sku);
                        fs.rmdirSync(picPath, { recursive: true });
                        fse.ensureDirSync(picPath);
                        data.fileList.map((item, index) => {
                            let target = path.join(picPath, sku + "_" + index + ".jpg");
                            handleImgDataPromise(item.imageUrl, target, t, resolve, reject);
                        })
                    });

                    // delete bom
                    req_bomDataDelete = new Promise((resolve, reject) => {
                        handleDeleteBomDataPromise(sku, t, resolve, reject);
                    });

                }

                // insert bom
                req_bomData = new Promise((resolve, reject) => {
                    if(data.maList.length!=0){
                    data.maList.map((item) => {
                        item.sku = data.insertData.sku;
                        handleInsertBomDataPromise(item, t, resolve, reject);
                    })
                    }else{
                        return resolve(); 
                    }

                });

                return Promise.all([req_productData, req_imgData, req_bomData, req_bomDataDelete])
                    .then(value => {
                        t.commit();
                        rtn_.ack = "OK";
                        return rtn_;
                    }, resion => {
                        t.rollback();
                        rtn_.ack = "FAIL";
                        rtn_.ackDesc = "處理資料時發生錯誤";
                        return rtn_;
                    })
                    .catch(err => {
                        console.log("handleProduct err", err);
                        rtn_.ack = "FAIL";
                        rtn_.ackDesc = err.message;
                        return rtn_;
                    });
            })
           
        } catch (err) {
            console.log("handleProduct err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },

    /**
        * Function description : 取得商品資料
        * @param  {string} reqData 使用者查詢條件資料
        */
    getProduct: async function (reqData) {
        var rtn = {};
        try {
            rtn = await queryProducts(reqData);
            for (let ele in rtn.data) {
                rtn.data[ele].kind = await codeDesc(rtn.data[ele].kind, "product_kind");
                rtn.data[ele].status = await codeDesc(rtn.data[ele].status, "product_status");
                rtn.data[ele].catena_belong = await codeDesc(rtn.data[ele].catena_belong, "product_catena");
                rtn.data[ele].single_belong = await codeDesc(rtn.data[ele].single_belong, "product_single");
            }
            return rtn;
        } catch (err) {
            console.log("getProduct err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },

    /**
      * Function description : 取得商品Bom表
      * @param  {string} sku 商品sku
      */
    getProductBom: async function (sku) {
        var rtn = {};
        try {
            // rtn = await queryProducts(reqData);
            var qry = { sku: sku };
            var options = {};

            await m_db.query("bom", qry, options, function (err, result) {
                if (err != null) {
                    rtn.ack = 'FAIL';
                    rtn.ackDesc = err.message;
                    console.log('getProductBom_query err :', err.message);
                } else {
                    rtn.ack = 'OK';
                    rtn.ackDesc = '';
                    rtn.data = JSON.parse(JSON.stringify(result));
                }
            })
            return rtn;
        } catch (err) {
            console.log("getProductBom err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },

    /**
    * Function description : 取得商品圖
    * @param  {string} sku 商品sku
    */
    getProductImg: async function (sku) {
        var rtn = {};
        try {
            let _tmpImg = [];
            let picPath = path.join(FileFolderUrl, sku);
            let _tmpArr = fs.readdirSync(picPath);
            _tmpArr.forEach(img => {
                const extensionName = path.extname(img);
                const file = fs.readFileSync(path.join(picPath, img));
                const base64Image = Buffer.from(file).toString('base64');
                const base64ImageStr = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
                _tmpImg.push(base64ImageStr);
            });

            rtn.ack = 'OK';
            rtn.data = _tmpImg;
            return rtn;
        } catch (err) {
            console.log("getProductImg err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },

    //delete
    deleteProduct: async function (reqData) {
        var rtn = {};
        try {
            const sku = reqData;
            rtn = db.transaction().then(async function (t) {
                var rtn_ = {};

                // delete bom
                let req_productDataDelete = new Promise((resolve, reject) => {
                    handleDeleteProductDataPromise(sku, t, resolve, reject);
                });
                // delete bom
                let req_bomDataDelete = new Promise((resolve, reject) => {
                    handleDeleteBomDataPromise(sku, t, resolve, reject);
                });

                return Promise.all([req_productDataDelete, req_bomDataDelete])
                    .then(value => {
                        let picPath = path.join(FileFolderUrl, sku);
                        fse.ensureDirSync(picPath);
                        fs.rmdirSync(picPath, { recursive: true });
                        t.commit();
                        rtn_.ack = "OK";
                        return rtn_;
                    }, resion => {
                        t.rollback();
                        rtn_.ack = "FAIL";
                        rtn_.ackDesc = "刪除資料時發生錯誤";
                        return rtn_;
                    })
                    .catch(err => {
                        console.log("deleteProduct err", err);
                        rtn_.ack = "FAIL";
                        rtn_.ackDesc = err.message;
                        return rtn_;
                    });

            })
            return rtn;
        } catch (err) {
            console.log("deleteProduct err:", err);
            rtn.ack = 'FAIL';
            rtn.ackDesc = err.message;
            return rtn;
        }
    },
}


//Function =====================================================================

/**
   * Function description : handle insert Product Data Promise
   * @param  {object} insertData 新增資料
   * @param  {string} op_user op user
   * @param  {transaction} t transaction
   * @param  {resolve} resolve resolve
   * @param  {reject} reject reject
   */
function handleInsertProductDataPromise(data, op_user, t, resolve, reject) {
    try {
        const insertData = data;
        insertData.cr_date = utility.get_today();
        insertData.op_user = op_user;

        m_db.insertWithTx(insertData, 'products', t, function (err, result) {
            err != null ? (console.log("handleInsertProductDataPromise1 err", err), reject()) : resolve();
        })
    } catch (err) {
        console.log("handleInsertProductDataPromise err", err)
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
   * Function description : handle insert Bom Data Promise
   * @param  {JSON} data data
   * @param  {transaction} t transaction
   * @param  {resolve} resolve resolve
   * @param  {reject} reject reject
   */
function handleInsertBomDataPromise(data, t, resolve, reject) {
    try {
        const insertData = data;
        insertData.cr_date = utility.get_today();
        m_db.insertWithTx(insertData, 'bom', t, function (err, result) {
            err != null ? (console.log("handleInsertBomDataPromise1 err", err), reject()) : resolve();
        })
    } catch (err) {
        console.log("handleInsertBomDataPromise err", err)
        reject();
    }
}


/**
   * Function description : handle update Product Data Promise
   * @param  {JSON} data data
   * @param  {string} op_user op user
   * @param  {transaction} t transaction
   * @param  {resolve} resolve resolve
   * @param  {reject} reject reject
   */
function handleUpdateProductDataPromise(data, op_user, t, resolve, reject) {
    try {
        var where = {};
        where.guid = data.guid;
        var upData = data;
        upData.op_user = op_user;
        upData.up_date = utility.get_today();

        m_db.updateWithTx(upData, 'products', where, t, function (err, result) {
            err != null ? (console.log("handleUpdateProductDataPromise1 err", err), reject()) : resolve();
        })
    } catch (err) {
        console.log("handleUpdateProductDataPromise err", err)
        reject();
    }
}

/**
   * Function description : handle delete Bom Data Promise
   * @param  {string} key key
   * @param  {transaction} t transaction
   * @param  {resolve} resolve resolve
   * @param  {reject} reject reject
   */
function handleDeleteBomDataPromise(key, t, resolve, reject) {
    try {
        var where = {};
        where.sku = key;

        m_db.deleteWithTx('bom', where, t, function (err, result) {
            err != null ? (console.log("handleDeleteBomDataPromise1 err", err), reject()) : resolve();
        })

    } catch (err) {
        console.log("handleDeleteBomDataPromise err", err)
        reject();
    }
}


/**
   * Function description : handle delete Product Data Promise
   * @param  {string} key key
   * @param  {transaction} t transaction
   * @param  {resolve} resolve resolve
   * @param  {reject} reject reject
   */
function handleDeleteProductDataPromise(key, t, resolve, reject) {
    try {
        var where = {};
        where.sku = key;

        m_db.deleteWithTx('products', where, t, function (err, result) {
            err != null ? (console.log("handleDeleteProductDataPromise1 err", err), reject()) : resolve();
        })

    } catch (err) {
        console.log("handleDeleteProductDataPromise err", err)
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
            let products = await queryProducts({ sku: _tmpSKU });
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

// queryProducts
async function queryProducts(reqData) {
    const rtn = {};
    try {
        var options = {};
        var qry = {};

        // set fuzzy search col
        let fuzzySearchArr = ['sku', 'name',];

        for (let ele in reqData) {
            if (fuzzySearchArr.includes(ele) === true) {
                if (reqData[ele] != undefined && reqData[ele] != "") {
                    qry[ele] = {};
                    qry[ele][Op.like] = '%' + reqData[ele] + '%';
                }
            } else {
                if (reqData[ele] != undefined && reqData[ele] != "") {
                    qry[ele] = reqData[ele];
                }
            }
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


