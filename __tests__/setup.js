const db = require('../utils/db');

module.exports = async () => {
  await db.connect();
};
