const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const siteSchema = require('./site');

var ListingSchema = new Schema({
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
  date: {
    type: Date,
    required: [true, 'Listing \'Date\' required']
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
  }
});

ListingSchema.pre('save', function(next) {
  this.date = moment(this.date, "M/D/YYYY");                // Clean moment.
  next();
});

mongoose.model('Listing', ListingSchema);
