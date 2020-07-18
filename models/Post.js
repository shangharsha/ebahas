const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const PostSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users',
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'categories',
			required: true,
		},
		categorytitle: {
			type: String,
			required: true,
		},
		name: {
			type: String,
		},
		slug: {
			type: String,
			slug: 'title',
			unique: true,
		},
		title: {
			type: String,
			required: true,
		},
		approval: {
			type: Boolean,
			default: true,
		},
		publish: {
			type: Boolean,
			default: false,
		},
		detail: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		likes: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'users',
				},
			},
		],
		unlikes: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'users',
				},
			},
		],
		comments: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'users',
				},
				text: {
					type: String,
					required: true,
				},
				name: {
					type: String,
				},
			},
			{
				timestamps: true,
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = Post = mongoose.model('posts', PostSchema);
