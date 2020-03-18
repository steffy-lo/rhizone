/* server.js, with mongodb API and static directories */
'use strict';
const log = console.log

const express = require('express')
// starting the express server
const app = express();

// mongoose and mongo connection
const { mongoose } = require('./db/mongoose')

// import the mongoose models
const { Thread } = require('./models/thread')
const { User } = require('./models/user')

// to validate object IDs
const { ObjectID } = require('mongodb')

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser')
app.use(bodyParser.json())

/*********************************************************/

/*** API Routes below ************************************/

// a POST route to create a resource
app.post()

// a GET route to get a resource
app.get()

// a DELETE route to delete a resource
app.delete()

// a PATCH route for changing properties of a resource
app.patch()


/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000
app.listen(port, () => {
    log(`Listening on port ${port}...`)
})