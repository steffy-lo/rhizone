
const mongoose = require('mongoose');

const threadContentSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ""
    },
    body: {
        type: String,
        required: true,
        minlegth: 150
    },
    imgRef: {
        type: String,
        default: ""
    }
});

const threadDataModel = mongoose.model('Thread', new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    pid: {
        type: Number,
        default: -1
    },
    author: {
        type: String,
        required: true,
        minlegth: 1
    },
    replies: [{
        type: Number
    }],
    content: threadContentSchema
}))

module.exports = { threadDataModel }