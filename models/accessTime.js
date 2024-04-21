const mongoose = require('mongoose');

const AccessTimeSchema = new mongoose.Schema({
    lastAccessedTime: { type: Date, default: null }
  });
  
  const AccessTime = mongoose.model('AccessTime', AccessTimeSchema);

  module.exports = AccessTime;