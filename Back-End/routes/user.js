const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.js");

//  sign-up POST Req
router.post("/signup", userController.signup);

// sign in post
router.post("/signin", userController.signin);

module.exports = router;
