
const mongoose = require('mongoose')

const User = mongoose.model('User', {
    username: {
        type: String,
        required: true,
        minlegth: 1,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlegth: 1,
        trim: true
    },
    type: {
        type: String,
        required: true
    }

})

module.exports = { User }