'use strict';
var mongoose = require('mongoose').set('debug', true);
var mongoConf = require('../config/mongo');
var orderSchema = require('../config/orderSchema');
var orderLogSchema = require('../config/orderLogSchema');
var driverSchema = require('../config/driverSchema');

const moment = require('moment');
const request = require('request');
const asym = require('../config/asymmetric');

/**
 * Delete purchase order by ID
 * For valid response try integer IDs with positive integer value.         Negative or non-integer values will generate API errors
 *
 * orderId Long ID of the order that needs to be deleted
 * no response value expected for this operation
 **/

exports.accountPost = function () {
  return new Promise(async function (resolve, reject) {
    resolve("Hello from service");
  });
};

exports.getOrder = function (data) {
  return new Promise(async function (resolve, reject) {
    let res = {};
    try {
      let pId = {}, pServiceName = {}, pOrderCode = {} , pOrderReff = {}, pStatus = {};
      if (data._id) {
          pId = { '_id': data._id }
      }
      if (data.serviceName) {
          pServiceName = { 'serviceName': data.serviceName }
      }
      if (data.orderCode) {
          pOrderCode = { 'orderCode': data.orderCode }
      }
      if (data.orderReff) {
          pOrderReff = { 'orderReff': data.orderReff }
      }
      if (data.status) {
          pStatus = { 'status': data.status }
      }
      var param = extend({}, pId, pServiceName, pOrderCode, pOrderReff, pStatus);
      await mongoose.connect(mongoConf.mongoDb.url, {
          useNewUrlParser: true
      });
      let query = await orderSchema.find(param).populate('assignId');
      await mongoose.connection.close();
      console.log("query::", query[0].assignId["_id"]);
      if (query.length > 0) {
          res.responseCode = process.env.SUCCESS_RESPONSE;
          res.responseMessage = "Success";
          res.data = query;
      } else {
          res.responseCode = process.env.NOTFOUND_RESPONSE;
          res.responseMessage = "Data not found";
      }
      resolve(res)      
    } catch (err) {
      console.log('Error for get order ==> ', err)
      res = {
          'responseCode': process.env.ERRORINTERNAL_RESPONSE,
          'responseMessage': 'Internal server error'
      }
      resolve(res);

  }      
    // resolve();
  });
}

exports.postDriver = function (data) {
  console.log('postDriver =>',data)
  return new Promise(async function (resolve, reject) {
    let res = {};
    try {
      var cd = await checkDriver(data);
      if(cd.length>0){
          res.responseCode = process.env.FAILED_RESPONSE;
          res.responseMessage = "Failed driver created";
      }else{
        await mongoose.connect(mongoConf.mongoDb.url, { useNewUrlParser: true });
        let newApi = new driverSchema({
            driverId: data.driverId,
            driverName: data.driverName,
            driverPhone: data.driverPhone,
            driverAddress: data.driverAddress,
            driverEmail: data.driverEmail,
            driverImage: data.driverImage,
            driverVehicleInfo: data.driverVehicleInfo,
            driverStatus: 'off',
        });
        let na = await newApi.save();
        await mongoose.connection.close();
        if (na) {
            res.responseCode = process.env.SUCCESS_RESPONSE;
            res.responseMessage = "New driver created";
        } else {
            res.responseCode = process.env.FAILED_RESPONSE;
            res.responseMessage = "Failed driver order";
        }
      }
      resolve(res);

    } catch (err) {
        console.log('Error for create order ==> ', err)
        res = {
            'responseCode': process.env.ERRORINTERNAL_RESPONSE,
            'responseMessage': 'Internal server error'
        }
        resolve(res);
    }    
  });
}

