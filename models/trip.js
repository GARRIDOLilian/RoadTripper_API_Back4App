const mongoose = require('mongoose');

const enums = {
  role: ['ADMIN', 'USER']
};
const activity = {
  xid: { type: String },
  name: { type: String },
  dist: { type: Number },
  rate: { type: Number },
  osm: { type: String },
  kinds: { type: String },
  point: { lon: { type: Number }, lat: { type: Number } }
};

const Trip = new mongoose.Schema({
  user: { type: 'ObjectId', ref: 'User' },
  from: {
    city: { type: String },
    point: { lon: { type: Number }, lat: { type: Number } }
  },
  to: {
    city: { type: String },
    point: { lon: { type: Number }, lat: { type: Number } },
    activities: {
      Restaurants: [activity],
      Events: [activity],
      Accommodations: [activity],
      Transports: [activity],
      Bars: [activity],
      Culturals: [activity],
      Sports: [activity]
    }
  },
  waypoints: [
    {
      city: { type: String },
      point: { lon: { type: Number }, lat: { type: Number } },
      activities: {
        Restaurants: [activity],
        Events: [activity],
        Accommodations: [activity],
        Transports: [activity],
        Bars: [activity],
        Culturals: [activity],
        Sports: [activity]
      }
    }
  ]
});

module.exports = mongoose.model('Trip', Trip);
