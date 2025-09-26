const express = require("express");
const app = express();
const db = require("../src/database/database");
require("dotenv").config();

//middleware
app.use(express.json());

//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
db.connect(() => {
  //app
  app.listen(3000, () => {
    console.log("servidor en puerto 3000");
  });
});

module.exports = app;
