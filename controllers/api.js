'use strict';

var utils = require('../utils/writer.js');
var apiService = require('../service/apiService');
let isValid = '';
const asym = require('../config/asymmetric');
var arrStatus = ['Pending', 'Assign', 'Pick up', 'On Delivery', 'Delivered'];
var arrService = ['sameDay', 'priority'];
const validator = require('../class/validator');
const accountService = require('../service/accountService');

// validator for signature and token

module.exports.accountPost = function accountPost(req, res, next) {
  var signature = req.swagger.params["signature"].value;
  var version = req.swagger.params["v"].value;
  var token = req.swagger.params["token"].value;
  // var data = req.swagger.params["body"].value;

  isValid = new validator(signature, token);

  switch (version) {
    case 2:
      break;
    default:
      // call signature validator
      if (isValid.checkSignature()) {
        apiService
          .accountPost(cnt)
          .then(function (response) {
            utils.writeJson(res, response);
          })
          .catch(function (response) {
            utils.writeJson(res, response);
          });
      }
      break;
  }
};

module.exports.accountGet = async function accountGet(req, res){
  console.log("accountGet: ");
  var signature = req.swagger.params["signature"].value;
  var version = req.swagger.params["v"].value;
  var token = req.swagger.params["token"].value;
  // var data = req.swagger.params["body"].value;

  isValid = new validator(signature, token);
  if (isValid.checkToken()) {
    let data = await isValid.getData();
    data = await accountService.getData(data);
    utils.writeJson(res, data);  
  }
  else{
    utils.writeJson(res, {
      responseCode: 401,
      responseMessage: "Unauthorize"
    });
  }
}


module.exports.postOrder = async function postOrder(req, res, next) {
  var signature = req.swagger.params["signature"].value;
  var version = req.swagger.params["v"].value;
  var token = req.swagger.params["token"].value;
  var data = req.swagger.params["body"].value;

  isValid = new validator(signature, token);

  var service = req.swagger.params['service'].value;
  if (!service) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "service type is required",
      });
      return;
  } else {
      if (arrService.indexOf(service) < 0) {
          utils.writeJson(res, {
              responseCode: process.env.WRONGINPUT_RESPONSE,
              responseMessage: "Please insert service with sameDay, priority",
          });
          return;
      }
  }

  let result = false;
  let keys = Object.keys(data);
  for (let key of keys) {
    //   data[key] = asim.decryptAes(data[key]);
    data[key] = await asym.decrypterRsa(data[key]);
    if (!data[key]) {
      result = {
          responseCode: process.env.NOTACCEPT_RESPONSE,
          responseMessage: "Unable to read " + key,
      };
      break;
    }
  }
  
  console.log('data =>', data);
  if (result) {
      utils.writeJson(res, result);
      return;
  }

  if (!data.orderCode) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "orderCode is required",
      });
      return;
  }
  if (!data.merchantName) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "merchantName is required",
      });
      return;
  }
  if (!data.merchantAddress) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "merchantAddress is required",
      });
      return;
  }
  if (!data.merchantPhone) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "merchantPhone is required",
      });
      return;
  }
  if (!data.receiverName) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "receiverName is required",
      });
      return;
  }
  if (!data.receiverAddress) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "receiverAddress is required",
      });
      return;
  }
  if (!data.receiverPhone) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "receiverPhone is required",
      });
      return;
  }
  if (!data.orderItem) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "orderItem is required",
      });
      return;
  }
  if (!data.userCreated) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "userCreated is required",
      });
      return;
  }
  
  switch (version) {
    case 2:
      break;
    default:
      // call signature validator
      if (isValid.checkSignature()) {
        data.serviceName=service;
        data.status='pending';

        apiService
          .postOrder(data)
          .then(function (response) {
            utils.writeJson(res, response);
          })
          .catch(function (response) {
            utils.writeJson(res, response);
          });
      }
      break;
  }
};

