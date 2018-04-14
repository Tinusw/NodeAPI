const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../config");

function tokenForUser(user) {
  const timestamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Refactor this & add validation //

  if (!email) {
    return res.status(400).send({
      error: `email must be supplied`
    });
  }

  if (!password) {
    return res.status(400).send({
      error: `password must be supplied`
    });
  }

  //

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    return res.status(422).send({
      error: "Email is in use"
    });
  }

  const user = await new User({
    email: email,
    password: password
  }).save();

  if (user) {
    return res.status(201).json({
      token: tokenForUser(user)
    });
  }
};
