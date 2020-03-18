/* Student mongoose model */
const mongoose = require('mongoose')

const UserDataModel = mongoose.model('UserData', new mongoose.Schema({
	userName: {
		type: String,
		required: true,
		minlegth: 1,
		trim: true
	},
	password: {
		type: String,
		required: true,
		minlegth: 1
	},
	isAdmin: {
	    type: Boolean,
	    required: true,
	    default: false
	}
}))

module.exports = { UserDataModel }