const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var WatchSchema = new Schema({
  watch: {
    brand: {
      type: String,
      required: [true, 'Watch \'Brand\' required']
    },
    model_name: {
      type: String,
      required: [true, 'Watch \'Model\' required']
    }
  }
});


mongoose.model('Watch', WatchSchema);
