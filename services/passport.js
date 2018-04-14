const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// This is the options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

// Create Strategy with options
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
    // error found
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      // user not found
      done(null, false);
    }
  });
});

// Tell Passport to use strategy
passport.use(jwtLogin)
