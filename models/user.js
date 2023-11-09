const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_ROUND = 10;
const hashPassword = (password) => bcrypt.hashSync(password, SALT_ROUND);
const enums = {
  role: ['ADMIN', 'USER']
};

const User = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    set: hashPassword,
    select: false,
    scan: false,
    default: 'EpicRoadTrip2022$'
  },
  role: { type: String, default: 'USER' }
});

module.exports = mongoose.model('User', User);
