const jwt = require('jsonwebtoken');

const SUPER_SECRET = 'I LOVE SEMICOLONS';
const MAX_TOKEN_AGE = 3 * 24 * 60 * 60; // in seconds

const createJWT = (id) => jwt.sign(
  { id },
  SUPER_SECRET,
  { expiresIn: MAX_TOKEN_AGE },
);

const verifyJWT = (token) => jwt.verify(token, SUPER_SECRET);

module.exports = {
  createJWT,
  verifyJWT,
  MAX_TOKEN_AGE,
}
