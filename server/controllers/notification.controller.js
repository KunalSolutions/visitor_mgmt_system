import NotificationModel from '#models/notification.model.js';

/**
 * @desc		Get notifications
 * @route		GET /api/v1/notifications
 * @access	private
 */
const getNotifications = async (req, res) => {
	const notifications = await NotificationModel.find({
		recipient: req.user._id,
	})
		.populate({
			path: 'visitor',
			select: 'visitorName mobile photo meetWith purpose status remark createdAt',
		})
		.sort({ createdAt: -1 });

	res.status(200).json(notifications);
};

/**
 * @desc		Get notification by ID
 * @route		GET /api/v1/notifications/:id
 * @access	private
 */
const getNotificationById = async (req, res) => {
	const notification = await NotificationModel.findOne({
		_id: req.params.id,
		recipient: req.user._id,
	}).populate({
		path: 'visitor',
		select: 'visitorName mobile photo meetWith purpose status remark createdAt',
	});

	if (notification) {
		res.status(200).json(notification);
	} else {
		res.status(404);
		throw new Error('Notification not found');
	}
};

/**
 * @desc		Mark notification as read
 * @route		PUT /api/v1/notifications/:id/read
 * @access	private
 */
const markNotificationAsRead = async (req, res) => {
	const notification = await NotificationModel.findOne({
		_id: req.params.id,
		recipient: req.user._id,
	});

	if (notification) {
		notification.isRead = true;

		const updatedNotification = await notification.save();

		res.status(200).json(updatedNotification);
	} else {
		res.status(404);
		throw new Error('Notification not found');
	}
};

/**
 * @desc		Delete notification
 * @route		DELETE /api/v1/notifications/:id
 * @access	private
 */
const deleteNotification = async (req, res) => {
	const notification = await NotificationModel.findOne({
		_id: req.params.id,
		recipient: req.user._id,
	});

	if (notification) {
		await NotificationModel.deleteOne({
			_id: notification._id,
		});

		res.status(200).json({
			message: 'Notification deleted successfully',
		});
	} else {
		res.status(404);
		throw new Error('Notification not found');
	}
};

export {
	deleteNotification,
	getNotificationById,
	getNotifications,
	markNotificationAsRead,
};