const router = require('express').Router();
const commentsService = require('../services/comments');
const { withAuth } = require('../middlewares');

router.get('/', withAuth, async (req, res) => {
  try {
    const { postId = null, authorId = null } = req.query;
    if (postId && authorId) {
      res
        .status(200)
        .json({ comments : await commentsService.getUserCommentsForPost(postId, authorId) });
    } else if (authorId) {
      res
        .status(200)
        .json({ comments : await commentsService.getUserComments(authorId) });
    } else if (postId) {
      res
        .status(200)
        .json({ comments : await commentsService.getPostComments(postId) });
    } else {
      res
        .status(200)
        .json({ comments : await commentsService.getComments({}) });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/create', async (req, res) => {
  try {
    if (req.role === 'guest') {
      res.status(403).json({ error: "Invalid operation." });
    } else {
      res.status(200).json(await commentsService.createComment(req.body));
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
