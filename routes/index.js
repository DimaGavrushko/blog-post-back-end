const router = require('express').Router();
const auth = require('./auth');
const posts = require('./posts');
const users = require('./users');
const comments = require('./comments');


router.use('/auth', auth);
router.use('/posts', posts);
router.use('/users', users);
router.use('/comments', comments);

module.exports = router;
