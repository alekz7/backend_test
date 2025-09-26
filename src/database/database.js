const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let mongodb;

function connect(callback) {
  client.connect((err) => {
    // perform actions on the collection object
    // client.close();
    mongodb = client;
    callback();
  });
}
function get() {
  return mongodb;
}
function close() {
  mongodb.close();
}

module.exports = { connect, get, close };
