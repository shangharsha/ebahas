const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		phone: {
			type: Number,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		isSuperUser: {
			type: Boolean,
			default: false,
		},
		resetPasswordLink: {
			type: String,
		},
		dob: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = User = mongoose.model('users', UserSchema);
