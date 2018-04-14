const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// ensure mongoose uses native promises
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt-nodejs");
const validator = require("validator");
const mongodbErrorHandler = require("mongoose-mongodb-errors");

//
// Schema Definition
//

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: "Please use a valid email address"
  },
  password: {
    type: String,
    required: "Please supply a password"
  }
});

// Pre-save hook to encrypt password with bcrypt
userSchema.pre("save", function(next) {
  const user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("User", userSchema);
