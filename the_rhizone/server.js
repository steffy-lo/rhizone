/* server.js, with mongodb API and static directories */
'use strict';

const log = console.log

const PORT = process.env.PORT || 5000;

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
const { Image } = require("./models/image");

// multipart middleware: allows you to access uploaded file from req.file
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'dx0ws0ikf',
	api_key: '472166537945459',
	api_secret: 'jgDZccV6xrVMoxHoNOGaVbnrW5A'
});

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

//==================================== Thread-Related Routes ===========================================================

app.post('/create_thread', (req, res) => {
	const thread = new threadDataModel({
		id: 0,
		pid: req.body.pid,
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
			res.send(result)
		})
	}).catch(err => {
		//handle possible errors
		res.status(500).send()
	})
})

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

app.patch('/threads', (req, res) => {
	const id = req.body.id
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

//========================================= User-Related Routes =======================================================

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

//==================================== Inbox-Related Routes ============================================================

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

app.patch('/inboxes/add_newActivity', (req, res) => {
    const user = req.body.userName;
    const newA = req.body.newActivity;

    inboxDataModel.findOneAndUpdate({userName: user}, {$push: {newActivity: newA}}, {new: true, omitUndefined: true}).then((inbox) => {
		if (!inbox) {
			res.status(404).send()
		} else {
			res.send(inbox)
		}
	}).catch((error) => {
		res.status(400).send() // bad request
	})
})

app.patch('/inboxes/delete_newActivity', (req, res) => {
    const user = req.body.userName;
    const newA = req.body.newActivity;

    inboxDataModel.findOneAndUpdate({userName: user}, {$pull: {newActivity: {activityID: newA}}}, {new: true}).then((inbox) => {
		if (!inbox) {
			res.status(404).send()
		} else {
			res.send(inbox)
		}
	}).catch((error) => {
		res.status(400).send() // bad request
	})
})

app.patch('/inboxes/add_pastPosts', (req, res) => {
    const user = req.body.userName;
    const pastP = req.body.pastPosts;

    inboxDataModel.findOneAndUpdate({userName: user}, {$push: {pastPosts: pastP}}, {new: true, omitUndefined: true}).then((inbox) => {
		if (!inbox) {
			res.status(404).send()
		} else {
			res.send(inbox)
		}
	}).catch((error) => {
		res.status(400).send() // bad request
	})
})

app.patch('/inboxes/delete_pastPosts', (req, res) => {
    const user = req.body.userName;
    const pastP = req.body.pastPosts;

    inboxDataModel.findOneAndUpdate({userName: user}, {$pull: {pastPosts: {activityID:pastP}}}, {new: true}).then((inbox) => {
		if (!inbox) {
			res.status(404).send()
		} else {
			res.send(inbox)
		}
	}).catch((error) => {
		res.status(400).send() // bad request
	})
})

app.patch('/inboxes/delete_oldActivity', (req, res) => {
    const user = req.body.userName;
    const oldA = req.body.oldActivity;

    inboxDataModel.findOneAndUpdate({userName: user}, {$pull: {oldActivity: {activityID:oldA}}}, {new: true}).then((inbox) => {
		if (!inbox) {
			res.status(404).send()
		} else {
			res.send(inbox)
		}
	}).catch((error) => {
		res.status(400).send() // bad request
	})
})

//============================================= Image-Related Routes ===================================================
/*** Image API Routes below ************************************/

// a POST route to *create* an image
app.post("/images", multipartMiddleware, (req, res) => {

	// Use uploader.upload API to upload image to cloudinary server.
	cloudinary.uploader.upload(
		req.files.file.path, // req.files contains uploaded files
		function (result) {

			// Create a new image using the Image mongoose model
			const img = new Image({
				image_id: result.public_id, // image id on cloudinary server
				image_url: result.url, // image url on cloudinary server
				created_at: new Date(),
			});

			// Save image to the database
			img.save().then(
				saveRes => {
					res.send(saveRes);
				},
				error => {
					res.status(400).send(error); // 400 for bad request
				}
			);
		});
});

// a GET route to get all images
app.get("/images", (req, res) => {
	Image.find().then(
		images => {
			res.send({ images });
		},
		error => {
			res.status(500).send(error); // server error
		}
	);
});

app.get("/images/:imageId", (req, res) => {
	const imageId = req.params.imageId;
	Image.findOne({ image_id: imageId }).then(
		image => {
			res.send(image);
		},
		error => {
			res.status(500).send(error); // server error
		}
	);
});

/// a DELETE route to remove an image by its id.
app.delete("/images/:imageId", (req, res) => {
	const imageId = req.params.imageId;

	// Delete an image by its id (NOT the database ID, but its id on the cloudinary server)
	// on the cloudinary server
	cloudinary.uploader.destroy(imageId, function (result) {

		// Delete the image from the database
		Image.findOneAndRemove({ image_id: imageId })
			.then(img => {
				if (!img) {
					res.status(404).send();
				} else {
					res.send(img);
				}
			})
			.catch(error => {
				res.status(500).send(); // server error, could not delete.
			});
	});
});

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