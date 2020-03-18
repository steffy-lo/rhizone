/* Student mongoose model */
const mongoose = require('mongoose')

const userDataModel = mongoose.model('UserData', {
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
})

module.exports = { userDataModel }