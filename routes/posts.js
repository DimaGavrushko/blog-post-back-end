const router = require('express').Router();
const Post = require('../models/post');
const postService = require('../services/post');

router.get('/approved', async (req, res) => {
    try {
        const posts = await postService.getApprovedPosts();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500)
            .json({
                error: err.message
            });
    }
});

router.get('/notApproved', async (req, res) => {
    try {
        const posts = await postService.getNotApprovedPosts();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500)
            .json({
                error: err.message
            });
    }
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
