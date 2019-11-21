const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const User = require("./models/user");
const config = require("./config");
const { withAuth } = require("./middlewares");

/*const whitelist = /^http:\/\/localhost:[0-9]{4}$|^https?:\/\/blogpost-bsu\.herokuapp\.com$/;
const corsOptions = {
    origin: function (origin, callback) {
        if (origin.search(whitelist) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};

app.use(cors(corsOptions));*/

app.use(bodyParser.json());
app.use(cookieParser());



const uri = `mongodb+srv://${config.dbUser}:${config.dbUserPassword}@cluster0-jnotm.mongodb.net/${config.dbName}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Successfully connected to database"));

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
                    const token = jwt.sign(payload, config.secret, {
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

app.post('/register', function(req, res) {
    const { email, password, role } = req.body;
    const user = new User({ email, password, role });
    user.save(function(err) {
        if (err) {
            res.status(500)
              .send(err.message);
        } else {
            res.status(200).send("Success");
        }
    });
});

app.get('/', (req, res) => {
    Post.find({}).then(result => res.json({ posts: result}));
});

app.get('/secret', withAuth, function(req, res) {
    res.send('The password is potato');
});

app.listen(config.port, () => {
    console.log("Server is started")
});
