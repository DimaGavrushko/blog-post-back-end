const Comment = require('../models/comment');
const userService = require('../services/user');

function getComments(params) {
  return Comment.find(params).sort({ createdAt: -1 });
}

async function getUserCommentsForPost(postId, authorId) {
  try {
    const comments = await getComments({ postId, authorId });
    if (!comments) {
      throw new Error('No user comments found for this post.');
    }

    return comments;
  } catch (e) {
    throw e;
  }
}

async function getUserComments(authorId) {
  try {
    const comments = await getComments({ authorId });
    if (!comments) {
      throw new Error('No user comments found.');
    }

    return comments;
  } catch (e) {
    throw e;
  }
}

async function getPostComments(postId) {
  try {
    const comments = await getComments({ postId });
    if (!comments) {
      throw new Error('No comments found for this post.');
    }

    return comments;
  } catch (e) {
    throw e;
  }
}

async function createComment({ authorId, postId, content }) {
  try {
    const author = await userService.getUserRecord({ _id: authorId });
    const comment = new Comment({
      authorId,
      postId,
      authorFirst: author.firstName,
      authorLast: author.lastName,
      authorImg: author.url,
      content,
      createdAt: new Date()
    });
    await comment.save();

    return comment;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  getUserCommentsForPost,
  getUserComments,
  getPostComments,
  getComments,
  createComment
};
