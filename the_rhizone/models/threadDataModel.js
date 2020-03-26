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

const threadDataSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    pid: {
        type: String,
        default: -1
    },
    author: {
        type: String,
        required: true,
        minlegth: 1
    },
    content: threadContentSchema
})

threadDataSchema.add({
    replies: [threadDataSchema]
})

const threadDataModel = mongoose.model('Thread', threadDataSchema)

module.exports = { threadDataModel }