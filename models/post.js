const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({name: String});

module.exports = mongoose.model('Post', PostSchema);
