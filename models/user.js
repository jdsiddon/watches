const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passwordHash = require('password-hash');

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

UserSchema.pre('save', function(next) {
  var self = this;

  // Hash the password before saving it.
  var hashedPassword = passwordHash.generate(self.password);
  self.password = hashedPassword;

  next();
});

mongoose.model('User', UserSchema);