module.exports.assignOrderPost = async function assignOrderPost(req, res, next) {
  var signature = req.swagger.params["signature"].value;
  var version = req.swagger.params["v"].value;
  var token = req.swagger.params["token"].value;
  var data = req.swagger.params["body"].value;

  isValid = new validator(signature, token);

  let result = false;
  let keys = Object.keys(data);
  for (let key of keys) {
    //   data[key] = asim.decryptAes(data[key]);
    data[key] = await asym.decrypterRsa(data[key]);
    if (!data[key]) {
      result = {
          responseCode: process.env.NOTACCEPT_RESPONSE,
          responseMessage: "Unable to read " + key,
      };
      break;
    }
  }
  
  if (result) {
      utils.writeJson(res, result);
      return;
  }
  console.log('data assignOrderPost =>', data);

  if (!data.orderId) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "orderId is required",
      });
      return;
  }
  if (!data.driverId) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "driverId is required",
      });
      return;
  }
  if (!data.driverName) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "driverName is required",
      });
      return;
  }

  if (!data.userCreated) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "userCreated is required",
      });
      return;
  }

  
  switch (version) {
    case 2:
      break;
    default:
      // call signature validator
      if (isValid.checkSignature()) {
        // data.serviceName=service;
        data.status='Assign';

        apiService
          .assignOrderPost(data)
          .then(function (response) {
            utils.writeJson(res, response);
          })
          .catch(function (response) {
            utils.writeJson(res, response);
          });
      }
      break;
  }
};

module.exports.assignOrderUpdate = async function assignOrderUpdate(req, res, next) {
  var signature = req.swagger.params["signature"].value;
  var version = req.swagger.params["v"].value;
  var token = req.swagger.params["token"].value;
  var data = req.swagger.params["body"].value;

  isValid = new validator(signature, token);

  let result = false;
  let keys = Object.keys(data);
  for (let key of keys) {
    //   data[key] = asim.decryptAes(data[key]);
    data[key] = await asym.decrypterRsa(data[key]);
    if (!data[key]) {
      result = {
          responseCode: process.env.NOTACCEPT_RESPONSE,
          responseMessage: "Unable to read " + key,
      };
      break;
    }
  }
  
  console.log('data =>', data);
  if (result) {
      utils.writeJson(res, result);
      return;
  }

  if (!data.orderId) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "orderId is required",
      });
      return;
  }
  if (!data.driverId) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "driverId is required",
      });
      return;
  }
  if (!data.status) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "status is required",
      });
      return;
  }else{
    if (arrStatus.indexOf(data.status) < 0) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "Please insert service with 'Pending', 'Assign', 'Pick up', 'On Delivery', 'Delivered'",
      });
      return;
    }
  }
  if (!data.userCreated) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "userCreated is required",
      });
      return;
  }

  
  switch (version) {
    case 2:
      break;
    default:
      // call signature validator
      if (isValid.checkSignature()) {
        apiService
          .assignOrderUpdate(data)
          .then(function (response) {
            utils.writeJson(res, response);
          })
          .catch(function (response) {
            utils.writeJson(res, response);
          });
      }
      break;
  }
};

module.exports.getOrder = async function getOrder(req, res, next) {
  var signature = req.swagger.params["signature"].value;
  var version = req.swagger.params["v"].value;
  var token = req.swagger.params["token"].value;

  signature = await asym.decrypterRsa(signature);
  if (!signature) {
      utils.writeJson(res, {
          responseCode: process.env.NOTACCEPT_RESPONSE,
          responseMessage: "Unable to read signature",
      });
      return;
  }
  let clientKey = req.swagger.params['clientKey'].value;
  clientKey = await asym.decrypterRsa(clientKey);
  if (!clientKey) {
      utils.writeJson(res, {
          responseCode: process.env.NOTACCEPT_RESPONSE,
          responseMessage: "Unable to read clientKey",
      });
      return;
  }
  // console.log('clientKey =>',clientKey)
  let param = {}
  var service = req.swagger.params["service"].value;
  param.service = service;

  isValid = new validator(signature, token);

  switch (version) {
    case 2:
      break;
    default:
      // call signature validator
      if (isValid.checkSignature()) {
        apiService
          .getOrder(param)
          .then(async function (response) {
            response.data = await asym.encryptArrayObjectRsa(response.data, clientKey);
            utils.writeJson(res, response);
          })
          .catch(function (response) {
            utils.writeJson(res, response);
          });
      }
      break;
  }
};

