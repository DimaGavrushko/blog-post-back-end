const router = require('express').Router();
const Users = require('../models/user');
const {withAuth} = require("../middlewares");

const _ = require('lodash');

router.get('/:id', (req, res) => {
  Users.findOne({ _id: req.params.id }).then(obj => {
    if (obj) {
      const user = _.omit(obj.toObject(), ["password", "__v"]);
      res.json(user)
    } else {
      res.status(404).json({
        error: 'Not found such user'
      })
    }
  })
    .catch(err => {
      res.status(404).json({
        error: err.message
      })
    });
});

router.post('/updateProfile', withAuth, async (req, res) => {
  try {
    let params = req.body;
    let newParams = {
      [params.name]: params.value
    };
    let result = await Users.updateOne({_id: params.userId}, {
      [params.name]: params.value
    });
    res.status(200).json(true);
  } catch (e) {
    console.log(e);
    res.status(400)
        .json({
          error: 'Bad request'
        });
  }
});

module.exports = router;
