import express from 'express';

import {
	deleteNotification,
	getNotificationById,
	getNotifications,
	markNotificationAsRead,
} from '#controllers/notification.controller.js';

import { protect } from '#middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').get(protect, getNotifications);

router
	.route('/:id')
	.get(protect, getNotificationById)
	.delete(protect, deleteNotification);

router.route('/:id/read').put(protect, markNotificationAsRead);

export default router;