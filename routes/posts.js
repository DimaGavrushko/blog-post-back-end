const router = require('express').Router();
const Post = require('../models/post');
const postService = require('../services/post');

router.get('/', (req, res) => {
  Post.find({}).then(posts => res.json(posts));
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await postService.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500)
        .json({
          error: err.message
        });
  }
});

module.exports = router;
