import express from 'express';

import {
	authUser,
	deleteUser,
	getUserById,
	getUserProfile,
	getUsers,
	logoutUser,
	registerUser,
	updatePushToken,
	updateUser,
	updateUserProfile,
	updateWebPushSubscription,
} from '#controllers/user.controller.js';

import { admin, protect } from '#middlewares/auth.middleware.js';

const router = express.Router();

router
	.route('/')
	.post(protect, admin, registerUser)
	.get(getUsers);

router.route('/login').post(authUser);

router.route('/logout').post(logoutUser);

router
	.route('/profile')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile);

router
	.route('/push-token')
	.put(protect, updatePushToken);

router
	.route('/push-subscription')
	.put(protect, updateWebPushSubscription);

router
	.route('/:id')
	.delete(protect, admin, deleteUser)
	.get(protect, admin, getUserById)
	.put(protect, admin, updateUser);

export default router;