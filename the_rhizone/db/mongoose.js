/* This module will hold our connection to
   our mongo server through the Mongoose API.
   We will access the connection in our express server. */
const mongoose = require('mongoose')

/* Connnect to our database */
// Get the URI of the local database, or the one specified on deployment.
const mongoURI = 'mongodb+srv://rhizoneadmin:csc309rhizones@therhizone-klo9g.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(process.env.MONGODB_URI || mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

if(process.env.NODE_ENV === "production"){
	app.use(express.static('build'));
}
	
module.exports = { mongoose }  // Export the active connection.