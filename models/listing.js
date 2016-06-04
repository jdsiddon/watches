const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const siteSchema = require('./site');

var ListingSchema = new Schema({
  img: {
    type: String
  },
  watch: {
    brand: {
      type: String,
      required: [true, 'Watch \'Brand\' required']
    },
    model_name: {
      type: String,
      required: [true, 'Watch \'Model\' required']
    }
  },
  price: {
    type: Number,
    required: [true, 'Listing \'Price\' required']
  },
  url: {
    type: String,
    required: [true, 'Listing \'URL\' required']
  },
  type: {
    type: String,
    enum: ['Auction', 'Purchase'],
    required: [true, 'Listing \'Type\' required']
  },
  state: {
    type: String,
    enum: ['New', 'Used'],
    required: [true, 'Listing \'State\' required']
  },
  _site: {
    type: Schema.Types.ObjectId,
    ref: 'Site'
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Listing', ListingSchema);