exports.getDriver = function (data) {
  console.log('getDriver =>',data)
  return new Promise(async function (resolve, reject) {
    let res = {};
    try {
      await mongoose.connect(mongoConf.mongoDb.url, { useNewUrlParser: true });
      let query = await driverSchema.find(data);
      await mongoose.connection.close();

      if (query.length > 0) {
          res.responseCode = process.env.SUCCESS_RESPONSE;
          res.responseMessage = "Success";
          res.data = query;
      } else {
          res.responseCode = process.env.NOTFOUND_RESPONSE;
          res.responseMessage = "Data not found";
      }
      resolve(res)      
    } catch (err) {
      console.log('Error for get driver ==> ', err)
      res = {
          'responseCode': process.env.ERRORINTERNAL_RESPONSE,
          'responseMessage': 'Internal server error'
      }
      resolve(res);

  }      
    // resolve();
  });
}
exports.getDriverOld = function (data) {
  return new Promise(async function (resolve, reject) {
    let res = {};
    try {
      let res = await getEmployee(data);
      if (res.responseCode == process.env.SUCCESS_RESPONSE) {
          // res.responseCode = ge.responseCode;
          // res.responseMessage = ge.responseMessage;
          // res.data = ge.data;
      }else{
        res.responseCode = process.env.NOTFOUND_RESPONSE;
        res.responseMessage = "Data not found";        
      }
      console.log('getEmployee =>',res.data)

      // if (query.length > 0) {
      //     res.responseCode = process.env.SUCCESS_RESPONSE;
      //     res.responseMessage = "Success";
      //     res.data = query;
      // } else {
      //     res.responseCode = process.env.NOTFOUND_RESPONSE;
      //     res.responseMessage = "Data not found";
      // }
      resolve(res)      
    } catch (err) {
      console.log('Error for get driver ==> ', err)
      res = {
          'responseCode': process.env.ERRORINTERNAL_RESPONSE,
          'responseMessage': 'Internal server error'
      }
      resolve(res);

  }      
    // resolve();
  });
}
exports.postOrder = function (data) {
  return new Promise(async function (resolve, reject) {
    let res = {};
    try {
      var orderReff = await getOrderReff();
      await mongoose.connect(mongoConf.mongoDb.url, { useNewUrlParser: true });
      let newApi = new orderSchema({
          serviceName: data.serviceName,
          pickupTime: data.pickupTime,
          orderCode: data.orderCode,
          orderReff: orderReff,
          merchantName: data.merchantName,
          merchantAddress: data.merchantAddress,
          merchantPhone: data.merchantPhone,
          receiverName: data.receiverName,
          receiverAddress: data.receiverAddress,
          receiverPhone: data.receiverPhone,
          pickupTime: data.pickupTime,
          status: data.status,
          orderItem: data.orderItem,
          userCreated: data.userCreated,
      });
      let na = await newApi.save();
      await mongoose.connection.close();
      if (na) {
          res.responseCode = process.env.SUCCESS_RESPONSE;
          res.responseMessage = "New order created";
      } else {
          res.responseCode = process.env.FAILED_RESPONSE;
          res.responseMessage = "Failed create order";
      }
      resolve(res);

    } catch (err) {
        console.log('Error for create order ==> ', err)
        res = {
            'responseCode': process.env.ERRORINTERNAL_RESPONSE,
            'responseMessage': 'Internal server error'
        }
        resolve(res);
    }    
  });
}
exports.deleteOrder = function (orderId) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}

exports.assignOrderUpdate = function (data) {
  return new Promise(async function (resolve, reject) {
    let res = {}; var assignImage='';
    try {
      console.log('assignOrderUpdate =?',data)
      // let sl = await checkLog(data)
      let sl = [];
      if(sl.length>0){
          res.responseCode = process.env.FAILED_RESPONSE;
          res.responseMessage = "Failed update assign order";
      }else{
          await mongoose.connect(mongoConf.mongoDb.url, {useNewUrlParser: true});
          // insert log
          let newApi = new orderLogSchema({
            orderId: data.orderId,
            driverId: data.driverId,
            responseNotes: data.responseNotes,
            status: data.status,
            userCreated: data.userCreated,
          });
          await newApi.save();
          // update order status
          let na = await orderSchema.findOneAndUpdate({"_id": data.orderId}, {
            $set: {
              status: data.status
            }
          }, {
            useFindAndModify: false
          });
          if(data.status == 'Delivered'){
            // update driver status
            await driverSchema.findOneAndUpdate({"driverId": data.driverId}, {
              $set: {
                driverStatus: 'off'
              }
            }, {
              useFindAndModify: false
            });
          }
  
          await mongoose.connection.close();
          if (na) {
              res.responseCode = process.env.SUCCESS_RESPONSE;
              res.responseMessage = "Success,update assign order"
          } else {
              res.responseCode = process.env.FAILED_RESPONSE;
              res.responseMessage = "Failed assign order";
          }
      }
      resolve(res);      
    } catch (err) {
      console.log('Error for assignOrderPost ==> ', err)
      res = {
          'responseCode': process.env.ERRORINTERNAL_RESPONSE,
          'responseMessage': 'Internal server error'
      }
      resolve(res);
  }      
  });
}

