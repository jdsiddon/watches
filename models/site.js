const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var SiteSchema = Schema({
  name: {
    type: String
  },
  url: {
    type: String
  }
});

mongoose.model('Site', SiteSchema);
