const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true},
  username: { type: String, required: true, minlength: 3, maxLength: 20},
  password: { type: String, required: true, minlength: 6}, 
  routes: { type: Map, of: Array },
});

// make sure we have a unique email, query email as fast as possible, mke sure user can be created only with unique names
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);