const express = require("express");
const mongoose = require("mongoose");
const app = express();
const config = require("./config");

const uri = `mongodb+srv://${config.dbUser}:${config.dbUserPassword}@cluster0-jnotm.mongodb.net/${config.dbName}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to database");

    // Example of using mongoose
    /*const schema = new mongoose.Schema({name: String, id: Number});
    const Post = mongoose.model('Post', schema);
    Post.find({}).then( res => console.log(res))*/
});


app.get('/', (req, res) => {
    res.send("Hello world.");
});
app.listen(config.port, () => {
    console.log("Server is started")
});
