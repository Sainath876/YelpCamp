const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passlocalM = require('passport-local-mongoose');

const User = new Schema({
    email: {
        type: String,
        required: true
    }
})

User.plugin(passlocalM);

module.exports = mongoose.model('User', User);