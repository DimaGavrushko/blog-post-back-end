const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({name: String, id: Number});
module.exports = mongoose.model('Post', PostSchema);