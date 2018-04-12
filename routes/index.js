const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { catchErrors } = require("../handlers/errorHandlers");

router.post("/signup", catchErrors(authController.signup));

module.exports = router;
