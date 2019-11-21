const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  dbName: process.env.DB_NAME || 'blog-post-develop',
  dbUser: process.env.DB_USER || 'test',
  dbUserPassword: process.env.DB_USER_PASSWORD || 'test',
  port: process.env.PORT || 8001,
  secret: process.env.JWT_SECRET || 'very_secret'
};
