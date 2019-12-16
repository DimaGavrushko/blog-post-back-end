const router = require('express').Router();
const Users = require('../models/user');
const {withAuth} = require("../middlewares");
const multerService = require('../services/multer');
const S3Service = require('../services/s3');
const Post = require('../models/post');

const _ = require('lodash');

router.get('/:id', (req, res) => {
    Users.findOne({_id: req.params.id}).then(obj => {
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
        if (req.userId !== req.body.userId && req.role !== 'admin') {
            res.status(403).json(false);
        } else {
            let params = req.body;

            if (req.userId !== req.body.userId && params.name === 'email' && req.role === 'admin') {
                res.status(403).json(false);
            } else {
                let result = await Users.updateOne({_id: params.userId}, {
                    [params.name]: params.value
                });

                if (params.name === 'firstName') {
                    await Post.updateMany({authorId: params.userId}, {
                        authorName: params.value
                    });
                }

                const updatedUser = await Users.findOne({_id: params.userId});
                res.status(200).json(updatedUser);
            }
        }
    } catch (e) {
        console.log(e);
        res.status(400)
            .json({
                error: 'Bad request'
            });
    }
});

router.post('/updateAvatar', withAuth, multerService.upload.single('img'), async (req, res) => {
    try {
        if (req.userId !== req.body.userId && req.role !== 'admin') {
            res.status(403).json(false);
        } else {
            let user = await Users.findOne({_id: req.body.userId});
            if (user.url) {
                await S3Service.deleteImg(user.s3Key);
            }

            let s3Params = await S3Service.upload('avatars', req.file.path, req.file.filename);
            await Users.updateOne({_id: req.body.userId}, s3Params);

            res.status(200).json(Object.assign(user, s3Params));
        }
    } catch (e) {
        console.log(e);
        res.status(400)
            .json({
                error: 'Bad request'
            });
    }
});

router.post('/updatePassword', withAuth, async (req, res) => {
    let {userId, currentPassword, newPassword} = req.body;
    try {
        if (req.userId !== userId) {
            res.status(403).json(false);
        } else {
            let user = await Users.findOne({_id: userId});
            user.isCorrectPassword(currentPassword, async function (err, same) {
                if (err) {
                    res.status(500)
                        .json({
                            error: 'Internal error please try again'
                        });
                } else if (!same) {
                    res.status(400)
                        .json({
                            error: 'Incorrect current password'
                        });
                } else {
                    const saltPassword = await user.encodePassword(newPassword);
                    user.password = saltPassword;
                    await Users.updateOne({_id: userId}, {password: saltPassword});
                    res.status(200).json(user);
                }
            });
        }
    } catch (e) {
        console.log(e);
        res.status(400)
            .json({
                error: 'Bad request'
            });
    }
});

module.exports = router;
