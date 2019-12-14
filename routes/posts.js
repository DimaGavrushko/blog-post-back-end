const router = require('express').Router();
const multer = require('multer');
const Post = require('../models/post');
const postService = require('../services/post');
const S3Service = require('../services/s3');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../uploads/tmp');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({storage: storage});

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

router.put('/createPost', upload.single('img'), async (req, res) => {
    try {
        let post = null;
        let filePath = null;
        if (req.body.id !== '') {
            if (req.file) {
                filePath = await S3Service.upload('posts', req.file.path, req.file.filename);
            }
            let params = {
                ...req.body,
                isApproved: false,
                createdAt: new Date()
            };

            if (filePath) {
                params.url = filePath;
            }
            await Post.updateOne({_id: req.body.id}, params);
            post = await Post.findOne({_id: req.body.id});
        } else {
            console.log(req.body, req.file);
            filePath = await S3Service.upload('posts', req.file.path, req.file.filename);
            post = new Post({
                url: filePath,
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

router.post('/like', async (req, res) => {
    try {
        let post = await Post.findOne({_id: req.body.postId});
        if (!post.likes.includes(req.body.userId)) {
            post.likes.push(req.body.userId);
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

router.post('/unlike', async (req, res) => {
    try {
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

router.post('/dislike', async (req, res) => {
    try {
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

router.post('/undislike', async (req, res) => {
    try {
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

router.post('/approve', async (req, res) => {
    try {
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

router.delete('/', async (req, res) => {
    try {
        let result = await Post.deleteOne({_id: req.body.postId});
        res.status(200).json(true);
    } catch (e) {
        res.status(400)
            .json({
                error: 'Bad request'
            });
    }
});

module.exports = router;
