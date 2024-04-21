const mongoose = require('mongoose');

// Model for storing Popular Movies Data
const popularMoviesDataSchema = new mongoose.Schema({
    data: {
      type: Object,
      required: true
    },
    page: {
      type: Number,
      required: true
    }
  }, { timestamps: true });  
  
  const PopularMoviesData = mongoose.model('PopularMoviesData', popularMoviesDataSchema);

module.exports = PopularMoviesData;