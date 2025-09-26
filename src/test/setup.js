const { MongoMemoryServer } = require("mongodb-memory-server");
const db = require("../database/database");
require("dotenv").config(); // safe: allows overriding in CI if needed

let mongod;

module.exports.mochaHooks = {
  async beforeAll() {
    // start in-memory mongod
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // expose URI and DB name for the app/db module
    process.env.MONGODB_URI = uri;
    process.env.MONGODB_DBNAME = "test";

    // ensure DB module connects (connect() is idempotent)
    await db.connect();
  },

  async afterAll() {
    // close DB connection and stop in-memory server
    await db.close();
    if (mongod) await mongod.stop();
  },
};
