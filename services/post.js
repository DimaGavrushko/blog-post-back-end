const Category = require("../models/category");
const Post = require("../models/post");

async function getAllCategories() {
    return Category.find({}).then(categiries => {
        return categiries;
    }).catch(err => {
        throw err;
    })
}

function getPosts(params) {
    return Post.find(params);
}

async function getApprovedPosts() {
    return getPosts({isApproved: true}).then(res => {
        return res;
    }).catch(err => {
        throw err;
    })
}

async function getNotApprovedPosts() {
    return getPosts({isApproved: false}).then(res => {
        return res;
    }).catch(err => {
        throw err;
    })
}

module.exports = {
    getAllCategories,
    getApprovedPosts,
    getNotApprovedPosts,
};