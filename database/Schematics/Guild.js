const mongoose = require('mongoose');
const config = require('./../../config.json');

module.exports = mongoose.model('Guild', new mongoose.Schema({
    id: { type: String },
    appChannel: { type: String, default: null },
    logChannel: { type: String, default: null },
    reviewer: { type: String, default: null },
    applyLimit: { type: Number, default: 0 },
    clearChannel: { type: Boolean, default: false },
    prefix: { type: String, default: config.prefix }
}));
