const mongoose = require("mongoose");

const wordSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    word: String,
    language: String,
    category: String,
    answer: String,
    answer_lang: String

});
module.exports = mongoose.model('Word', wordSchema);
