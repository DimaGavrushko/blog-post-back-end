const router = require('express').Router();
const Post = require('../models/post');
const postService = require('../services/post');
const S3Service = require('../services/s3');
const {withAuth} = require("../middlewares");
const multerService = require('../services/multer');

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

router.get('/notApproved', withAuth, async (req, res) => {
    try {
        if (req.role !== 'admin') {
            res.status(403).json(false);
        }
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

router.put('/createPost', withAuth, multerService.upload.single('img'), async (req, res) => {
    try {
        let post = null;
        let s3Params = {};
        if (req.body.id !== '') {
            post = await Post.findOne({_id: req.body.id});
            if (req.file) {
                s3Params = await S3Service.upload('posts', req.file.path, req.file.filename);
                await S3Service.deleteImg(post.s3Key);
            }
            let params = {
                ...req.body,
                isApproved: false,
                createdAt: new Date(),
                ...s3Params
            };

            post = Object.assign(post, params);
            await Post.updateOne({_id: req.body.id}, params);
        } else {
            console.log(req.body, req.file);
            s3Params = await S3Service.upload('posts', req.file.path, req.file.filename);
            post = new Post({
                ...s3Params,
                title: req.body.title,
                categoryId: req.body.categoryId,
                content: req.body.content,
                authorId: req.body.authorId,
                authorName: req.body.authorName,
                createdAt: new Date()
            });
            await post.save();
        }
        res.status(200).json(post);
    } catch (e) {
        console.log(e);
        res.status(400)
            .json({
                error: 'Bad request'
            });
    }
});

router.post('/like', withAuth, async (req, res) => {
    try {
        if (req.userId !== req.body.userId) {
            res.status(403).json(false);
        }
        let post = await Post.findOne({_id: req.body.postId});
        if (!post.likes.includes(req.body.userId)) {
            post.likes.push(req.body.userId);
        }
        await post.save();
        res.status(200).json(post);
    } catch (e) {
        console.log(e);
        res.status(400)
            .json({
                error: 'Bad request'
            });
    }
});

router.post('/unlike', withAuth, async (req, res) => {
    try {
        if (req.userId !== req.body.userId) {
            res.status(403).json(false);
        }
        let post = await Post.findOne({_id: req.body.postId});
        post.likes = post.likes.filter(elem => {
            return !elem.equals(req.body.userId);
        });
        await post.save();
        res.status(200).json(post);
    } catch (e) {
        res.status(400)
            .json({
                error: 'Bad request'
            });
    }
});

router.post('/dislike', withAuth, async (req, res) => {
    try {
        if (req.userId !== req.body.userId) {
            res.status(403).json(false);
        }
        let post = await Post.findOne({_id: req.body.postId});
        if (!post.dislikes.includes(req.body.userId)) {
            post.dislikes.push(req.body.userId);
        }
        await post.save();
        res.status(200).json(post);
    } catch (e) {
        res.status(400)
            .json({
                error: 'Bad request'
            });
    }
});

router.post('/undislike', withAuth, async (req, res) => {
    try {
        if (req.userId !== req.body.userId) {
            res.status(403).json(false);
        }
        let post = await Post.findOne({_id: req.body.postId});
        post.dislikes = post.dislikes.filter(elem => {
            return !elem.equals(req.body.userId);
        });
        await post.save();
        res.status(200).json(post);
    } catch (e) {
        res.status(400)
            .json({
                error: 'Bad request'
            });
    }
});

router.post('/approve', withAuth, async (req, res) => {
    try {
        if (req.role !== 'admin') {
            res.status(403).json(false);
        }
        let result = await Post.updateOne({_id: req.body.postId}, {
            isApproved: true
        });
        res.status(200).json(true);
    } catch (e) {
        res.status(400)
            .json({
                error: 'Bad request'
            });
    }
});

router.delete('/', withAuth, async (req, res) => {
    try {
        let post = await Post.findOne({_id: req.body.postId});
        if (req.userId !== post.authorName || req.role !== 'admin') {
            res.status(403).json(false);
        }
        await S3Service.deleteImg(post.s3Key);
        await post.delete();
        res.status(200).json(true);
    } catch (e) {
        console.log(e);
        res.status(400)
            .json({
                error: 'Bad request'
            });
    }
});

module.exports = router;
