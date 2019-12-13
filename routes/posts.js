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
        let filePath = '';
        if (req.body.id !== '') {
            filePath = await S3Service.upload('posts', req.file.path, req.file.filename);
            await Post.updateOne({_id: req.body.id}, {
                ...req.body,
                isApproved: false,
                url: filePath,
                createdAt: new Date()
            });
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

module.exports = router;
