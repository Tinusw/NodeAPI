const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { catchErrors } = require("../handlers/errorHandlers");
const passportService = require("../services/passport");
const passport = require("passport");

const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/', requireAuth, function(req, res) {
  res.send({ hi: 'there'})
});

router.post("/signup", catchErrors(authController.signup));

module.exports = router;
