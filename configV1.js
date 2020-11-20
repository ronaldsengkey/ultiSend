// {
//     "service": {
//         "users": "http://localhost:8444/users",
//         "credentials": "http://localhost:8444/credentials"
//     }
// }

module.exports = {
    "service": {
        "users": process.env.GATEWAY_ADMIN_HOST + "/users",
        "credentials": process.env.GATEWAY_ADMIN_HOST + "/credentials"
    }
}