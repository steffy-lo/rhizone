
const mongoose = require('mongoose');

const inboxDataModel = mongoose.model('Inbox', new mongoose.Schema({
    userName: {
        type: String,
    	required: true,
    	minlegth: 1,
    	trim: true
    },
    newActivity: [{
        type: Number
    }],
    oldActivity: [{
        type: Number
    }],
    pastPosts: [{
        type: Number
    }]
}))

module.exports = { inboxDataModel }