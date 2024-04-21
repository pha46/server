const mongoose = require('mongoose');

// Model for storing User Search History
const searchHistorySchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true
    },
    query: {
      type: String,
      required: true
    },
    page: {
      type: Number,
      required: true
    },
    mediaType: {
        type: String
    },
    searchType: {
        type: String
    },
    backdrop_path: {
      type: String
    },
    data: {
      type: Object
    }
  }, { timestamps: true });
  
  const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
  
  module.exports = SearchHistory;