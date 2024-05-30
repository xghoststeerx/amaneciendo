const jwt = require('jsonwebtoken');
const keys = require('./keys');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No se proporcionó un token' });
  }

  jwt.verify(token.replace('JWT ', ''), keys.secretOrKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;