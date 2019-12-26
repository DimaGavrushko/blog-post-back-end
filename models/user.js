const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {type: String, required: true},
    role: {
        type: String,
        enum: ['admin', 'journalist', 'user'],
        required: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [2, 'First name is too small'],
        maxlength: [20, 'First name is very big']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [2, 'Last name is too small'],
        maxlength: [20, 'Last name is very big']
    },
    url: {type: String},
    s3Key: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: [true, 'Description name is required'],
        minlength: [2, 'Description is too small'],
        maxlength: [255, 'Description is very big']
    }
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

UserSchema.post('updateOne', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        let errorValue = error.message.match(/"(.*?)"/g);
        next(new Error(`${errorValue[errorValue.length - 1]} is not unique`));
    } else {
        next();
    }
});

UserSchema.methods.isCorrectPassword = async function (password) {
    try {
        const same = await bcrypt.compare(password, this.password);
        if (!same) {
            throw new Error('Incorrect password');
        }

        return same;
    } catch (e) {
        throw e;
    }
};

UserSchema.methods.encodePassword = async function (password) {
    return await bcrypt.hash(password, salt);
};

UserSchema.path('email').validate(function (value) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
}, 'Email is not valid');

module.exports = mongoose.model('User', UserSchema);
