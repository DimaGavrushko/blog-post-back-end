const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const config = require("./config");

const secret = 'mysecretsshhh';
const whitelist = /^http:\/\/localhost:[0-9]{4}$|^https?:\/\/blogpost-bsu\.herokuapp\.com$/;
const corsOptions = {
    origin: function (origin, callback) {
        if (origin.search(whitelist) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};

app.use(cookieParser());
app.use(cors(corsOptions));

const schema = new mongoose.Schema({name: String, id: Number});
const Post = mongoose.model('Post', schema);

const uri = `mongodb+srv://${config.dbUser}:${config.dbUserPassword}@cluster0-jnotm.mongodb.net/${config.dbName}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Successfully connected to database"));

const withAuth = function(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.email = decoded.email;
                next();
            }
        });
    }
};

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
});

UserSchema.pre('save', function(next) {
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified('password')) {
        // Saving reference to this because of changing scopes
        const document = this;
        bcrypt.hash(document.password, saltRounds,
          function(err, hashedPassword) {
              if (err) {
                  next(err);
              }
              else {
                  document.password = hashedPassword;
                  next();
              }
          });
    } else {
        next();
    }
});

UserSchema.methods.isCorrectPassword = function(password, callback){
    bcrypt.compare(password, this.password, function(err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
};

app.post('/auth', function(req, res) {
    const { email, password } = req.body;
    User.findOne({ email }, function(err, user) {
        if (err) {
            console.error(err);
            res.status(500)
              .json({
                  error: 'Internal error please try again'
              });
        } else if (!user) {
            res.status(401)
              .json({
                  error: 'Incorrect email or password'
              });
        } else {
            user.isCorrectPassword(password, function(err, same) {
                if (err) {
                    res.status(500)
                      .json({
                          error: 'Internal error please try again'
                      });
                } else if (!same) {
                    res.status(401)
                      .json({
                          error: 'Incorrect email or password'
                      });
                } else {
                    // Issue token
                    const payload = { user };
                    const token = jwt.sign(payload, secret, {
                        expiresIn: '1h'
                    });
                    res.cookie('token', token, { httpOnly: true })
                      .status(200)
                      .json(user)
                }
            });
        }
    });
});

app.get('/checkToken', withAuth, function(req, res) {
    res.sendStatus(200);
});

/*app.post('/api/register', function(req, res) {
    const { email, password } = req.body;
    const user = new User({ email, password });
    user.save(function(err) {
        if (err) {
            res.status(500)
              .send("Error registering new user please try again.");
        } else {
            res.status(200).send("Welcome to the club!");
        }
    });
});*/

app.get('/', (req, res) => {
    Post.find({}).then(result => res.json({ posts: result}));
});

app.get('/api/secret', function(req, res) {
    res.send('The password is potato');
});

app.listen(config.port, () => {
    console.log("Server is started")
});
