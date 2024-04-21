const mongoose = require('mongoose');

const revokedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

const RevokedToken = mongoose.model('RevokedToken', revokedTokenSchema);

module.exports = RevokedToken;