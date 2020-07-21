const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator');
const admin = require('../../middleware/admin');

//@ POST    api/categories
//@ desc   add a category
//@ access private

router.post(
	'/',
	[
		admin,
		[
			check('title', 'title is required').not().isEmpty(),
			check('slug', 'slug is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const user = await User.findById(req.user.id).select('-password');

			urlpath = req.body.slug.toLowerCase();
			slug = urlpath.split(' ').join('-');

			const newCategory = new Category({
				title: req.body.title,
				slug: slug,
			});

			await newCategory.save();

			const categories = await Category.find().sort('-createdAt');

			res.json(categories);
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @ route  GET api/categories
//@ desc    list all the categories
//@ access  public
router.get('/', async (req, res) => {
	try {
		const categories = await Category.find();
		res.json(categories);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

// @ route  GET api/categories/:slug of category
//@ desc    list all the posts with category
//@ access  public

router.get('/:slug', async (req, res) => {
	try {
		const category = await Category.findOne({ slug: req.params.slug });
		if (category) {
			const posts = await Post.find({ categorytitle: category.title })
				.populate('user', 'image')
				.sort('-createdAt');
			res.json(posts);
		} else {
			res.status(401).send('Invalid Category');
		}
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   DELETE api/categories/:id
// @desc    DELETE a category
// @access  Private
router.delete('/:id', admin, async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);

		if (!category) {
			return res.status(404).json({ msg: 'category not found' });
		}

		await category.remove();

		res.json({ msg: 'category removed' });
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'category not found' });
		}
		res.status(500).send('Server Error');
	}
});

module.exports = router;
