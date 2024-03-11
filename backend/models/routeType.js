const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routeTypeSchema = new Schema({
  walkList: {
    type: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Route'}],
    default: []
  },
  runList: {
    type: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Route'}],
    default: []
  },
  hikeList: {
    type: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Route'}],
    default: []
  },
  cycleList: {
    type: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Route'}],
    default: []
  },
  swimList: {
    type: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Route'}],
    default: []
  },
  otherList: {
    type: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Route'}],
    default: []
  },
});


module.exports = mongoose.model('RouteType', routeTypeSchema);