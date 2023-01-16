const express = require("express");

const router = express.Router();
const chatController = require("../controllers/chat.js");
const auth = require("../middleware/auth.js");

router.post("/createGroup", auth.authenticate, chatController.createGroup);

router.get("/getAllGroup", auth.authenticate, chatController.getAllGroups);


router.get("/getAllMembers", auth.authenticate, chatController.getAllMembers);

router.post("/deleteGroup", auth.authenticate, chatController.deleteGroup);

module.exports = router;
