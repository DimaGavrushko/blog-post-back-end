const Category = require("../models/category");

async function getAllCategories() {
    return Category.find({}).then(categiries => {
        return categiries;
    }).catch(err => {
        throw err;
    })
}

module.exports = {
    getAllCategories
}