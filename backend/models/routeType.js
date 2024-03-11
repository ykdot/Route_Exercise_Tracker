const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routeTypeSchema = new Schema({
  type: { type: String, required: true },
  routes: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Route'}],
  default: []
});


module.exports = mongoose.model('RouteType', routeTypeSchema);