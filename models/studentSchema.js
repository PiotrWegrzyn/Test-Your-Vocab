const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    facebookUID: Number,
    messenger_word_requesting_active: Boolean,
    messenger_word_requesting_pool: String,
    messenger_word_requesting_last_word_answer: String,
    password : { type: String, required: true },
    name : { type: String, required: true },
    lastname : { type: String, required: true }
});


module.exports = mongoose.model('Student', studentSchema);