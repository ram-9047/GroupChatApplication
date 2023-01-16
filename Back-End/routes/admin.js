const express = require("express");

const router = express.Router();
const adminController = require("../controllers/admin.js");
const auth = require("../middleware/auth.js");

router.post("/addMember", auth.authenticate, adminController.addMember);

router.post("/removeMember", auth.authenticate, adminController.removeMember);

router.post("/removeAdmin", auth.authenticate, adminController.removeAdmin);

router.post("/makeAdmin", auth.authenticate, adminController.makeAdmin);

module.exports = router;
