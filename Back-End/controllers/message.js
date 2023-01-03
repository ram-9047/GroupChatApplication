const Message = require("../models/message.js");

exports.saveTextToDB = async (req, res, next) => {
  // console.log(req.body, "this is the incoming message");
  // console.log(req.user);
  try {
    let msg = req.body.message.trim();

    if (msg.length > 0) {
      await req.user.createMessage({
        message: msg,
      });
      res.status(200).json({ sucess: true, message: "saved" });
    } else {
      res.status(401).json({ sucess: false, message: "invalid msg" });
    }
  } catch (error) {
    res.status(500).json({ sucess: false, message: "error in saving msg" });
  }
};