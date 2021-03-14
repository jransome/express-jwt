const { verifyJWT } = require('../lib/jwt');
const { User } = require('../models/User');

// used to protect sensitive routes
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.redirect('/login');

  try {
    const decodedToken = verifyJWT(token);
    console.log('Valid JWT!', decodedToken);
    next();
  } catch (error) {
    console.log('Invalid JWT!', token, error);
    return res.redirect('/login');
  }
}

// run on every GET to inject the user info into the view header
const checkUser = async (req, res, next) => {
  res.locals.user = null;
  const token = req.cookies.jwt;
  if (!token) return next();

  try {
    const decodedToken = verifyJWT(token);
    console.log('Valid JWT!', decodedToken);
    const user = await User.findById(decodedToken.id)

    // create local vars for injecting into views
    res.locals.user = user;
    next();

  } catch (error) {
    console.log('Invalid JWT!', token, error);
    // res.locals.user is already null;
    next();
  }

}

module.exports = { requireAuth, checkUser }
