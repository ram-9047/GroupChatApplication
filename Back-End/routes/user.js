const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.js");

//  sign-up POST Req
router.post("/signup", userController.signup);

module.exports = router;
