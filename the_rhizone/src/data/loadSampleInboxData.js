const mongoose = require('mongoose');
const log = console.log;
const {userData,inboxData,threadData} = require('./sampleData.js');
const {inboxDataModel} = require('../../models/inboxDataModel.js');

const sampleInboxData = new Array;

for (const [key, value] of inboxData.entries()) {
    sampleInboxData.push({
        userName: key,
        newActivity: Array.from(value.newActivity),
        oldActivity: Array.from(value.oldActivity),
        pastPosts: Array.from(value.pastPosts)
    });
 };

mongoose.connect('mongodb://localhost:27017/RhizoneAPI', {useNewUrlParser: true, useUnifiedTopology: true});

inboxDataModel.insertMany(sampleInboxData, function(error, docs) {
    if (error) return console.error(error);
    log("inbox Data inserted!");
    mongoose.connection.close();
});

