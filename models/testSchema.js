const mongoose = require('mongoose');
const Student = require('../models/studentSchema');
const WordPool = require('../models/wordPoolSchema');

const testSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    word_pool: { type: mongoose.Schema.Types.ObjectId, ref: 'WordPool'},
    assigned_words: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Word'}],
    number_of_words: Number,
    answers: [String],
    results: [Boolean],
});

module.exports = mongoose.model('Test', testSchema);