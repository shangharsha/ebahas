const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
	//Get token from header
	const token = req.params.token;

	//check if not token
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied' });
	}

	//verify token
	try {
		const decode = jwt.verify(token, config.get('jwtResetPassword'));
		next();
	} catch (err) {
		res.status(401).json({ msg: 'Token Invalid or Expired' });
	}
};
