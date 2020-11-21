const mongoose = require('mongoose');

module.exports = mongoose.model('Question', new mongoose.Schema({
    guild: { type: String },
    content: { type: String },
    type: { type: String, default: null }
}));
