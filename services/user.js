const User = require("../models/user");

async function getUserRecord(params) {
    return User.findOne(params).then(user => {
        return user;
    }).catch(err => {
        throw err;
    });
}

async function saveUser(params) {

}

module.exports = {
    getUserRecord
};
