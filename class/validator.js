const request = require('request');
const crypto = require('crypto');
const efs = require("fs");
// const configV1 = JSON.parse(efs.readFileSync("./configV1.json", "utf-8"));
const configV1 = require('../configV1');
const asym = require('../config/asymmetric');

class Validator {
    constructor(signature, token, authorization) {
        console.log("new validator::", signature, token);
        this.signature = signature;
        this.token = token;
        this.appId = false;
        this.authorization = authorization;
    }
    async checkToken() {
        // console.log("This is token validator " + this.token);
        const url = process.env.AUTH_SERVICE_HOST + "/identifier?v=1&flowEntry=ultisend";
        // console.log("url:", url);
        const options = {
            'method': 'GET',
            'url': url,
            'headers': {
                'token': this.token,
                'signature': this.signature,
                'Authorization': this.authorization,
            }
        }
        console.log("options::", options);
        let result = await sentRequest(options);
        if (result.responseCode == process.env.SUCCESS_RESPONSE) {
            return true;
        }
        else {
            return false;
        }
    }
    async checkSignature() {
        // console.log("This is signature validator " + this.signature);
        let svUrl = process.env.AUTH_SERVICE_HOST + "/signatureValidation";
        const options = {
            "headers": {
                "signature": this.signature
            },
            "method": "POST",
            "url": svUrl
        }
        console.log("options::", options);
        let result = await sentRequest(options);
        console.log("result::", result);
        if (result.responseCode == process.env.SUCCESS_RESPONSE) {
            this.appId = result.data.appId;
            // console.log("this.appId::", this.appId);
            return true;
        }
        else {
            return false;
        }
    }
    async getData() {
        const algorithm = 'aes256';
        const secretKey = process.env.AES_KEY_SERVER;
        const iv = process.env.AES_IV_SERVER;
        let decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
        let decrypted = decipher.update(this.token, 'base64', 'utf8');
        let data = JSON.parse(decrypted + decipher.final('utf8'));
        var options = {
            'method': 'GET',
            'url': process.env.AUTH_SERVICE_HOST + '/users/' + data.customerId,
            'headers': {
            }
        };
        return await sentRequest(options);
    }
    async decryptObjectData(data = {}){
        let keys = Object.keys(data);
        for (let key of keys) {
            //   data[key] = asim.decryptAes(data[key]);
            let ex = ['photo', 'cardImage']
            // console.log(key, "::", data[key].substring(0, 10));
            if (!ex.includes(key)) {
                data[key] = await asym.decrypterRsa(data[key]);   
            }
            // console.log(key, "::", data[key].substring(0, 10));
            if (data[key] === false) {
                return false;
            }
        }
        // console.log("data::", data);
        return data
    }
}

module.exports = Validator;

function sentRequest(options){
    return new Promise(async function (resolve, reject) {
        request(options, (error, response, body) => {
            if (error) {
                console.log("error::", error);
                resolve(false);
            } else {
                try {
                    console.log(options.url, "::", body);
                    let result = JSON.parse(body);
                    resolve(result);
                } catch (error) {
                    console.log("error::", error);
                    resolve(false);
                }
            }
        });
    })
}