const express = require("express");

const router = express.Router();
const messageController = require("../controllers/message.js");
const auth = require("../middleware/auth.js");

//save msg to DB
router.post("/message", auth.authenticate, messageController.saveTextToDB);

//fetch all msg from DB
router.get("/message", messageController.fetchMsg);

module.exports = router;
