import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
	{
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserModel',
			required: [true, 'Notification recipient is required.'],
		},

		visitor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'VisitorModel',
			required: [true, 'Visitor reference is required.'],
		},

		title: {
			type: String,
			required: [true, 'Notification title is required.'],
			trim: true,
		},

		message: {
			type: String,
			required: [true, 'Notification message is required.'],
			trim: true,
		},

		type: {
			type: String,
			enum: ['Visitor'],
			default: 'Visitor',
		},

		isRead: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		collection: 'notifications',
	}
);

const NotificationModel = mongoose.model(
	'NotificationModel',
	notificationSchema
);

export default NotificationModel;