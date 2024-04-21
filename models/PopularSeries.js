const mongoose = require('mongoose');

// Model for storing Popular Series Data
const popularSeriesDataSchema = new mongoose.Schema({
    data: {
      type: Object,
      required: true
    },
    page: {
      type: Number,
      required: true
    }
  }, { timestamps: true });
  
  const PopularSeriesData = mongoose.model('PopularSeriesData', popularSeriesDataSchema);

  module.exports = PopularSeriesData;