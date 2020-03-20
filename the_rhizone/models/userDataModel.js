/* Student mongoose model */
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userDataModel = new mongoose.Schema({
	userName: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
	}, 
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	isAdmin: {
	    type: Boolean,
	    default: false
	}
})

// An example of Mongoose middleware.
// This function will run immediately prior to saving the document
// in the database.
userDataModel.pre('save', function(next) {
	const user = this; // binds this to User document instance

	// checks to ensure we don't hash password more than once
	if (user.isModified('password')) {
		// generate salt and hash the password
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

userDataModel.pre('findOneAndUpdate', function(next) {
	let user = this; // binds this to User document instance
	let update = user.getUpdate();
	

	// checks to ensure we don't hash password more than once
		// generate salt and hash the password
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(update.password, salt, (err, hash) => {
				update.password = hash
				next()
			})
		})
})

userDataModel.statics.findByUserPassword = function(userName, password) {
	const User = this // binds this to the User model

	// First find the user by their userName
	return User.findOne({ userName: userName }).then((user) => {
		if (!user) {
			return Promise.reject()  // a rejected promise
		}
		// if the user exists, make sure their password is correct
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					resolve(user)
				} else {
					reject()
				}
			})
		})
	})
}

// make a model using the User schema
const User = mongoose.model('User', userDataModel)
module.exports = { User }