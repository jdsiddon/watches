const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var WatchSchema = new Schema({
  watch: {
    brand: { type: String },
    model_name: { type: String }
  }
});


mongoose.model('Watch', WatchSchema);
