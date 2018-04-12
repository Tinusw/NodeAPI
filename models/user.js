const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// ensure mongoose uses native promises
mongoose.Promise = global.Promise;
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
  }
})

// connect mongodb Error Handler
userSchema.plugin(mongodbErrorHandler);


module.exports = mongoose.model("User", userSchema);
