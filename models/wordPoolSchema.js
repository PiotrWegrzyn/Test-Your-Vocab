const mongoose = require('mongoose');
const Word = require('./wordSchema');

const wordPoolSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    words: [{type: mongoose.Schema.Types.ObjectId, ref: 'Word', required: true }]


});


module.exports = mongoose.model('WordPool', wordPoolSchema);