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
const Group = require("./models/group.js");
const GroupUser = require("./models/groupUser.js");

//Routes Import
const userRoutes = require("./routes/user.js");
const messageRoutes = require("./routes/message.js");
const chatRoutes = require("./routes/chat.js");
const adminRoutes = require("./routes/admin.js");

app.use(bodyPaser.json());

app.use(cors());

//Database Relationship
User.hasMany(Message);
Message.belongsTo(User);
Group.belongsToMany(User, { through: GroupUser });
User.belongsToMany(Group, { through: GroupUser });
Group.hasMany(Message);
Message.belongsTo(Group);

app.use(userRoutes);
app.use(messageRoutes);
app.use(chatRoutes);
app.use(adminRoutes);

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
