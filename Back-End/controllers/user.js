const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jsw = require("jsonwebtoken");
const saltRound = 10;

exports.signup = (req, res, next) => {
  // console.log(req.body);
  let name = req.body.userName;
  let email = req.body.email;
  let password = req.body.password;
  let phoneNumber = req.body.number;
  console.log(phoneNumber, "this is phone number");
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
          console.log(x, "user");
          res.status(200).json({ message: "User Created" });
        } catch (error) {
          console.log(error);
          // if (error.errors[0]["message"] == "email must be unique") {
          // res.status(201).json/({ message: "Email Must be unique" });
          // }
        }
      }
    });
  });
};
