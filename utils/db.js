const mongoose = require('mongoose');
const logger = require('../utils/logger');
require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const URI = require('./dburlConfig');

const mongod = new MongoMemoryServer();

module.exports.connect = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongod.ensureInstance();
    const uri = mongod.getUri(); //process.env.NODE_ENV === 'test' ? mongod.getUri() : URI.url;
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 50,
      wtimeoutMS: 2500
    };
    await mongoose
      .connect(uri, options)
      .then(logger.info('Connected to database'))
      .catch((err) => logger.warn(`error: ${err}`));
  }
};

module.exports.truncate = async () => {
  if (mongoose.connection.readyState !== 0) {
    const { collections } = mongoose.connection;

    const promises = Object.keys(collections).map((collectio) =>
      mongoose.connection.collection(collectio).deleteMany({})
    );

    await Promise.all(promises);
  }
};

module.exports.disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongod.stop();
      logger.info('Disconnected to database');
    } catch (error) {
      logger.warn(`error disconnect: ${err}`);
    }
  }
};
module.exports.getConnectionString = () => {
  return mongoose.connection.getConnectionString();
};
