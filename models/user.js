const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {type: String, required: true},
    role: {
        type: String,
        enum: ['admin', 'journalist', 'user'],
        required: true
    },
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    url: {type: String},
    s3Key: {
        type: String,
        required: true
    },
    description: {type: String, required: true}
});

UserSchema.pre('save', function (next) {
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified('password')) {
        // Saving reference to this because of changing scopes
        const document = this;
        bcrypt.hash(document.password, salt,
            function (err, hashedPassword) {
                if (err) {
                    next(err);
                } else {
                    document.password = hashedPassword;
                    next();
                }
            });
    } else {
        next();
    }
});

UserSchema.methods.isCorrectPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
};

UserSchema.methods.encodePassword = async function (password) {
    return await bcrypt.hash(password, salt);
};

module.exports = mongoose.model('User', UserSchema);