const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routeSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
  type: { type: String, required: true },
  date: { type: String, required: true },
  points: { type: Array, "default": [], required: true },
  other: { type: Object, required: true}
});


module.exports = mongoose.model('Route', routeSchema);