const Message = require("../models/message.js");
const Group = require("../models/group.js");
const GroupUser = require("../models/groupUser.js");
const { Op } = require("sequelize");

exports.saveTextToDB = async (req, res, next) => {
  // console.log(req.body, "this is the incoming message");
  // console.log(req.user);
  try {
    let msg = req.body.message.trim();
    let groupId = req.body.groupId;
    if (msg.length > 0) {
      const groupUser = await GroupUser.findOne({
        where: {
          groupId: groupId,
          userId: req.user.id,
        },
      });
      if (!groupUser) {
        throw new Error("user not found in group");
      }
      console.log(msg, req.user, groupUser);
      await req.user.createMessage({
        message: msg,
        groupId: groupId,
        from: req.user.name,
      });
      res.status(200).json({ sucess: true, message: "saved" });
    } else {
      res.status(401).json({ sucess: false, message: "invalid msg" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ sucess: false, message: "error in saving msg" });
  }
};

exports.fetchMsg = async (req, res, next) => {
  try {
    const lastId = +req.query.lastId;
    const groupId = +req.query.groupId;
    // console.log(lastId);
    const msg = await Message.findAll({ where: { id: { [Op.gt]: lastId } } });
    console.log(msg, "this is msg");
    res.status(200).json({ sucess: true, message: msg });
  } catch (error) {
    res.status(500).json({ sucess: false, message: "error in fetching msg" });
  }
};
