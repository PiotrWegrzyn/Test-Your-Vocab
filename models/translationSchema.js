const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const translationSchema = mongoose.Schema({
    source: [{ type: Schema.Types.ObjectId, ref: 'Word' }],
    target: [{ type: Schema.Types.ObjectId, ref: 'Word' }],

});

module.exports = mongoose.model('Translation', translationSchema);