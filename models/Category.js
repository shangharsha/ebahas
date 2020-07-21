const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		slug: {
			type: String,
			unique: true,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = Category = mongoose.model('categories', CategorySchema);
