const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Refactor this & add validation //

  if (!email) {
    return res.status(400).send({
      error: `email must be supplied`
    })
  }

  if (!password) {
    return res.status(400).send({
      error: `password must be supplied`
    })
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
      success: true
    });
  }
};
