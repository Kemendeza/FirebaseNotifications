const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: String,
  body: String,
  token: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);