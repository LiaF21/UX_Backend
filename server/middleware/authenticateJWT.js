const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authenticateJWT = (req, res, next) => {
  // Exclude the login route from requiring a token
  if (req.path === '/auth/login') {
    return next();
  }

  const token = req.headers.authorization;

  if (token) {
    console.log('Received token:', token);

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res
          .status(403)
          .json({ message: 'Failed to authenticate token.' });
      }
      console.log('Decoded token:', decoded);
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: 'No token provided.' });
  }
};

module.exports = authenticateJWT;
