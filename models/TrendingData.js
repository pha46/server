const mongoose = require('mongoose');

const TrendingDataSchema = new mongoose.Schema({
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TrendingData = mongoose.model('TrendingData', TrendingDataSchema);

module.exports = TrendingData;