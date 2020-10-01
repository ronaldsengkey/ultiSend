'use strict';

var utils = require('../utils/writer.js');
var apiService = require('../service/apiService');
let isValid = '';

// validator for signature and token
class validator {
  constructor(signature, token) {
    this.signature = signature;
    this.token = token;
  }
  checkToken() {
    console.log("This is token validator " + this.token);
    return true;
  }
  checkSignature() {
    console.log("This is signature validator " + this.signature);
    return true;
  }
}

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