'use strict';

const request = require('request');
let message = {};

exports.checkToken = function (token) {
  return new Promise(async function (resolve, reject) {
    try {
      request.get({
        "headers": {
          "content-type": "application/json"
        },
        "url": "http://" + process.env.AUTH_SERVICE_HOST + "/authentication/check/" + token,
      }, function (error, response, body) {

        if (error) {
          console.log('Error checking token => ', error)
          reject(process.env.ERRORINTERNAL_RESPONSE);
        } else {
          let result = JSON.parse(body);
          resolve(result);
        }
      })
    } catch (e) {
      console.log('Error checking token => ', e)
      reject(process.env.ERRORINTERNAL_RESPONSE);
    }
  })
}

exports.checkSignature = function (signature) {
  return new Promise(async function (resolve, reject) {
    let result = {}
    let svUrl = process.env.AUTH_SERVICE_HOST + "/signatureValidation";
    request.post({
      "headers": {
        "signature": signature
      },
      "method": "POST",
      "url": svUrl
    }, (error, response, body) => {
      console.log('body =>',error)
      if (error) {
        result.responseCode = process.env.ERRORINTERNAL_RESPONSE;
        result.responseMessage = "Internal server error, please try again!";
      } else {
        result = JSON.parse(body);
      }
      // console.log('RESULT CHECK SIGNATURE ==> ', result);
      resolve(result);
    });
  })
}

exports.checkCustomerSignature = function (signature) {
  return new Promise(async function (resolve, reject) {
    let result = {}
    let svUrl = process.env.AUTH_SERVICE_HOST + "/customerSignatureValidation";
    request.post({
      "headers": {
        "signature": signature
      },
      "method": "POST",
      "url": svUrl
      // "host": 'eternagame.wikia.com',
      // "port": 8080,
      // "path": '/wiki/EteRNA_Dictionary'      
    }, async (error, response, body) => {
      if (error) {
        result.responseCode = process.env.ERRORINTERNAL_RESPONSE;
        result.responseMessage = "Internal server error, please try again!";
      } else {
        result = JSON.parse(body);
      }
      resolve(result);
    });
  })
}

exports.checkSecretKey = function (secretKey) {
  return new Promise(async function (resolve, reject) {
    let result = {}
    let svUrl = "http://" + process.env.AUTH_SERVICE_HOST + "/authentication/screetKeyValidation";
    request.post({
      "headers": {
        "screetkey": secretKey
      },
      "method": "POST",
      "url": svUrl
    }, (error, response, body) => {
      if (error) {
        result.responseCode = process.env.ERRORINTERNAL_RESPONSE;
        result.responseMessage = "Internal server error, please try again!";
      } else {
        result = JSON.parse(body);
      }
      resolve(result);
    });
  })
}