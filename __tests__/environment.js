const NodeEnvironment = require('jest-environment-node');

const db = require('../utils/db');

class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    this.global.__DB_URL__ = await db.connect();
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = CustomEnvironment;
