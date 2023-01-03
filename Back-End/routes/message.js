const express = require("express");

const router = express.Router();
const messageController = require("../controllers/message.js");
const auth = require("../middleware/auth.js");

//save msg to DB
router.post("/message", auth.authenticate, messageController.saveTextToDB);

module.exports = router;
