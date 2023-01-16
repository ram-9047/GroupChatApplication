const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const authenticate = (req, res, next) => {
  try {
    // console.log(req.header);
    const token = req.header("authorization");
    console.log(token, "thhi is tokn");
    const userid = Number(jwt.verify(token, process.env.TOKEN_SECRET));
    // console.log(userid, "user id in auth");
    User.findByPk(userid)
      .then((user) => {
        // console.log(JSON.stringify(user));
        // console.log(user);
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
    res.status(401).json({ success: false, message: "Something went wrong." });
  }
};

module.exports = {
  authenticate,
};
