const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var WatchSchema = Schema({
  brand: {
    type: String,
    required: true
  },
  model_name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  auction: {
    type: Boolean
  },
  state: {
    type: String,
    required: true
  }
});

mongoose.model('Watch', WatchSchema);
