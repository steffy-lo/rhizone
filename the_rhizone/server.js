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
app.post('/users/create', (req, res, next) => {
    console.log("request");
    const user = new User({
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

// // a GET route to get a resource
// app.get()

// // a DELETE route to delete a resource
// app.delete()

// // a PATCH route for changing properties of a resource
// app.patch()


/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000
app.listen(port, () => {
    log(`Listening on port ${port}...`)
})