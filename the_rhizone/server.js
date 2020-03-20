/* server.js, with mongodb API and static directories */
'use strict';
const log = console.log

const express = require('express')
// starting the express server
const app = express();

// mongoose and mongo connection
const { mongoose } = require('./db/mongoose')

// import the mongoose models
const { threadDataModel } = require('./models/threadDataModel')
const { userDataModel } = require('./models/userDataModel')
const { inboxDataModel } = require('./models/inboxDataModel')

// to validate object IDs
const { ObjectID } = require('mongodb')

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser')

// cors
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

/*********************************************************/

/*** API Routes below ************************************/
// a POST route to create a resource
app.post('/users', (req, res, next) => {
    console.log("request");
    const user = new userDataModel({
        userName: req.body.username,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    })
    
    // Save to the database
    user.save().then(result => {
        res.send(result)
        console.log("respond");
    }, error => {
        res.status(400).send(error)
    })
})

// post inboxData should only be called when new user is added
app.post('/inboxes', (req, res) => {
	// log(req.body)

	// Create a new student using the Student mongoose model
	const inbox = new inboxDataModel({
		userName: req.body.username,
		newActivity: new Array(),
		oldActivity: new Array(),
		pastPosts: new Array()
	})

	// Save inbox to the database
	inbox.save().then((result) => {
		res.send(result)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})
})


// // a GET route to get a resource
// app.get()
app.get('/inboxes', (req, res) => {
    //log(req.query)

    const query = {userName: req.query.userName}
    inboxDataModel.findOne(query).then((inbox) => {
        //log(inbox)
        if (!inbox) {
            res.status(404).send();  // could not find this user
        } else {
            res.send(inbox);
        }
    }).catch((error) => {
      	res.status(500).send()  // server error
    })
})

// // a DELETE route to delete a resource
// app.delete()
app.delete('/inboxes', (req, res) => {
	// log(req.body)

	// Delete a inbox by userName
	const query = {userName: req.query.userName}
    inboxDataModel.findOneAndRemove(query).then((inbox) => {
        if (!inbox) {
            res.status(404).send();  // could not find this user
        } else {
            res.send(inbox);
        }
    }).catch((error) => {
      	res.status(500).send()  // server error
    })
})

// // a PATCH route for changing properties of a resource
// app.patch()

app.patch('/inboxes', (req, res) => {
	// log(req.body)

	const {newActivity, oldActivity, pastPosts} = req.body;
	const body = {newActivity, oldActivity, pastPosts};

    const query = {userName: req.query.userName}
    inboxDataModel.findOneAndUpdate(query, {$set: body}).then((inbox) => {
        if (!inbox) {
            res.status(404).send();  // could not find this user
        } else {
            res.send(inbox);
        }
    }).catch((error) => {
      	res.status(500).send()  // server error
    })
})


/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000
app.listen(port, () => {
    log(`Listening on port ${port}...`)
})