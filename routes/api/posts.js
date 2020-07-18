const express = require('express');
const router = express.Router();
const config = require('config');
const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { paginatedResults } = require('../../middleware/pagination');
const nodemailer = require('nodemailer');
const multer = require('multer');
const Category = require('../../models/Category');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: config.get('username'),
		pass: config.get('password'),
	},
});

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'images/posts/');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
	fileFilter: fileFilter,
});

//@ POST    api/posts
//@ desc   add a post
//@ access private

router.post(
	'/',
	[
		auth,
		upload.single('postImage'),
		[
			check('title', 'title is required').not().isEmpty(),
			check('detail', 'detail is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const user = await User.findById(req.user.id).select('-password');
			const category = await Category.findOne({ title: req.body.category });
			if (!category) {
				return res.status(400).json({ error: 'Category is required' });
			}
			let image = '';

			if (req.file !== undefined) {
				img = req.file.path;
				image = img.split('\\').join('/');
			} else {
				image = 'images/posts/default-image.png';
			}
			var approval = true;
			var publish = false;

			if (user.isAdmin) {
				approval = false;
				publish = true;
			}

			const newPost = new Post({
				title: req.body.title,
				detail: req.body.detail,
				name: user.name,
				user: user.id,
				image: image,
				approval: approval,
				publish: publish,
				category: category._id,
				categorytitle: category.title,
			});

			const post = await newPost.save();

			if (user.isAdmin) {
				res.status(200).json('Post Published successfully.');
			} else {
				res.status(200).json('Post Created and send to approval.');
			}
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	}
);

//@ PUT   api/posts/:id
//@ desc   edit a post
//@ access private

router.put(
	'/:id',
	[
		auth,
		upload.single('postImage'),
		[
			check('title', 'title is required').not().isEmpty(),
			check('detail', 'detail is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const category = await Category.findOne({ title: req.body.category });
		if (!category) {
			return res.status(400).json({ error: 'Category is required' });
		}
		try {
			let image = '';

			if (req.file !== undefined) {
				img = req.file.path;
				image = img.split('\\').join('/');
			} else {
				image = 'images/posts/default-image.png';
			}
			var post = await Post.findById(req.params.id);

			if (req.user.admin || post.user.toString() == req.user.id) {
				newPost = await Post.findByIdAndUpdate(req.params.id, {
					title: req.body.title,
					detail: req.body.detail,
					image: image,
					category: category._id,
					categorytitle: category.title,
				});
			} else {
				res.status(401).send('Unauthorized Access');
			}
			var respost = await Post.findById(req.params.id);
			res.status(200).json(respost);
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @ route  PUT api/posts/:id/approve
//@ desc    Approve the post
//@ access  private

router.put('/:id/approve', admin, async (req, res) => {
	try {
		var posts = await Post.findById(req.params.id);

		if (posts) {
			await Post.findByIdAndUpdate(req.params.id, {
				approval: false,
				publish: req.body.publish,
			});

			res.status(200).json('Post Updated');
		} else {
			res.status(404).json('Post not found');
		}
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

// @ route  PUT api/posts/:id/approval
//@ desc    reApproval request the post
//@ access  private

router.put('/:id/approval', auth, async (req, res) => {
	try {
		var posts = await Post.findById(req.params.id);

		if (posts) {
			await Post.findByIdAndUpdate(req.params.id, {
				approval: req.body.approval,
			});

			res.status(200).json('Post Updated');
		} else {
			res.status(404).json('Post not found');
		}
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

// @ route  PUT api/posts/:id/draft
//@ desc    change publish post to draft
//@ access  private

router.put('/:id/draft', auth, async (req, res) => {
	try {
		var posts = await Post.find({ _id: req.params.id, publish: true });

		if (posts) {
			await Post.findByIdAndUpdate(req.params.id, {
				publish: false,
			});

			res.status(200).json('Post Updated');
		} else {
			res.status(404).json('Post not found');
		}
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

// @ route  GET api/posts
//@ desc    list all the posts with publish true
//@ access  public

router.get('/', async (req, res) => {
	try {
		const posts = await Post.find({ publish: true })
			.populate('user', 'image')
			.sort('-createdAt');
		res.json(posts);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

// @ route  GET api/posts/published
//@ desc    list all the posts with publish true
//@ access  private

router.get('/publish', auth, async (req, res) => {
	if (req.user.admin) {
		try {
			const posts = await Post.find({ publish: true }).sort('-createdAt');
			res.json(posts);
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	} else {
		try {
			const posts = await Post.find({
				user: req.user.id,
				publish: true,
			}).sort('-createdAt');
			res.json(posts);
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	}
});

// @ route  GET api/posts/draft
//@ desc    list all the posts with publish false
//@ access  private

router.get('/draft', auth, async (req, res) => {
	if (req.user.admin) {
		try {
			const posts = await Post.find({ publish: false, approval: false }).sort(
				'-createdAt'
			);
			res.json(posts);
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	} else {
		try {
			const posts = await Post.find({
				user: req.user.id,
				publish: false,
				approval: false,
			}).sort('-createdAt');
			res.json(posts);
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	}
});

// @ route  GET api/posts/pending
//@ desc    list all the posts with approval true
//@ access  private

router.get('/pending', auth, async (req, res) => {
	if (req.user.admin) {
		try {
			const posts = await Post.find({ approval: true }).sort('-createdAt');
			res.json(posts);
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	} else {
		try {
			const posts = await Post.find({
				user: req.user.id,
				approval: true,
			}).sort('-createdAt');
			res.json(posts);
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	}
});

// @ route  GET api/posts/:slug
//@ desc    post detail by slug
//@ access  public

router.get('/:slug', async (req, res) => {
	try {
		const post = await Post.findOne({ slug: req.params.slug }).populate(
			'user',
			'image'
		);
		if (!post) {
			return res.status(400).json({ msg: 'post not found' });
		}

		res.json(post);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   DELETE api/posts/:id
// @desc    DELETE a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}

		//check user
		if (!req.user.admin || post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' });
		}

		await post.remove();

		res.json('Post Deleted Successfully');
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found' });
		}
		res.status(500).send('Server Error');
	}
});

// @ route  put api/post/like/:id
//@ desc    like post by post id
//@ access  private

router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (
			post.likes.filter(like => like.user.toString() === req.user.id).length > 0
		) {
			return res.status(400).json({ msg: 'Post already liked' });
		}

		if (
			post.unlikes.filter(unlike => unlike.user.toString() === req.user.id)
				.length === 0
		) {
			post.likes.unshift({ user: req.user.id });

			await post.save();
			plike = post.likes;
			punlike = post.unlikes;
			return res.json({ plike, punlike });
		}

		//Get remove index
		const removeIndex = post.unlikes
			.map(unlike => unlike.user.toString())
			.indexOf(req.user.id);
		post.unlikes.splice(removeIndex, 1);
		await post.save();
		plike = post.likes;
		punlike = post.unlikes;
		return res.json({ plike, punlike });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   PUT api/posts/unlike/:id
// @desc    UnLike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (
			post.unlikes.filter(unlike => unlike.user.toString() === req.user.id)
				.length > 0
		) {
			return res.status(400).json({ msg: 'Post already unliked' });
		}

		if (
			post.likes.filter(like => like.user.toString() === req.user.id).length ===
			0
		) {
			post.unlikes.unshift({ user: req.user.id });

			await post.save();
			plike = post.likes;
			punlike = post.unlikes;
			return res.json({ plike, punlike });
		}

		//Get remove index
		const removeIndex = post.likes
			.map(like => like.user.toString())
			.indexOf(req.user.id);
		post.likes.splice(removeIndex, 1);
		await post.save();
		plike = post.likes;
		punlike = post.unlikes;
		return res.json({ plike, punlike });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

//@ GET    api/posts/comment/:id
//@ desc   add a post comment
//@ access private

router.post(
	'/comment/:id',
	[auth, [check('text', 'text is required').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');
			const post = await Post.findById(req.params.id).populate('user', 'email');

			const newComment = {
				text: req.body.text,
				name: user.name,
				user: user.id,
			};

			post.comments.unshift(newComment);

			await post.save();
			res.json(post.comments);

			if (post.user != req.user.id) {
				var mailOptions = {
					from: 'please.donot.replym3@gmail.com',
					to: post.user.email,
					subject: 'Comments on your post',
					text:
						'Dear  ' +
						post.name +
						', \n\n You have recevied some new comments on your post  ' +
						post.title +
						'\n\n Click on the below link to see comments\n' +
						'http://' +
						req.headers.host +
						'/post/' +
						post.slug +
						'\n\n' +
						'\n',
				};
				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					}
				});
			}
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    DELETE a comment
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		//pull out comment
		const comment = post.comments.find(
			comment => comment.id === req.params.comment_id
		);

		// Make sure comment exists
		if (!comment) {
			return res.status(404).json({ msg: ' Comment does not exists ' });
		}
		//check user
		if (
			req.user.admin ||
			comment.user.toString() == req.user.id ||
			post.user.toString() == req.user.id
		) {
			post.comments.remove(comment);
			post.save();

			res.json('Comment Removed');
		} else {
			return res.status(401).json({ msg: 'User not authorized' });
		}
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Comment not found' });
		}
		res.status(500).send('Server Error');
	}
});

// @ route  GET api/post/user/:id
//@ desc    post detail by userid
//@ access  public

router.get('/user/:id', async (req, res) => {
	try {
		const post = await Post.find({ user: req.params.id });
		if (!post) {
			return res.status(400).json({ msg: 'post not found' });
		}

		res.json(post);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

// @ route  GET api/posts/count/all
//@ desc    total number of post
//@ access  private

router.get('/count/all', auth, async (req, res) => {
	try {
		if (req.user.admin) {
			const dpost = await Post.find({
				publish: false,
				approval: false,
			}).countDocuments();
			const ppost = await Post.find({ approval: true }).countDocuments();
			const tuser = (await User.find().countDocuments()) - 1;

			return res.status(200).json({ dpost, ppost, tuser });
		}
		const dpost = await Post.find({
			publish: false,
			approval: false,
			user: req.user.id,
		}).countDocuments();
		const ppost = await Post.find({
			approval: true,
			user: req.user.id,
		}).countDocuments();
		res.status(200).json({ dpost, ppost });
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

// @ route  GET api/posts/search/:name
//@ desc    search the post
//@ access  public

router.get('/search/:name', async (req, res) => {
	try {
		var regex = new RegExp(req.params.name, 'i');
		const posts = await Post.find({ title: regex, publish: true })
			.populate('user', 'image')
			.sort('-createdAt');
		res.json(posts);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

// @ route  GET api/posts/search/:name
//@ desc    search the post from dashboard
//@ access  private

router.get('/search/published/:name', auth, async (req, res) => {
	try {
		var regex = new RegExp(req.params.name, 'i');
		if (req.user.admin) {
			const posts = await Post.find({ title: regex, publish: true }).sort(
				'-createdAt'
			);
			return res.json(posts);
		}
		const posts = await Post.find({
			title: regex,
			publish: true,
			user: req.user.id,
		}).sort('-createdAt');
		res.json(posts);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
