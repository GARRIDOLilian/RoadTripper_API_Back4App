require('dotenv').config();

const db = require('../utils/db');
const app = require('../server.js');
// console.log(app);

beforeAll(() => {
  return db.connect();
});

beforeEach(() => {
  return db.truncate();
});

// afterEach(async () => {
//   await app.close();
// });

afterAll(() => {
  return db.disconnect();
});
