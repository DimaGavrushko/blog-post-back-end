const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { withAuth } = require('../middlewares');
const multerService = require('../services/multer');
const userService = require('../services/user');
const { secret } = require('../config');

router.get('/:id', async (req, res) => {
  try {
    res.status(200).json(await userService.getUserRecord({ _id: req.params.id }));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/updateProfile', withAuth, async (req, res) => {
  const params = req.body;

  try {
    if (req.userId !== req.body.userId && req.role !== 'admin') {
      res.status(403).json({ error: `You can't change ${params.name} of other user` });
    } else if (req.userId !== req.body.userId && params.name === 'email' && req.role === 'admin') {
      res.status(403).json({ error: `You can't change ${params.name} of other user` });
    } else {
      const updatedUser = await userService.updateUser(params);

      if (params.name === 'email') {
        const payload = {
          id: updatedUser._id,
          email: updatedUser.email,
          role: updatedUser.role
        };
        const token = jwt.sign(payload, secret, {
          expiresIn: '1h'
        });
        res
          .status(200)
          .cookie('token', token, { httpOnly: true })
          .json(updatedUser);
      } else {
        res.status(200).json(updatedUser);
      }
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/updateAvatar', withAuth, multerService.upload.single('img'), async (req, res) => {
  try {
    if (req.userId !== req.body.userId && req.role !== 'admin') {
      res.status(403).json({ error: `"You·can't·change·avatar·of·other·user"` });
    } else {
      res.status(200).json(await userService.updateAvatar(req.body.userId, req.file));
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/updatePassword', withAuth, async (req, res) => {
  try {
    if (req.userId !== req.body.userId) {
      res.status(403).json({ error: `"You·can't·change·avatar·of·other·user"` });
    } else {
      res.status(200).json(await userService.updatePassword(req.body));
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
