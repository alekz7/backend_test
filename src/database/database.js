const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let mongodb;

async function connect() {
  await client.connect();
  mongodb = client;
}

function get() {
  return mongodb;
}

function close() {
  mongodb.close();
}

module.exports = { connect, get, close };