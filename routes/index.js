const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { catchErrors, authError } = require("../handlers/errorHandlers");
const passportService = require("../services/passport");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

router.get("/campaign/index", requireAuth, function(req, res) {
  res.send([
    { id: 1, name: "test1" },
    { id: 2, name: "test1" },
    { id: 3, name: "test1" }
  ]);
});

router.post("/signin", requireSignin, authController.signin);

router.post("/signup", catchErrors(authController.signup));

module.exports = router;
