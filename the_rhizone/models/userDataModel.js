/* Student mongoose model */
const mongoose = require('mongoose')

const userDataModel = mongoose.model('User', new mongoose.Schema({
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
	    default: false
	}
}))

module.exports = { userDataModel }