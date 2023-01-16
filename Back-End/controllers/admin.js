const User = require("../models/user.js");
const Group = require("../models/group.js");
const GroupUser = require("../models/groupUser.js");
const { Op } = require("sequelize");

exports.addMember = async (req, res, next) => {
  try {
    const email = req.body.email;
    const groupId = req.body.groupId;
    // console.log(groupId);
    let user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(204).json({ message: "email is not registered" });
    }
    // console.log(user);
    let groupName = await Group.findOne({ where: { id: groupId } });
    // console.log(groupName, "this is group");
    await groupName.addUser(user, { through: { isAdmin: false } });
    res.status(200).json({ message: "added new user to group" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    let delUserId = req.body.userId;
    let groupId = req.body.groupID;

    let user = await User.findByPk(delUserId);

    if (!user) {
      res.status(403).json({ message: "User Not Found" });
    }
    const verifiedAdmin = await GroupUser.findOne({
      where: {
        [Op.and]: [
          { userId: req.user.id },
          { isAdmin: true },
          { groupId: groupId },
        ],
      },
    });
    if (!verifiedAdmin) {
      res.status(403).json({ message: "you dont have permissions" });
    } else {
      let memberToBeRemoved = await GroupUser.findOne({
        where: { [Op.and]: [{ userId: delUserId }, { groupId: groupId }] },
      });
      await memberToBeRemoved.destroy();
      res.status(200).json({ message: "user removed from group" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.makeAdmin = async (req, res, next) => {
  //   console.log(req.body);
  try {
    let groupId = req.body.groupID;
    let userIdToBeAdmin = req.body.userId;
    let user = await User.findByPk(userIdToBeAdmin);

    if (!user) {
      res.status(403).json({ message: "User Not Found" });
    }

    const verifiedAdmin = await GroupUser.findOne({
      where: {
        [Op.and]: [
          { userId: req.user.id },
          { isAdmin: true },
          { groupId: groupId },
        ],
      },
    });
    if (!verifiedAdmin) {
      return res.status(403).json({ message: "you dont have permissions" });
    }
    let memberToBeUpdated = await GroupUser.findOne({
      where: {
        [Op.and]: [{ userId: userIdToBeAdmin }, { groupId: groupId }],
      },
    });
    await memberToBeUpdated.update({ isAdmin: true });
    res.status(200).json({ message: "user set as admin" });
  } catch (error) {
    console.log(error);
  }
};

exports.removeAdmin = async (req, res, next) => {
  //   console.log(req.body);
  try {
    let userToBeRemoveAsAdmin = req.body.userId;
    let groupId = req.body.groupID;

    let user = await User.findByPk(userToBeRemoveAsAdmin);
    if (!user) {
      res.status(403).json({ message: "User Not Found" });
    }
    const verifiedAdmin = await GroupUser.findOne({
      where: {
        [Op.and]: [
          { userId: req.user.id },
          { isAdmin: true },
          { groupId: groupId },
        ],
      },
    });
    if (!verifiedAdmin) {
      return res.status(403).json({ message: "you dont have permissions" });
    }
    let memberToBeUpdated = await GroupUser.findOne({
      where: {
        [Op.and]: [{ userId: userToBeRemoveAsAdmin }, { groupId: groupId }],
      },
    });
    await memberToBeUpdated.update({ isAdmin: false });
    res.status(200).json({ message: "User removed" });
  } catch (error) {
    console.log(error);
  }
};
