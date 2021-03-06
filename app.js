const express = require('express');

const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const router = require('./routes');
const dbService = require('./services/db');
const S3Service = require('./services/s3');
const {
  dbName,
  dbUser,
  dbUserPassword,
  s3BucketName,
  s3AccessKey,
  s3SecretKey,
  port
} = require('./config');
const { allowedOrigins } = require('./constants');

S3Service.connect(s3AccessKey, s3SecretKey, s3BucketName);
// eslint-disable-next-line no-console
dbService.connect(dbUser, dbUserPassword, dbName).then(console.log);

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin(origin, callback) {
      if (origin && origin.search(allowedOrigins) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);
app.use('/', router);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server is started on ${port}`));
