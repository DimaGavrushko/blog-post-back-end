const express = require("express");
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;
const app = express();

/*mongoose.connect(`mongodb+srv://admin:admin@cluster0-jnotm.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Successfully connected to database"));*/

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-jnotm.mongodb.net/test?retryWrites=true&w=majority`;
MongoClient.connect(uri, function(err, client) {
    if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
    }
    console.log('Connected...');
    const collection = client.db(process.env.DB).collection("posts");
    console.log(collection);
    // perform actions on the collection object
    client.close();
});

app.get('/', (req, res) => {
    res.send("Hello world");
});
app.listen(process.env.PORT || 8001, () => {
    console.log("Server is started")
});
