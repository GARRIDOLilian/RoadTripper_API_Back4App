var express = require('express');
var router = express.Router();
const bc = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();

const saltRounds = 10;

const registerUser = async ({ body }, res) => {
  const { email, password, username } = body;
  try {
    if (!(email && password && username)) {
      return res.status(400).send('All input is required');
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login');
    }
    const newUser = new User(body);
    await newUser.save();
    const result = await User.findOne({ _id: newUser._id.toString() }).lean();
    return res.json({ success: true, user: result._id });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
};

router.post('/register', registerUser);

module.exports = router;
