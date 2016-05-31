const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var SiteSchema = Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Site \'Name\' required']
  },
  url: {
    type: String,
    required: [true, 'Site \'URL\' required']
  }
});

mongoose.model('Site', SiteSchema);
