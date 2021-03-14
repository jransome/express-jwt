const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

class EmailNotFoundError extends Error {
  constructor(message = 'Email address not found') {
    super(message)
    Error.captureStackTrace(this, EmailNotFoundError)
  }
}

class IncorrectPasswordError extends Error {
  constructor(message = 'Incorrect password') {
    super(message)
    Error.captureStackTrace(this, IncorrectPasswordError)
  }
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email not supplied'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'invalid email address'],
  },
  password: {
    type: String,
    required: [true, 'password not supplied'],
    minlength: [6, 'minimum password length is 6 chars'],
  },
});

userSchema.pre('save', async function (next) {
  console.log('new user about to be created and saved');

  const salt = await bcrypt.genSalt(); // returns eg. $2b$10$q2/di4kcX3xvILQ0SxXUAO

  this.password = await bcrypt.hash(this.password, salt); // this = the instance of the user to be created
  // this.password = $2b$10$q2/di4kcX3xvILQ0SxXUAO.FxeGO6lSPHnxqxqitfXaVyFo4xDC.O
  // ie. this.password = SALT.HASH

  next()
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new EmailNotFoundError()

  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched) throw new IncorrectPasswordError()
  return user
}

const User = mongoose.model('user', userSchema);

module.exports = { User, EmailNotFoundError, IncorrectPasswordError };