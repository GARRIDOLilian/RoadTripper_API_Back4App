var express = require('express');
var router = express.Router();
require('dotenv').config();
const fs = require('fs');
const { checkJWT } = require('../middlewares/security');
const Trip = require('../models/trip');

const getTrip = async ({ params }, res) => {
  try {
    const tripsByUser = await Trip.find({ user: params.filter }).lean();

    return res.json({ success: true, trips: tripsByUser });
  } catch (e) {
    return res.status(500).json(e);
  }
};
const getTripById = async ({ params }, res) => {
  try {
    const trip = await Trip.findOne({ _id: params.id }).lean();

    return res.json({ success: true, trip: trip });
  } catch (e) {
    return res.status(500).json(e);
  }
};
const postSave = async ({ body }, res) => {
  try {
    const newTrip = new Trip(body);
    await newTrip.save();
    const trip = await Trip.findOne({ _id: newTrip._id });

    return res.json({ success: true, result: trip });
  } catch (e) {
    return res.status(500).json(e);
  }
};
const patchTrip = async ({ body, params }, res) => {
  try {
    await Trip.updateOne({ _id: params.id }, { ...body });

    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json(e);
  }
};
router.post('/trip', checkJWT, postSave); // have to add  => checkJWT,
router.patch('/trip/:id', checkJWT, patchTrip);
router.get('/trip/:filter', checkJWT, getTrip);
router.get('/trip/byid/:id', getTripById);

module.exports = router;
