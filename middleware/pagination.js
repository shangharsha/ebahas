const User = require('../models/User');
const Post = require('../models/Post');

const MAX_LIMIT_PER_PAGE = 50;

exports.paginatedResults = function (model) {
	return async (req, res, next) => {
		const page = parseInt(req.query.page);
		const maxlimit = parseInt(req.query.limit);
		limit = Math.min(maxlimit, MAX_LIMIT_PER_PAGE);

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const results = {};

		if (endIndex < (await model.countDocuments().exec())) {
			results.next = {
				page: page + 1,
				limit: limit,
			};
		}

		if (startIndex > 0) {
			results.previous = {
				page: page - 1,
				limit: limit,
			};
		}

		try {
			results.results = await model
				.find()
				.sort('-createdAt')
				.limit(limit)
				.skip(startIndex)
				.exec();
			res.paginatedResults = results;
			next();
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server Error');
		}
	};
};
