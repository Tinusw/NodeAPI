const express = require("express");
const router = express.Router();
const { catchErrors } = require("../handlers/errorHandlers");

router.get('/', function(req, res, next){
  res.send(['yo', 'yp', 'yo'])
})

module.exports = router;
