const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jsw = require("jsonwebtoken");
const saltRound = 10;

exports.signup = (req, res, next) => {
  let name = req.body.userName;
  let email = req.body.email;
  let password = req.body.password;
  let phoneNumber = req.body.number;
  // console.log(phoneNumber, "this is phone number");
  bcrypt.genSalt(saltRound, (err, newSalt) => {
    bcrypt.hash(password, newSalt, async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        try {
          let x = await User.create({
            name,
            email,
            password: result,
            phone: phoneNumber,
          });
          res.status(200).json({ message: "User Created" });
        } catch (error) {
          if (error.errors[0]["message"] == "email must be unique") {
            res.status(201).json / { message: "Email Must be unique" };
          }
        }
      }
    });
  });
};

function generateToken(id) {
  return jsw.sign(id, process.env.TOKEN_SECRET);
}

exports.signin = (req, res, next) => {
  console.log(req.body);
  let email = req.body.email;
  let password = req.body.password;

  User.findAll({ where: { email } })
    .then((user) => {
      // console.log(user, "this is the user found in the database");

      if (user.length > 0) {
        bcrypt.compare(password, user[0]["password"], (err, result) => {
          if (err) {
            console.log(err);
            res
              .status(404)
              .json({ success: false, message: "Password is Incorrect" });
          }
          if (result) {
            // console.log(result, "result");
            // console.log(user);
            let userID = user[0].dataValues.id;
            let token = generateToken(userID);
            // console.log(token);
            res
              .status(200)
              .json({ user, token, success: true, message: "Logged In" });
          } else {
            res
              .status(401)
              .json({ success: false, message: "Password in not correct" });
          }
        });
      } else {
        res.status(404).json({ message: "User Not Found" });
      }
    })
    .catch((error) => {
      // console.log(error, "error in login controller");
      res.status(404).json({ message: "User not found" });
    });
};
