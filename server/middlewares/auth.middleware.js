import jwt from 'jsonwebtoken';

import UserModel from '#models/user.model.js';

const protect = async (req, res, next) => {
	let token;

	token = req.cookies.jwt;

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			req.user = await UserModel.findById(decoded.id).select('-password');

			if (!req.user) {
				res.status(401);
				throw new Error('User not found.');
			}

			next();
		} catch (error) {
			console.error(error);

			res.status(401);
			throw new Error('Not authorized, token failed!');
		}
	} else {
		res.status(401);
		throw new Error('Not authorized, no token');
	}
};

const admin = (req, res, next) => {
	if (req.user && req.user.role === 'admin') {
		next();
	} else {
		res.status(403);
		throw new Error('Not authorized as an administrator.');
	}
};

const security = (req, res, next) => {
	if (req.user && req.user.role === 'security') {
		next();
	} else {
		res.status(403);
		throw new Error('Not authorized as security.');
	}
};

const resident = (req, res, next) => {
	if (req.user && req.user.role === 'resident') {
		next();
	} else {
		res.status(403);
		throw new Error('Not authorized as a resident.');
	}
};

export { admin, protect, resident, security };