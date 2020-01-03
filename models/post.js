const mongoose = require('mongoose');

const { ObjectId } = mongoose;

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  authorId: {
    type: ObjectId,
    required: true
  },
  categoryId: {
    type: ObjectId,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  likes: {
    type: [ObjectId],
    default: [],
    required: true
  },
  dislikes: {
    type: [ObjectId],
    default: [],
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  s3Key: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Post', PostSchema);
