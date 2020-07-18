const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const CategorySchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		slug: {
			type: String,
			slug: 'title',
			unique: true,
		},

		image: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = Category = mongoose.model('categories', CategorySchema);
