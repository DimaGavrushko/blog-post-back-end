const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const config = require("./config");

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

app.use(cors(corsOptions));

const schema = new mongoose.Schema({name: String, id: Number});
const Post = mongoose.model('Post', schema);

const uri = `mongodb+srv://${config.dbUser}:${config.dbUserPassword}@cluster0-jnotm.mongodb.net/${config.dbName}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Successfully connected to database"));


app.get('/', (req, res) => {
    Post.find({}).then(result => res.json({ posts: result}));
});

app.listen(config.port, () => {
    console.log("Server is started")
});
