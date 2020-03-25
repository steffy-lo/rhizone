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

app.post('/create_thread', (req, res, next) => {
	const thread = new threadDataModel({
		id: 0,
		pid: req.body.pid,
		author: req.body.author,
		replies: [],
		content: req.body.content
	})

	threadDataModel.estimatedDocumentCount()
		.then(count => {
			thread.id = count + 1;
		}).then(data =>{
		thread.save().then(result => {
			res.send(result)})
	}).catch(err => {
		//handle possible errors
	})
})

app.delete('/del_thread', (req, res) => {
	const query = {_id: req.query.tid}
	threadDataModel.findOneAndRemove(query).then((thread) => {
		if (!thread) {
			res.status(404).send();
		} else {
			res.send(thread);
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

app.get('/threads', (req, res) => {
	threadDataModel.find().then((thread) => {
		res.send(thread) // can wrap in object if want to add more properties
	}, (error) => {
		res.status(500).send(error) // server error
	})
})

app.post('/add_user', (req, res) => {
	const user = new User({
		userName: req.body.username,
		password: req.body.password,
		isAdmin: req.body.isAdmin
	})

	// Save to the database
	user.save().then(result => {
		res.send(result)
	}, error => {
		console.log("fail")
		res.status(400).send(error)
	})
})

app.get('/user/:username', (req, res) => {
	const username = req.params.username;
	// Otherwise, find by the id and creator
	User.findOne({ userName: username }).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}
	}).catch((error) => {
		res.status(500).send()  // server error
	})
});

// a POST route to create a resource
app.post('/users/login', (req, res) => {
	const userName = req.body.userName;
    const password = req.body.password;

    // Use the static method on the User model to find a user
    // by their email and password
	User.findByUserPassword(userName, password).then((user) => {
	    if (user) {
			res.send(user);
            req.session.user = user._id;
            req.session.userName = user.userName;
            //res.redirect('/home');
        }
    }).catch((error) => {
    	console.log(error);
		res.status(400).send();
    })
});

app.post('/inboxes', (req, res) => {
	log(req.body)

	// Create a new student using the Student mongoose model
	const inbox = new inboxDataModel({
		userName: req.body.username,
		newActivity: Array.from(req.body.newActivity),
		oldActivity: Array.from(req.body.oldActivity),
		pastPosts: Array.from(req.body.pastPosts)
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
	// log(req.query)

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

// not supported by browser, use delete + add as an alternative
/*app.patch('/inboxes', (req, res) => {
	log(req.body)

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
})*/

/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000
app.listen(port, () => {
    log(`Listening on port ${port}...`)
})