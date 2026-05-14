const mongoose = require('mongoose');

const clickAnalyticsSchema = new mongoose.Schema({
  ipAddress: String,
  device: String,
  browser: String,
  country: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  shortUrl: {
    type: String,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  analytics: [clickAnalyticsSchema],
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);
