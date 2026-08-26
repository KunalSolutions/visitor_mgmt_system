import UserModel from '#models/user.model.js';
import generateToken from '../generate-token.utils.js';

/**
 * @desc		Auth user
 * @route		POST /api/v1/users/login
 * @access	public
 */
const authUser = async (req, res) => {
	const { email, password } = req.body;

	const user = await UserModel.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		if (user.status !== 'Active') {
			res.status(403);
			throw new Error('User account is inactive');
		}

		user.lastLogin = new Date();
		await user.save();

		const token = generateToken(res, user._id);

		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			mobile: user.mobile,
			role: user.role,
			flatNumber: user.flatNumber,
			floorNumber: user.floorNumber,
			photo: user.photo,
			status: user.status,
			token,
		});
	} else {
		res.status(401);
		throw new Error('Invalid email or password');
	}
};

/**
 * @desc		Create user
 * @route		POST /api/v1/users
 * @access	private/admin
 */
const registerUser = async (req, res) => {
	const {
		name,
		email,
		mobile,
		password,
		role,
		flatNumber,
		floorNumber,
		photo,
		status,
	} = req.body;

	const userExists = await UserModel.findOne({
		$or: [{ email }, { mobile }],
	});

	if (userExists) {
		res.status(400);
		throw new Error('User with this email or mobile already exists');
	}

	const user = await UserModel.create({
		name,
		email,
		mobile,
		password,
		role,
		flatNumber,
		floorNumber,
		photo,
		status,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			mobile: user.mobile,
			role: user.role,
			flatNumber: user.flatNumber,
			floorNumber: user.floorNumber,
			photo: user.photo,
			status: user.status,
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
};

/**
 * @desc		Logout user
 * @route		POST /api/v1/users/logout
 * @access	private
 */
const logoutUser = async (req, res) => {
	res.cookie('jwt', '', {
		httpOnly: true,
		expires: new Date(0),
	});

	res.status(200).json({
		message: 'User logged out successfully',
	});
};

/**
 * @desc		Get user profile
 * @route		GET /api/v1/users/profile
 * @access	private
 */
const getUserProfile = async (req, res) => {
	const user = await UserModel.findById(req.user._id).select('-password');

	if (user) {
		res.status(200).json(user);
	} else {
		res.status(404);
		throw new Error('User not found');
	}
};

/**
 * @desc		Update user profile
 * @route		PUT /api/v1/users/profile
 * @access	private
 */
const updateUserProfile = async (req, res) => {
	const user = await UserModel.findById(req.user._id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.mobile = req.body.mobile || user.mobile;
		user.photo = req.body.photo || user.photo;

		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.status(200).json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			mobile: updatedUser.mobile,
			role: updatedUser.role,
			flatNumber: updatedUser.flatNumber,
			floorNumber: updatedUser.floorNumber,
			photo: updatedUser.photo,
			status: updatedUser.status,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
};

/**
 * @desc		Get all users
 * @route		GET /api/v1/users
 * @access	private/admin
 */
const getUsers = async (req, res) => {
	const users = await UserModel.find({}).select('-password');

	res.status(200).json(users);
};

/**
 * @desc		Get user by ID
 * @route		GET /api/v1/users/:id
 * @access	private/admin
 */
const getUserById = async (req, res) => {
	const user = await UserModel.findById(req.params.id).select('-password');

	if (user) {
		res.status(200).json(user);
	} else {
		res.status(404);
		throw new Error('User not found');
	}
};

/**
 * @desc		Delete user
 * @route		DELETE /api/v1/users/:id
 * @access	private/admin
 */
const deleteUser = async (req, res) => {
	const user = await UserModel.findById(req.params.id);

	if (user) {
		if (user.role === 'admin') {
			res.status(400);
			throw new Error('You cannot delete an admin user');
		}

		await UserModel.deleteOne({ _id: req.params.id });

		res.status(200).json({
			message: 'User deleted successfully',
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
};

/**
 * @desc		Update user
 * @route		PUT /api/v1/users/:id
 * @access	private/admin
 */
const updateUser = async (req, res) => {
	const user = await UserModel.findById(req.params.id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.mobile = req.body.mobile || user.mobile;
		user.role = req.body.role || user.role;
		user.flatNumber = req.body.flatNumber || user.flatNumber;
		user.floorNumber = req.body.floorNumber || user.floorNumber;
		user.photo = req.body.photo || user.photo;
		user.status = req.body.status || user.status;

		const updatedUser = await user.save();

		res.status(200).json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			mobile: updatedUser.mobile,
			role: updatedUser.role,
			flatNumber: updatedUser.flatNumber,
			floorNumber: updatedUser.floorNumber,
			photo: updatedUser.photo,
			status: updatedUser.status,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
};

export {
	authUser,
	deleteUser,
	getUserById,
	getUserProfile,
	getUsers,
	logoutUser,
	registerUser,
	updateUser,
	updateUserProfile,
};