
const mongoose = require('mongoose')

const Thread = mongoose.model('Thread', {
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    subtitle: {
        type: String,
        minlength: 1,
        trim: true
    },
    content: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    creator: {
        type: String,
        required: true,
        minlength: 1
    }
})

module.exports = { Thread }