const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const watchSchema = require('./watch');

var ListingSchema = new Schema({
  watch: [watchSchema],
  price: { type: Number },
  date: { type: Date },
  url: { type: String },
  type: {
    type: String,
    enum: ['Auction', 'Purchase']
  },
  state: {
    type: String,
    enum: ['New', 'Used']
  }
});

ListingSchema.pre('save', function(next) {
  this.date = moment(this.date, "M/D/YYYY");                // Clean moment.
  next();
});

mongoose.model('Listing', ListingSchema);
