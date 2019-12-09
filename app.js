const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const router = require('./routes');
const dbService = require("./services/db");
const S3Service = require("./services/s3");
const { dbName, dbUser, dbUserPassword, s3BucketName, s3AccessKey, s3SecretKey, port } = require("./config");
const { allowedOrigins } = require("./constants");

const s3Service = new S3Service(s3AccessKey, s3SecretKey, s3BucketName);

s3Service.connect();
dbService.connect(dbUser, dbUserPassword, dbName).then(console.log);

app.use(bodyParser.json());
app.use(cookieParser());
// app.use(cors({
//     origin: function (origin, callback) {
//         if (origin && origin.search(allowedOrigins) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     },
//     credentials: true
// }));
app.use('/', router);

app.listen(port, () => console.log("Server is started on " + port));
