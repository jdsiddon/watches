const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for users.
var UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username required']
  },
  password: {
    type: String,
    default: '1234'
  }
});

mongoose.model('User', UserSchema);
