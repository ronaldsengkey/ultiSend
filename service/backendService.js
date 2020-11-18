const request = require('request');

exports.uploadFile = function(data){
    console.log(process.env.BACKEND_SERVICE_HOST + '/uploadFileFormData');
    return new Promise(async function(resolve){
        var options = {
            'method': 'POST',
            'url': process.env.BACKEND_SERVICE_HOST + '/uploadFileFormData',
            'headers': {
                'apiService': process.env.SERVICE_CODE,
            },
            'formData': data
        };
        // console.log("options::", options);
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