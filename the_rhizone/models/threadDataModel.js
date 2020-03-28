const mongoose = require('mongoose');

const threadContentSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "",
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
        type: Number,
        required: true
    },
    pid: {
        type: String,
        default: -1
    },
	pid_num: {
		type: Number,
		required: false
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