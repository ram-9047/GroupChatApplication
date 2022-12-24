const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyPaser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const sequelize = require("./util/database.js");


//Routes Import
const userRoutes = require("./routes/user.js");

app.use(bodyPaser.json());
app.use(cors());

app.use(userRoutes);

const port = 3000;
sequelize
  .sync({ force: true })
  // .sync()
  .then(() => {
    console.log("DB CONNECTED");
    app.listen(port, () => {
      console.log(`server is started at port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err, "error in database connection");
  });
