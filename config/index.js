const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  db: process.env.DB_NAME || 'blog-post-develop',
  dbUser: process.env.DB_USER || 'test',
  dbUserPassword: process.env.DB_USER_PASSWORD || 'test',
};
