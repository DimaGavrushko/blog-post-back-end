const mongoose = require("mongoose");
const ObjectId = mongoose.ObjectId;

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        required: true,
    },
    categoryId: {
        type: ObjectId,
        required: true,
    },
    url: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0,
        required: true,
    },
    dislikes: {
        type: Number,
        default: 0,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Post', PostSchema);
