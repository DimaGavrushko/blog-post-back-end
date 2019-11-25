const router = require('express').Router();
const auth = require('./auth');
const posts = require('./posts');
const users = require('./users');

router.use('/auth', auth);
router.use('/posts', posts);
router.use('/users', users);


module.exports = router;
