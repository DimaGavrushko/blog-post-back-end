const mongoose = require('mongoose');

const { ObjectId } = mongoose;

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
  },
  authorId: {
    type: ObjectId,
    required: [true, 'Author ID is required'],
  },
  postId: {
    type: ObjectId,
    required: [true, 'Post ID is required'],
  },
  authorFirst: {
    type: String,
    required: [true, 'Author first name is required'],
  },
  authorLast: {
    type: String,
    required: [true, 'Author last name is required'],
  },
  authorImg: {
    type: String,
    required: [true, 'Author avatar is required'],
  },
  createdAt: {
    type: Date,
    required: [true, 'Comment date is required'],
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
