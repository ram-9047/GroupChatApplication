const Message = require("../models/message.js");
const { Op } = require("sequelize");

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

exports.fetchMsg = async (req, res, next) => {
  try {
    // console.log(req.query);
    const lastId = +req.query.lastId;
    // console.log(lastId);
    const msg = await Message.findAll({ where: { id: { [Op.gt]: lastId } } });
    res.status(200).json({ sucess: true, message: msg });
  } catch (error) {
    res.status(500).json({ sucess: false, message: "error in fetching msg" });
  }
};
