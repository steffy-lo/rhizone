const mongoose = require('mongoose');
const log = console.log;
const {userData,inboxData,threadData} = require('./sampleData.js');
const {User} = require('../../models/userDataModel.js');

const sampleUserData = new Array;

for (const [key, value] of userData.entries()) {
    sampleUserData.push({userName:key, password:value.password, isAdmin:value.isAdmin});
 };

mongoose.connect('mongodb://localhost:27017/UserDataAPI', {useNewUrlParser: true, useUnifiedTopology: true});

User.insertMany(sampleUserData, function(error, docs) {
    if (error) return console.error(error);
    log("user Data inserted!");
    mongoose.connection.close();
});

