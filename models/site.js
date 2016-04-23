const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var SiteSchema = Schema({
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