exports.assignOrderPost = function (data) {
  console.log('assignOrderPost =>',data)
  return new Promise(async function (resolve, reject) {
    let res = {}; var assignImage='';
    try {
      // let sl = await checkLog(data)
      // console.log('checkLog =>',sl)
      let sl = []; //sementara ga pakai pengecekean 
      if(sl.length>0){
          res.responseCode = process.env.FAILED_RESPONSE;
          res.responseMessage = "Failed assign order";
      }else{
        // //get image url // no postgree connection
        // let gp = await pgCon.query("select f.path  from employee e join personal_profile pf on e.personal_profile_id=pf.id left join file f on pf.profile_img=f.id where e.id="+data.driverId);
        // if(gp.rows.length>0){
        //   var assignImage = gp.rows[0].path;
        // }

        await mongoose.connect(mongoConf.mongoDb.url, {useNewUrlParser: true});
        // insert log
        let newApi = new orderLogSchema({
          orderId: data.orderId,
          driverId: data.driverId,
          responseNotes: data.responseNotes,
          status: data.status,
          userCreated: data.userCreated,
        });
        await newApi.save();
        // update first driver status (if first driver can't complete the mission )
        if(data.firstDriverId) {
          await driverSchema.findOneAndUpdate({"driverId": data.firstDriverId}, {
            $set: {
              driverStatus: 'off'
            }
          }, {
            useFindAndModify: false
          });
        }

        // update driver status
        await driverSchema.findOneAndUpdate({"driverId": data.driverId}, {
          $set: {
            driverStatus: 'on'
          }
        }, {
          useFindAndModify: false
        });
        // update order status
        let na = await orderSchema.findOneAndUpdate({"_id": data.orderId}, {
          $set: {
            assignId: data.driverId,
            assignName: data.driverName,
            assignImage: assignImage,
            status: data.status
          }
        }, {
          useFindAndModify: false
        });

        await mongoose.connection.close();
        if (na) {
            res.responseCode = process.env.SUCCESS_RESPONSE;
            res.responseMessage = "Success, update assign order";
        } else {
            res.responseCode = process.env.FAILED_RESPONSE;
            res.responseMessage = "Failed update assign order";
        }
      }
      resolve(res);      
    } catch (err) {
      console.log('Error for assignOrderPost ==> ', err)
      res = {
          'responseCode': process.env.ERRORINTERNAL_RESPONSE,
          'responseMessage': 'Internal server error'
      }
      resolve(res);
  }      
  });
}

/**
 * Returns pet inventories by status
 * Returns a map of status codes to quantities
 *
 * returns Map
 **/
exports.getInventory = function () {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "key": 0
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Find purchase order by ID
 * For valid response try integer IDs with value >= 1 and <= 10.         Other values will generated exceptions
 *
 * orderId Long ID of pet that needs to be fetched
 * returns Order
 **/
exports.getOrderById = function (orderId) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "petId": 6,
      "quantity": 1,
      "id": 0,
      "shipDate": "2000-01-23T04:56:07.000+00:00",
      "complete": false,
      "status": "placed"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Place an order for a pet
 * 
 *
 * body Order order placed for purchasing the pet
 * returns Order
 **/
exports.placeOrder = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "petId": 6,
      "quantity": 1,
      "id": 0,
      "shipDate": "2000-01-23T04:56:07.000+00:00",
      "complete": false,
      "status": "placed"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

function extend(target) {
  var sources = [].slice.call(arguments, 1);
  sources.forEach(function (source) {
      for (var prop in source) {
          target[prop] = source[prop];
      }
  });
  return target;
}

async function getOrderReff() {
  var today = new Date();
  var head = 'REFF/'+ moment().format('YYYYMMDD');
  today.setDate(today.getDate() - 1);
  var tomorow = new Date();
  tomorow.setDate(tomorow.getDate() + 1);
  await mongoose.connect(mongoConf.mongoDb.url, { useNewUrlParser: true });

  let query = await orderSchema.aggregate([
    {
      $match: { "createdDate": { "$gte": today, "$lt": tomorow } } 
    },
    {
      $group: { _id: null, count: { $sum: 1 } }
    }
  ]);
  if(query.length > 0){
      var id = String(query[0].count + 1).padStart(4, '0'); 
      var reff = head+'/'+id;
  }else{
      var reff = head+'/0001';
  }
  await mongoose.connection.close();
  return reff;
}
async function checkLog (data){
  await mongoose.connect(mongoConf.mongoDb.url, {useNewUrlParser: true });
  let query = await orderLogSchema.find({"orderId": data.orderId, "driverId": data.driverId, "status": data.status});

  await mongoose.connection.close();
  return query;
}
async function checkDriver (data){
  await mongoose.connect(mongoConf.mongoDb.url, {useNewUrlParser: true });
  let query = await driverSchema.find({"driverId": data.driverId});
  await mongoose.connection.close();
  return query;
}
function getEmployee(data) {
  return new Promise(function (resolve, reject) {
      try {
          let a = {
              "companyProfileId": 146
          }
          let h = JSON.stringify(a);
          request.get({
              "headers": {
                  "content-type": "application/json",
                  "signature": data.signature,
                  "token": data.token,
                  "secretKey": data.secretKey,
                  "param": asym.encryptAes(h),
                  "clientKey": data.clientKey,
                  "aes": data.aes
              },
              "url": "http://" + process.env.ACCOUNT_SERVICE_HOST + "/account/data/employee",
          }, async (error, response, body) => {
              // console.log("http://" + process.env.ACCOUNT_SERVICE_HOST + "/data/employee/" + h);
              console.log({
                  "signature": data.signature, //masih hardcode
                  "token": data.token,
                  "secretKey": data.secretKey
              });
              if (error) {
                  console.log('Error checking employee data => ', error)
                  reject(process.env.ERRORINTERNAL_RESPONSE);
              } else {
                  let result = JSON.parse(body);
                  console.log('RESULT CHECK DATA EMPLOYEE => ', result);
                  resolve(result);
              }
          })
      } catch (e) {
          console.log('Error checking employee data => ', e)
          reject(process.env.ERRORINTERNAL_RESPONSE);
      }
  })
}