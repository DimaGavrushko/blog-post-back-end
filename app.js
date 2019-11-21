const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const router = require('./routes');
const DBService = require("./services/db");
const { dbName, dbUser, dbUserPassword, port } = require("./config");
const { allowedOrigins } = require("./constants");

const dbService = new DBService(dbUser, dbUserPassword, dbName);
dbService.connect().then(console.log);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        if (origin && origin.search(allowedOrigins) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}));

app.use('/', router);

app.listen(port, () => console.log("Server is started on " + port));
