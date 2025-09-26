require("dotenv").config();
const express = require("express");
const app = express();
const db = require("../src/database/database");

//middleware
app.use(express.json());

//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

async function startServer() {
  await db.connect();
  app.listen(3000, () => {
    console.log("servidor en puerto 3000");
  });
}

startServer();

module.exports = app;
