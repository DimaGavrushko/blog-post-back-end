const router = require('express').Router();
const postService = require('../services/post');
const { withAuth } = require('../middlewares');
const multerService = require('../services/multer');

router.get('/approved', async (req, res) => {
  try {
    res.status(200).json(await postService.getApprovedPosts());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/notApproved', withAuth, async (req, res) => {
  try {
    res.status(200).json(await postService.getNotApprovedPosts());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    res.status(200).json(await postService.getAllCategories());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/createPost', withAuth, multerService.upload.single('img'), async (req, res) => {
  try {
    res.status(200).json(await postService.createPost(req.body, req.file));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/like', withAuth, async (req, res) => {
  try {
    if (req.userId !== req.body.userId) {
      res.status(403).json(false);
    } else {
      res.status(200).json(await postService.like(req.body));
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/unlike', withAuth, async (req, res) => {
  try {
    if (req.userId !== req.body.userId) {
      res.status(403).json(false);
    } else {
      res.status(200).json(await postService.unlike(req.body));
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/dislike', withAuth, async (req, res) => {
  try {
    if (req.userId !== req.body.userId) {
      res.status(403).json(false);
    } else {
      res.status(200).json(await postService.dislike(req.body));
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/undislike', withAuth, async (req, res) => {
  try {
    if (req.userId !== req.body.userId) {
      res.status(403).json(false);
    } else {
      res.status(200).json(await postService.undislike(req.body));
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/approve', withAuth, async (req, res) => {
  try {
    if (req.role !== 'admin') {
      res.status(403).json(false);
    } else {
      await postService.approvePost(req.body.postId);
      res.status(200).json(await postService.getPost(req.body.postId));
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/', withAuth, async (req, res) => {
  try {
    const post = await postService.getPost(req.body.postId);
    if (req.userId !== post.authorId.toString() && req.role !== 'admin') {
      res.status(403).json(false);
    } else {
      await postService.deletePost(req.body.postId);
      res.status(200).json(true);
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
