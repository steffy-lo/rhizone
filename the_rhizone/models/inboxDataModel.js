	
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    rootID: {
        type: String,
        required: true
    },
    activityID: {
        type: String,
        required: true
    }
});

const inboxDataModel = mongoose.model('Inbox', new mongoose.Schema({
    userName: {
        type: String,
    	required: true,
    	minlegth: 1,
    	trim: true
    },
    newActivity: {
        type: Array
    },
    oldActivity: {
        type: Array
    },
    pastPosts: {
        type: Array
    }
}));

module.exports = { inboxDataModel }