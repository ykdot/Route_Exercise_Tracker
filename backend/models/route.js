const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routeSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'Route'},
  method: {type: String, required: true},
  type: { type: String},
  distance: {type: Number},
  date: { type: String},
  duration: {type: String},
  calories: {type: Number},
  heartRate: {type: Object},
  points: { type: Array, "default": [], required: true },
  other: { type: Object}
});


module.exports = mongoose.model('Route', routeSchema);