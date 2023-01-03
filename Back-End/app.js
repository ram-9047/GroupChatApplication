const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyPaser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const sequelize = require("./util/database.js");

//Models Import
const User = require("./models/user.js");
const Message = require("./models/message.js");

//Routes Import
const userRoutes = require("./routes/user.js");
const messageRoutes = require("./routes/message.js");

app.use(bodyPaser.json());

app.use(cors());

//Database Relationship
User.hasMany(Message);
Message.belongsTo(User);

app.use(userRoutes);
app.use(messageRoutes);

const port = 3000;
sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    console.log("DB CONNECTED");
    app.listen(port, () => {
      console.log(`server is started at port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err, "error in database connection");
  });
