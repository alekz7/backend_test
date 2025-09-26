const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
});

after(async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
});
