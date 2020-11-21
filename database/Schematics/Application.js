const mongoose = require('mongoose');

let AnswerSchema = new mongoose.Schema({
    question: { type: String },
    answer: { type: String }
});

module.exports = mongoose.model('Application', new mongoose.Schema({
    user: { type: String },
    guild: { type: String },
    answers: [ AnswerSchema ],
    status: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
}));
