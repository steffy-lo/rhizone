/* server.js, with mongodb API and static directories */
'use strict';

const log = console.log

const  PORT = process.env.PORT || 5000;

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

var cleanser = require('profanity-cleanser');
cleanser.setLocale(); 
// Some words which are ok to say--we nee
cleanser.removeWords("ass");
cleanser.removeWords("asshole");
cleanser.removeWords("bastard");
cleanser.removeWords("circlejerk");
cleanser.removeWords("domination");
cleanser.removeWords("erotic");
cleanser.removeWords("eroticism");
cleanser.removeWords("escort");
cleanser.removeWords("fuck");
cleanser.removeWords("motherfucker");
cleanser.removeWords("dick");
cleanser.removeWords("fucking");
cleanser.removeWords("sadism");
cleanser.removeWords("sex");
cleanser.removeWords("shit");
cleanser.removeWords("suck");
cleanser.removeWords("sucks");
cleanser.removeWords("voyeur");

var grawlix = require('grawlix');
grawlix.setDefaults({
  plugins: [
    {
      plugin: require('grawlix-racism'),
      options: {
		  style: false
      }
    }],
	   style: {
		name: 'custom-style',
		randomChars: function(len) {
		  var str = '';
		  for (var i=0; i<len; i++) {
			if (i % 2 > 0) {
			  str += 'uwu ';
			} else {
			  str += ':3'
			}
		  }
		  return str;
		}
	  },
	  allowed: [ "ass", "asshole", 'bastard', "dick", "dumbass", "fuck", "motherfuck", "motherfucker", "piss", "shit",]
  // other options...
});

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
		pid_num: req.body.pid_num,
		author: req.body.author,
		replies: [],
		content: req.body.content
	})
	threadDataModel.estimatedDocumentCount()
		.then(count => {
			thread.content.title = grawlix(cleanser.replace(thread.content.title, 'word', 'QT3.14'));
			thread.content.body = grawlix(cleanser.replace(thread.content.body, 'word', 'QT3.14'));
			thread.id = count + 1;
		}).then(data =>{
		thread.save().then(result => {
			res.send(result)})
	}).catch(err => {
		//handle possible errors
	})
})

// app.patch('/cascade_del/:id', (req, res) => {
//     const id = req.params.id
//     threadDataModel.find({replies: { $in: [id] } }).then(threads => {
//         console.log(threads);
//         threads.map(thread =>
//             thread.findByIdAndUpdate(
//                 thread._id,
//                 { $pull: { replies: id } },
//                 { new: true, omitUndefined: true }
//             )
//         )
//     }).catch((error) => {
//         res.status(500).send()
//     })
// })

app.delete('/del_thread', (req, res) => {
	const query = {_id: req.query.tid}
	threadDataModel.findOneAndRemove(query).then((thread) => {
		if (!thread) {
			res.status(404).send();
		} else {
            threadDataModel.find({replies: { $in: [thread._id] } }).then(threads => {
                threads.map(t =>
                    threadDataModel.findByIdAndUpdate(
                        t._id,
                        { $pull: {replies: { $in: [thread._id] } }},
                        { new: true, omitUndefined: true}
                    ).then(t => {
                        t.save();
                    })
                )
            })
			res.send(thread);
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

app.get('/threads', (req, res) => {
    if (req.query.id == null){
        threadDataModel.find().then((thread) => {
    		res.send(thread) // can wrap in object if want to add more properties
    	}, (error) => {
    		res.status(500).send(error) // server error
    	})
    } else {
        const query = {id: req.query.id}
        threadDataModel.findOne(query).then((thread) => {
            //log(inbox)
            if (!thread) {
                res.status(404).send();  // could not find this user
            } else {
                res.send(thread);
            }
        }).catch((error) => {
          	res.status(500).send()  // server error
        })
    }
})

app.get('/replies', (req, res) => {
	const replies = req.query.ids.split(",");
	const threads = [];
	for (let i = 0; i < replies.length; i++) {
		if (!ObjectID.isValid(replies[i])) {
			res.status(404).send()  // if invalid id, definitely can't find resource, 404.
			return;  // so that we don't run the rest of the handler.
		}
		threads.push(replies[i])
	}
	threadDataModel.find({
		'_id': { $in: threads}
	}).then(docs => {
		if (!docs) {
			res.status(404).send();  // could not find this user
		} else {
			res.send(docs);
		}
	}).catch(err => {
		res.status(500).send()
	})
})

app.get('/threads/:id', (req, res) => {
	const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
	}

	// Otherwise, findById
	threadDataModel.findById(id).then((thread) => {
		if (!thread) {
			res.status(404).send()
		} else {
			res.send(thread)
		}
	}).catch((error) => {
		res.status(500).send()  // server error
	})

})

function updateParent(id, res, pres) {
	threadDataModel.findById(id).then((thread) => {
		if (!thread) {
			pres.status(404).send()
		} else {
			if (thread.pid != -1) {
				threadDataModel.findByIdAndUpdate(
					{_id: id},
					{
						replies: res
					},
					{new: true, omitUndefined: true},
					(err, res) => {
						if (err) return;
						// call the function recursively with the new parent
						updateParent(res.pid, res, pres);
					}).then((thread) => {
					if (!thread) {
						pres.status(404).send()
					} else {
						pres.send(thread)
					}
				})
			} else {
				thread.replies.push(res);
				thread.save();
			}
		}
	}).catch((error) => {
		pres.status(500).send()  // server error
	})
}

app.patch('/threads', (req, res) => {
	const id = req.body.id
	const pid = req.body.pid
	const reply = req.body.reply

	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
	}
	threadDataModel.findByIdAndUpdate({_id: id}, {$push: {replies: reply}}, {new: true, omitUndefined: true}).then((thread) => {
		if (!thread) {
			res.status(404).send()
		} else {
			res.send(thread)
		}
	}).catch((error) => {
		res.status(400).send() // bad request for changing the user.
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
		res.status(400).send(error)
	})
})

app.get('/users', (req, res) => {
    //log(req.query.userName);
    const query = {userName: req.query.userName}
	// Otherwise, find by the id and creator
	User.findOne(query).then((user) => {
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

	const newA = Array.from(req.body.newActivity);
	const oldA = Array.from(req.body.oldActivity);
	const pastP = Array.from(req.body.pastPosts);

	// Create a new student using the Student mongoose model
	const inbox = new inboxDataModel({
		userName: req.body.userName,
		newActivity: newA,
		oldActivity: oldA,
		pastPosts: pastP
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

app.delete('/inboxes', (req, res) => {
	log(req.query)

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
app.patch('/users', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	User.findOneAndUpdate({userName: username}, {password: password}, {new: true, omitUndefined: true}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {   
			res.send(user)
		}
	}).catch((error) => {
		res.status(400).send() // bad request for changing the user.
	})

})

app.delete('/users/delete/:username', (req, res) => {
	const username = req.params.username

	// Delete a student by their id
	User.findOneAndDelete({userName: username}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}
	}).catch((error) => {
		res.status(500).send() // server error, could not delete.
	})
})

app.patch('/users/privileges/:username', (req, res) => {
	const username = req.params.username

	// Update the user by their id.
	User.findOneAndUpdate({userName: username}, {isAdmin: true}, {new: true, omitUndefined: true}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}
	}).catch((error) => {
		res.status(400).send() // bad request for changing the user.
	})
})

//Serving?

app.use(express.static(__dirname + "/build"));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
    res.sendFile(__dirname + "/build/index.html");
});

/*************************************************/
// Express server listening...
const port = process.env.PORT || 3000
app.listen(port, () => {
    log(`Listening on port ${port}...`)
})