const { createJWT, MAX_TOKEN_AGE } = require('../lib/jwt');
const { User, EmailNotFoundError, IncorrectPasswordError } = require('../models/User');

const getSignup = (req, res) => {
  console.log('handling request for GET /signup');
  res.render('signup')
}

const postSignup = async (req, res) => {
  console.log('handling request for POST /signup:', req.body);
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createJWT(user._id); // create token for sending in ze coookie

    res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_TOKEN_AGE * 1000 }) // httpOnly makes cookie inaccessible by browser js
    return res.status(201).json({ user: user._id })

  } catch (error) {
    let feedback = {}
    if (error.code === 11000) {
      feedback.email = 'Email already registered';
    }

    feedback = Object.entries(error.errors).reduce((acc, [key, errObj]) => {
      acc[key] = errObj.properties.message
      return acc
    }, {})
    console.log('Error on User creation:', feedback);
    return res.status(400).json({ errors: feedback });
  }
}

const getLogin = (req, res) => {
  console.log('handling request for GET /login');
  res.render('login')
}

const postLogin = async (req, res) => {
  console.log('handling request for POST /login');
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password)
    const token = createJWT(user._id); // create token for sending in ze coookie
    res.cookie('jwt', token, { httpOnly: true, maxAge: MAX_TOKEN_AGE * 1000 }) // httpOnly makes cookie inaccessible by browser js

    return res.status(200).json({ user: user._id })

  } catch (error) {
    console.log('Error on User login:', error);
    return res.status(400).json({
      errors: {
        ...(error instanceof EmailNotFoundError && { email: error.message }),
        ...(error instanceof IncorrectPasswordError && { password: error.message }),
      }
    });
  }
}

const getLogout = (req, res) => {
  // replace jwt cookie and redirect
  res.cookie('jwt', '', { httpOnly: true, maxAge: 1 });
  res.redirect('/');
}

module.exports = {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  getLogout,
}
