const Category = require('../models/category');
const Post = require('../models/post');
const S3Service = require('../services/s3');

async function getAllCategories() {
  return Category.find({})
    .then(categories => categories)
    .catch(err => {
      throw err;
    });
}

function getPost(id) {
  return Post.findOne({ _id: id });
}

function updatePost(id, params) {
  return Post.updateOne({ _id: id }, params);
}

function getPosts(params) {
  return Post.find(params);
}

async function getApprovedPosts() {
  return getPosts({ isApproved: true })
    .then(res => res)
    .catch(err => {
      throw err;
    });
}

async function getNotApprovedPosts() {
  return getPosts({ isApproved: false })
    .then(res => res)
    .catch(err => {
      throw err;
    });
}

async function createPost(params, file) {
  try {
    let post = null;
    let s3Params = {};
    if (params.id !== '') {
      post = await getPost(params.id);
      if (file) {
        s3Params = await S3Service.upload('posts', file.path, file.filename);
        await S3Service.deleteImg(post.s3Key);
      }
      const newPostParams = {
        ...params,
        isApproved: false,
        createdAt: new Date(),
        ...s3Params
      };

      post = Object.assign(post, newPostParams);
      await updatePost(params.id, newPostParams);
    } else {
      s3Params = await S3Service.upload('posts', file.path, file.filename);
      post = new Post({
        ...s3Params,
        title: params.title,
        categoryId: params.categoryId,
        content: params.content,
        authorId: params.authorId,
        authorName: params.authorName,
        createdAt: new Date()
      });
      await post.save();
    }

    return post;
  } catch (e) {
    throw e;
  }
}

async function deletePost(postId) {
  try {
    const post = await getPost(postId);
    await S3Service.deleteImg(post.s3Key);
    await post.delete();
  } catch (e) {
    throw e;
  }
}

async function approvePost(postId) {
  try {
    await updatePost(postId, { isApproved: true });
  } catch (e) {
    throw e;
  }
}

async function undislike({ postId, userId }) {
  try {
    const post = await getPost(postId);
    post.dislikes = post.dislikes.filter(elem => !elem.equals(userId));
    await post.save();
    return post;
  } catch (e) {
    throw e;
  }
}

async function dislike({ postId, userId }) {
  try {
    const post = await getPost(postId);
    if (!post.dislikes.includes(userId)) {
      post.dislikes.push(userId);
    }
    await post.save();
    return post;
  } catch (e) {
    throw e;
  }
}

async function unlike({ postId, userId }) {
  try {
    const post = await getPost(postId);
    post.likes = post.likes.filter(elem => !elem.equals(userId));
    await post.save();
    return post;
  } catch (e) {
    throw e;
  }
}

async function like({ postId, userId }) {
  try {
    const post = await getPost(postId);
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
    }
    await post.save();
    return post;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  getAllCategories,
  getApprovedPosts,
  getNotApprovedPosts,
  createPost,
  deletePost,
  getPost,
  approvePost,
  undislike,
  dislike,
  unlike,
  like
};
