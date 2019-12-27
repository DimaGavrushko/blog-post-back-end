const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const userService = require('../services/user');
const { withAuth } = require('../middlewares');
const { secret } = require('../config');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.getUserRecord({ email });
    if (user) {
      await user.isCorrectPassword(password);
      const payload = { id: user._id, email, role: user.role };
      const token = jwt.sign(payload, secret, {
        expiresIn: '1h'
      });
      res
        .status(200)
        .cookie('token', token, { httpOnly: true })
        .json(user);
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', (req, res) => {
  const { email, password, role } = req.body;
  const user = new User({ email, password, role });

  // TODO: create user service
  user.save(err => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send('Success');
    }
  });
});

router.get('/checkToken', withAuth, (req, res) => {
  res.sendStatus(200);
});

router.get('/logout', withAuth, (req, res) => {
  res.cookie('token', null, { httpOnly: true }).sendStatus(200);
});

router.get('/tryAuth', withAuth, async (req, res) => {
  try {
    const user = await userService.getUserRecord({ email: req.email });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
