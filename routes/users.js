const router = require('express').Router();
const Users = require('../models/user');

const _ = require('lodash');

router.get('/:id', (req, res) => {
  Users.findOne({ _id: req.params.id }).then(obj => {
    if (obj) {
      const user = _.omit(obj.toObject(), ["password", "__v"]);
      res.json(user)
    }

    res.status(404).json({
      error: 'Not found such user'
    })
  })
    .catch(err => {
      res.status(404).json({
        error: err.message
      })
    });
});

module.exports = router;
