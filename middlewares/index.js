const jwt = require('jsonwebtoken');
const { secret } = require('../config');

const withAuth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.email = decoded.email;
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
      }
    });
  }
};

module.exports = {
  withAuth
};