module.exports.postDriver = async function postDriver(req, res, next) {
  var signature = req.swagger.params["signature"].value;
  var version = req.swagger.params["v"].value;
  var token = req.swagger.params["token"].value;
  var data = req.swagger.params["body"].value;

  isValid = new validator(signature, token);

  let result = false;
  let keys = Object.keys(data);
  for (let key of keys) {
    data[key] = await asym.decrypterRsa(data[key]);
    if (!data[key]) {
      result = {
          responseCode: process.env.NOTACCEPT_RESPONSE,
          responseMessage: "Unable to read " + key,
      };
      break;
    }
  }
  
  if (result) {
      utils.writeJson(res, result);
      return;
  }

  if (!data.driverId) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "driverId is required",
      });
      return;
  }
  if (!data.driverName) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "driverName is required",
      });
      return;
  }    
  if (!data.driverPhone) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "driverPhone is required",
      });
      return;
  }
  if (!data.driverAddress) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "driverAddress is required",
      });
      return;
  }
  
  if (!data.driverEmail) {
      utils.writeJson(res, {
          responseCode: process.env.WRONGINPUT_RESPONSE,
          responseMessage: "driverEmail is required",
      });
      return;
  }

  switch (version) {
    case 2:
      break;
    default:
      // call signature validator
      if (isValid.checkSignature()) {
        apiService
          .postDriver(data)
          .then(function (response) {
            utils.writeJson(res, response);
          })
          .catch(function (response) {
            utils.writeJson(res, response);
          });
      }
      break;
  }
};

module.exports.getDriver = async function getDriver(req, res, next) {
  var token = req.swagger.params["token"].value;
  var signature = req.swagger.params["signature"].value;
  let clientKey = req.swagger.params['clientKey'].value;
  var status = req.swagger.params["status"].value;

  signature = await asym.decrypterRsa(signature);
  if (!signature) {
      utils.writeJson(res, {
          responseCode: process.env.NOTACCEPT_RESPONSE,
          responseMessage: "Unable to read signature",
      });
      return;
  }

  clientKey = await asym.decrypterRsa(clientKey);
  if (!clientKey) {
      utils.writeJson(res, {
          responseCode: process.env.NOTACCEPT_RESPONSE,
          responseMessage: "Unable to read clientKey",
      });
      return;
  }
  // console.log('clientKey =>',clientKey)
  let param = {}
  if(status) {param.driverStatus=status}
  isValid = new validator(signature, token);
  var version = 1;
  switch (version) {
    case 2:
      break;
    default:
      // call signature validator
      if (isValid.checkSignature()) {
        apiService
          .getDriver(param)
          .then(async function (response) {
            response.data = await asym.encryptArrayObjectRsa(response.data, clientKey);
            utils.writeJson(res, response);
          })
          .catch(function (response) {
            utils.writeJson(res, response);
          });
      }
      break;
  }
};

module.exports.getDriverOld = function getDriverOld(req, res, next) {
  var token = req.swagger.params["token"].value;
  var signature = req.swagger.params["signature"].value;
  var secretKey = req.swagger.params["secretKey"].value;
  let clientKey = req.swagger.params['clientKey'].value;
  let aes = req.swagger.params['aes'].value;

  // clientKey = asym.decrypterRsa(clientKey);
  // if (!clientKey) {
  //     utils.writeJson(res, {
  //         responseCode: process.env.NOTACCEPT_RESPONSE,
  //         responseMessage: "Unable to read clientKey",
  //     });
  //     return;
  // }
  // console.log('clientKey =>',clientKey)
  let param = {}
  param.token=token;
  param.signature=signature;
  param.secretKey=secretKey;
  param.clientKey=clientKey;
  param.aes=aes

  isValid = new validator(signature, token);
  var version = 1;
  switch (version) {
    case 2:
      break;
    default:
      // call signature validator
      if (isValid.checkSignature()) {
        apiService
          .getDriverOld(param)
          .then(async function (response) {
            // response.data = await asym.encryptArrayObjectRsa(response.data, clientKey);
            utils.writeJson(res, response);
          })
          .catch(function (response) {
            utils.writeJson(res, response);
          });
      }
      break;
  }
};
