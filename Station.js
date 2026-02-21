const mongoose = require('mongoose');
const stationSchema = new mongoose.Schema({
  name: String,
  url: String,
  image: String,
  tags: String,
  isBackup: { type: Boolean, default: false }
});
module.exports = mongoose.model('Station', stationSchema);