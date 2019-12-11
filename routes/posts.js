const router = require('express').Router();
const multer  = require('multer');
const Post = require('../models/post');
const postService = require('../services/post');

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
    console.log(req.body, req.file);
    res.sendStatus(200);
});

module.exports = router;
