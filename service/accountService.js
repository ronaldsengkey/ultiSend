const request = require('request');

exports.getData = function(param, category = 'employee'){
    console.log(process.env.ACCOUNT_SERVICE_HOST + '/data/' + category);
    return new Promise(async function(resolve){
        var options = {
            'method': 'GET',
            'url': process.env.ACCOUNT_SERVICE_HOST + '/data/' + category,
            'headers': {
                'apiService': process.env.SERVICE_CODE,
                'param': JSON.stringify(param)
            }
        };
        request(options, function (error, response) {
            if (error){
                console.log("error::", error);
                return resolve(false);    
            }
            try {
                resolve(JSON.parse(response.body))
            } catch (error) {
                resolve(response.body)
            }
        });
    })
}

exports.register = function(param){
    return new Promise(async function(resolve){
        var options = {
            'method': 'POST',
            'url': process.env.ACCOUNT_SERVICE_HOST + '/backend/customerService',
            'headers': {
                'apiService': process.env.SERVICE_CODE,
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(param)
        };
        request(options, function (error, response) {
            try {
                // console.log("response::", response);
                if (error){
                    console.log("error::", error);
                    return resolve(false);    
                }
                resolve(JSON.parse(response.body))    
            } catch (error) {
                console.log("error::", error);
                resolve(false);
            }
        });
    })
}

exports.getCompany = function(param){
    return new Promise(async function(resolve){
        var options = {
            'method': 'GET',
            'url': process.env.ACCOUNT_SERVICE_HOST + '/companyList',
            'headers': {
                'apiService': process.env.SERVICE_CODE,
                'param': JSON.stringify(param),
                'Content-Type': 'application/json'
            }
        };
        request(options, function (error, response) {
            try {
                // console.log("response::", response);
                if (error){
                    console.log("error::", error);
                    return resolve(false);    
                }
                resolve(JSON.parse(response.body))    
            } catch (error) {
                console.log("error::", error);
                resolve(false);
            }
        });
    })
}

exports.getDataTemp = function(param, category = 'employee'){
    console.log(process.env.ACCOUNT_SERVICE_HOST + '/data/' + category);
    return new Promise(async function(resolve){
        var options = {
            'method': 'GET',
            'url': process.env.ACCOUNT_SERVICE_HOST + '/data/' + category,
            'headers': {
                'apiService': process.env.SERVICE_CODE,
                'param': JSON.stringify(param)
            }
        };
        request(options, function (error, response) {
            if (error){
                console.log("error::", error);
                return resolve(false);    
            }
            try {
                resolve(JSON.parse(response.body))
            } catch (error) {
                resolve(response.body)
            }
        });
    })
}

exports.confirmDataEmployee = function(param){
    return new Promise(async function(resolve){
        var options = {
            'method': 'POST',
            'url': process.env.ACCOUNT_SERVICE_HOST + '/otp/confirm',
            'headers': {
                'apiService': process.env.SERVICE_CODE,
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(param)
        };
        console.log("options::", options);
        request(options, function (error, response) {
            if (error){
                console.log("error::", error);
                return resolve(false);    
            }
            try {
                resolve(JSON.parse(response.body))
            } catch (error) {
                resolve(response.body)
            }
        });
    })    
}