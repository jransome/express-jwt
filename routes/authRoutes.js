const express = require('express');
const { getSignup, postSignup, getLogin, postLogin, getLogout } = require('../controllers/authController');

const router = express.Router();

router.get('/signup', getSignup);
router.post('/signup', postSignup);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', getLogout);

module.exports = router;
