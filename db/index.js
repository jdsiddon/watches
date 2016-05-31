const mongoose = require('mongoose');
const Schemas = require('../models');

// Database
mongoose.connect('mongodb://localhost/watches');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {

  // Connected!
  console.log('Connected!');
})
