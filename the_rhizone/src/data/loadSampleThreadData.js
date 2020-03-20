const mongoose = require('mongoose');
const log = console.log;
const {userData,inboxData,threadData} = require('./sampleData.js');
const {threadDataModel} = require('../../models/threadDataModel.js');

const sampleThreadData = new Array;

for (const [key, value] of threadData.entries()) {
    sampleThreadData.push({
        id: key,
        pid: value.pid,
        author: value.author,
        replies: Array.from(value.replies),
        content: value.content
    });
 };

mongoose.connect('mongodb://localhost:27017/RhizoneAPI', {useNewUrlParser: true, useUnifiedTopology: true});

threadDataModel.insertMany(sampleThreadData, function(error, docs) {
    if (error) return console.error(error);
    log("thread Data inserted!");
    mongoose.connection.close();
});

