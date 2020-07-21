const mongoose = require('mongoose');

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
