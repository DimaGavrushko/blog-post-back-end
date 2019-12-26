const User = require("../models/user");
const Post = require('../models/post');
const S3Service = require('../services/s3');

async function getUserRecord(params) {
    try {
        const user = await User.findOne(params);
        if (!user) {
            throw new Error('Not found such user');
        }

        return user;
    } catch (e) {
        throw e;
    }
}

async function updateUser(params) {
    try {
        await User.updateOne({_id: params.userId}, {
            [params.name]: params.value
        }, { runValidators: true });

        if (params.name === 'firstName') {
            await Post.updateMany({authorId: params.userId}, {
                authorName: params.value
            });
        }

        return await getUserRecord({_id: params.userId});
    } catch (e) {
        throw (e.errors && e.errors[params.name]) || e;
    }
}

async function updateAvatar(userId, file) {
    try {
        let user = await User.findOne({_id: userId});
        if (user.url) {
            await S3Service.deleteImg(user.s3Key);
        }
        let s3Params = await S3Service.upload('avatars', file.path, file.filename);
        await User.updateOne({_id: userId}, s3Params);

        return Object.assign(user, s3Params)
    } catch (e) {
        throw e;
    }
}

async function updatePassword({ userId, currentPassword, newPassword }) {
    try {
        let user = await getUserRecord({_id: userId});
        await user.isCorrectPassword(currentPassword);
        const saltPassword = await user.encodePassword(newPassword);
        user.password = saltPassword;
        await User.updateOne({_id: userId}, {password: saltPassword});
        return user;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    getUserRecord,
    updateUser,
    updateAvatar,
    updatePassword
};
