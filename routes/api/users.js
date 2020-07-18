const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const resetverify = require('../../middleware/resetverify');
const config = require('config');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const User = require('../../models/User');
const multer = require('multer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: config.get('username'),
		pass: config.get('password'),
	},
});

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'images/users/');
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

// @ route  POST api/users
// @ desc   add new user
// @ access public

router.post(
	'/',
	upload.single('postImage'),
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Please enter a valid email').isEmail(),
		check('address', 'Address is required').not().isEmpty(),
		check('password', 'Enter a password with 6 or more characters').isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, password, address, phone } = req.body;

		var emailid = req.body.email;
		var email = emailid.toLowerCase();

		try {
			let user = await User.findOne({ email });

			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: ' User Already Exists ' }] });
			}

			let image = '';

			if (req.file !== undefined) {
				img = req.file.path;
				image = img.split('\\').join('/');
			} else {
				image = 'images/users/default-image.png';
			}

			let superuser = await User.findOne({ isSuperUser: true });
			var suser = false;

			if (!superuser) {
				suser = true;
			}

			user = new User({
				name,
				email,
				address,
				phone,
				password,
				image: image,
				isSuperUser: suser,
				isAdmin: suser,
			});

			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			await user.save();

			const payload = {
				user: {
					id: user.id,
					admin: user.admin,
				},
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: '60m' },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @ route  POST api/users/changepassword
//@ desc    change the password
//@ access  private

router.post(
	'/changepassword',
	auth,
	[
		check('oldpassword', 'Old password is required').isLength({
			min: 6,
		}),
		check(
			'newpassword',
			'Enter new password with minimun  6 characters'
		).isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const user = await User.findById(req.user.id);
			if (!user) {
				res.status(500).json({ msg: 'User not found' });
			}

			const isMatch = await bcrypt.compare(req.body.oldpassword, user.password);
			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Password doesnot match' }] });
			}

			const salt = await bcrypt.genSalt(10);

			newpassword = await bcrypt.hash(req.body.newpassword, salt);
			user.password = newpassword;
			user.save();
			res.json('Password succesfully changed');
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @ route  post api/users/forgetpassword
//@ desc    forgetpassword
//@ access  public

router.post(
	'/forgetpassword',
	[check('email', 'Please enter a valid Email').isEmail()],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const user = await User.findOne({ email: req.body.email.toLowerCase() });
			if (user) {
				const payload = {
					user: {
						id: user.id,
					},
				};

				const token = jwt.sign(payload, config.get('jwtResetPassword'), {
					expiresIn: '10m',
				});

				user.resetPasswordLink = token;
				user.save();

				var mailOptions = {
					from: 'please.donot.replym3@gmail.com',
					to: req.body.email,
					subject: 'Forget Password',
					text:
						'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
						'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
						'http://' +
						req.headers.host +
						'/resetpassword/' +
						token +
						'\n\n' +
						'If you did not request this, please ignore this email and your password will remain unchanged.\n',
				};
				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						return res.json({
							success: 'Email Sent. Please check your inbox or spam folder',
						});
					}
				});
			} else {
				return res.json({ danger: 'user not found' });
			}
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @ route  POST api/users/resetpassword/:token
//@ desc    reset passowrd
//@ access  public
router.post(
	'/resetpassword/:token',
	resetverify,
	[
		check(
			'newpassword',
			'Enter new password with minimun  6 characters'
		).isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const user = await User.findOne({ resetPasswordLink: req.params.token });
			if (!user) {
				return res.status(400).json({ msg: 'Token Invalid or Expired' });
			}
			const salt = await bcrypt.genSalt(10);

			newpassword = await bcrypt.hash(req.body.newpassword, salt);
			user.password = newpassword;
			user.resetPasswordLink = '';
			user.save();
			return res.json({
				success:
					'Password Successfully reset. Now you can login with new password.',
			});
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @ route  GET api/users
//@ desc    list all the users
//@ access  private

router.get('/', admin, async (req, res) => {
	try {
		const users = await User.find({
			_id: { $ne: req.user.id },
			isSuperUser: { $ne: true },
		})
			.select('-password')
			.select('-isAdmin')
			.select('-isSuperUser')
			.sort('-createdAt');
		res.json(users);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

// @ route  DELETE api/users/:id
//@ desc    delete a user
//@ access  private

router.delete('/:id', admin, async (req, res) => {
	if (req.params.id.isSuperUser || req.user.id == req.params.id) {
		return res.status(400).send('User cannot be deleted');
	}

	var checkuser = await User.findById(req.params.id);

	if (!checkuser) {
		return res.status(400).send('User not found');
	}

	try {
		const users = await User.findOneAndDelete({
			_id: req.params.id,
		});
		res.json('User Deleted');
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

// @ route  GET api/users/:id
//@ desc    get user detail by id
//@ access  private

router.get('/:id', admin, async (req, res) => {
	var checkuser = await User.findById(req.params.id);

	if (!checkuser) {
		return res.status(400).send('User not found');
	}

	try {
		const user = await User.findById(req.params.id);
		res.json(user);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

// @ route  PUT api/users/:id
//@ desc    update a user
//@ access  private

router.put(
	'/:id',
	auth,
	upload.single('postImage'),
	[
		check('name', 'Name is required').not().isEmpty(),
		check('address', 'Address is required').not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, dob, address, phone } = req.body;

		try {
			if (req.user.admin || req.user.id == req.params.id) {
				let image = '';

				if (req.file !== undefined) {
					img = req.file.path;
					image = img.split('\\').join('/');

					await User.findByIdAndUpdate(req.params.id, {
						name: name,
						dob: dob,
						address: address,
						phone: phone,
						image: image,
					});

					const user = await User.findById(req.params.id).select('-password');
					return res.json(user);
				} else {
					var admin = req.body.Admin;
					if (!admin) {
						admin = false;
					}
					await User.findByIdAndUpdate(req.params.id, {
						name: name,
						address: address,
						phone: phone,
						dob: dob,
						isAdmin: admin,
					});
					const user = await User.findById(req.params.id).select('-password');
					return res.json(user);
				}
			} else {
				return res.status(400).send('Unauthorized access');
			}
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @ route  GET api/users/search/:name
//@ desc    search the user
//@ access  admin

router.get('/search/:name', admin, async (req, res) => {
	try {
		var regex = new RegExp(req.params.name, 'i');
		const users = await User.find({
			$or: [{ name: regex }, { email: regex }],
			isSuperUser: { $ne: true },
		})
			.populate('user', 'image')
			.sort('-createdAt');
		res.json(users);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
