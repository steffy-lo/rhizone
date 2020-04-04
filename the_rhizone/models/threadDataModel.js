const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    image_id: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    created_at: String
});

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
        type: imageSchema,
        default: null
    }
});

const threadDataSchema = new mongoose.Schema({
    id: {
        type: Number,
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
    replies: [String],
    content: threadContentSchema
})

const threadDataModel = mongoose.model('Thread', threadDataSchema)

module.exports = { threadDataModel }