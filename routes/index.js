const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { catchErrors } = require("../handlers/errorHandlers");
const passportService = require("../services/passport");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

router.get("/", requireAuth, function(req, res) {
  res.send({ message: "there" });
});

router.post("/signin", requireSignin, authController.signin);

router.post("/signup", catchErrors(authController.signup));

module.exports = router;
