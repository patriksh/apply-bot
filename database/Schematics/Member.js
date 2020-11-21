const mongoose = require('mongoose');

module.exports = mongoose.model('Member', new mongoose.Schema({
    id: { type: String },
    guild: { type: String },
    applyCount: { type: Number, default: 0 },
    rejectCount: { type: Number, default: 0 }
}));
