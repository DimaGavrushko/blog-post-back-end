const router = require('express').Router();
const auth = require('./auth');
const posts = require('./posts');
const users = require('./users');
const {withAuth} = require("../middlewares");

router.use('/auth', auth);
router.use('/posts', withAuth, posts);
router.use('/users', users);


module.exports = router;
