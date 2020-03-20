/* server.js, with mongodb API and static directories */
'use strict';
const log = console.log

const express = require('express')
// starting the express server
const app = express();

// mongoose and mongo connection
const { mongoose } = require('./db/mongoose')
mongoose.set('useFindAndModify', false); // for some deprecation issues

// import the mongoose models
const { threadDataModel } = require('./models/threadDataModel')
const { User } = require('./models/userDataModel')
const { inboxDataModel } = require('./models/inboxDataModel')

// to validate object IDs
const { ObjectID } = require('mongodb')

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser')

// cors
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

const session = require('express-session')
app.use(bodyParser.urlencoded({ extended: true }));


/*********************************************************/
app.use(session({
    secret: 'oursecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60000,
        httpOnly: true
    }
}));

/*** API Routes below ************************************/
// a POST route to create a resource
app.post('/users/login', (req, res) => {
	const userName = req.body.userName
    const password = req.body.password
	
    // Use the static method on the User model to find a user
    // by their email and password
	User.findByUserPassword(userName, password).then((user) => {
	    if (!user) {
			res.send('NO USER')
            //res.redirect('/login');
        } else {
            // Add the user's id to the session cookie.
            // We can check later if this exists to ensure we are logged in.
			res.send('HELLO')
            req.session.user = user._id;
            req.session.userName = user.userName;
            //res.redirect('/home');
        }
    }).catch((error) => {
		res.send('ERROR')
		//res.status(400).redirect('/login');
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

// a GET route to get a resource
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

/// a DELETE route to remove a student by their id.
app.delete('/users/delete/:id', (req, res) => {
	const id = req.params.id

	//Validate id
	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return;
	}

	// Delete a student by their id
	User.findOneAndDelete({_id: id}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {   
			res.send(user)
		}
	}).catch((error) => {
		res.status(500).send() // server error, could not delete.
	})
})

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

// a PATCH route for changing properties of a resource.
// (alternatively, a PUT is used more often for replacing entire resources).
app.patch('/users/patch/:id', (req, res) => {
	const id = req.params.id

	// get the updated password from the request body.
	const password = req.body.password;

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return;
	}

	// Update the user by their id.
	User.findOneAndUpdate({_id: id}, {password:password}, {new: true}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {   
			res.send(user)
		}
	}).catch((error) => {
		res.status(400).send() // bad request for changing the user.
	})

})

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