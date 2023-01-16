const User = require("../models/user");
const Group = require("../models/group");
const GroupUser = require("../models/groupUser.js");
const { Op } = require("sequelize");

exports.createGroup = async (req, res, next) => {
  try {
    const groupName = req.body.groupName;
    // console.log(groupName);
    if (groupName.length > 0 && typeof groupName === "string") {
      let createNewGroup = await req.user.createGroup(
        {
          name: groupName,
        },
        { through: { isAdmin: true } }
      );
      console.log(createNewGroup);
      res
        .status(200)
        .json({ groupId: createNewGroup.id, message: "group created" });
    } else {
      throw new Error("invalid group name");
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

exports.getAllGroups = async (req, res, next) => {
  // console.log("inside curr route");
  try {
    const groups = await req.user.getGroups();
    // console.log(groups);
    // console.log(req.user.__proto__);
    if (groups.length === 0) {
      // console.log(groups);
      return res.status(201).json({ message: "no groups currently" });
    }
    res.status(200).json({ groups: groups });
  } catch (error) {
    console.log(error, "error in line 56");
    res.status(500).json({ message: "something went wrong" });
  }
};

exports.getAllMembers = async (req, res, next) => {
  let groupId = +req.query.groupId;
  let members = await GroupUser.findAll({ where: { groupId } });
  // console.log(members);
  let membersToSend = [];
  for (let i = 0; i < members.length; i++) {
    const user = await User.findByPk(members[i].userId);

    if (user) {
      // let newPart = {};
      const userToSend = {
        ...user,
        isAdmin: members[i].isAdmin,
      };
      membersToSend.push(userToSend);
    }
  }
  res.status(200).json({ members: membersToSend });
};

exports.deleteGroup = async (req, res, next) => {
  // console.log(req.body.id);
  let id = req.body.id;
  try {
    let group = await Group.findByPk(id);
    let groupUsers = await GroupUser.findAll({ where: { groupId: id } });

    // console.log(req.user.id);
    groupUsers.forEach(async (user) => {
      if (
        user.dataValues.userId == req.user.id &&
        user.dataValues.isAdmin == true
      ) {
        await group.destroy();
        res.status(200).json({ success: true, message: "Group delete" });
      }
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "you are not admin" });
  }
};
