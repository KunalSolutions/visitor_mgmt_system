import VisitorModel from '#models/visitor.model.js';
import NotificationModel from '#models/notification.model.js';
import sendWebPushNotification from '../utils/web-push.utils.js';

/**
 * @desc		Create visitor
 * @route		POST /api/v1/visitors
 * @access	private/security
 */
const createVisitor = async (req, res) => {
	const {
		visitorName,
		mobile,
		photo,
		meetWith,
		purpose,
	} = req.body;

	const resident = await UserModel.findById(meetWith);

	if (!resident || resident.role !== 'resident') {
		res.status(404);
		throw new Error('Resident not found');
	}

	const visitor = await VisitorModel.create({
		visitorName,
		mobile,
		photo,
		meetWith,
		purpose,
		status: 'Pending',
		remark: '',
	});

	await NotificationModel.create({
		recipient: meetWith,
		visitor: visitor._id,
		title: 'New Visitor Request',
		message: `${visitorName} is waiting to meet you.`,
		type: 'Visitor',
	});

	if (resident.webPushSubscription) {
		await sendWebPushNotification(
			resident.webPushSubscription,
			{
				title: 'New Visitor Request',
				body: `${visitorName} is waiting to meet you.`,
				url: '/resident/dashboard',
			}
		);
	}

	res.status(201).json(visitor);
};

/**
 * @desc		Get all visitors
 * @route		GET /api/v1/visitors
 * @access	private
 */
const getVisitors = async (req, res) => {
	const visitors = await VisitorModel.find({})
		.populate('meetWith', 'name email mobile flatNumber floorNumber')
		.sort({ createdAt: -1 });

	res.status(200).json(visitors);
};

/**
 * @desc		Get visitor by ID
 * @route		GET /api/v1/visitors/:id
 * @access	private
 */
const getVisitorById = async (req, res) => {
	const visitor = await VisitorModel.findById(req.params.id).populate(
		'meetWith',
		'name email mobile flatNumber floorNumber'
	);

	if (visitor) {
		res.status(200).json(visitor);
	} else {
		res.status(404);
		throw new Error('Visitor not found');
	}
};

/**
 * @desc		Update visitor status
 * @route		PUT /api/v1/visitors/:id/status
 * @access	private
 */
const updateVisitorStatus = async (req, res) => {
	const { status, remark } = req.body;

	const visitor = await VisitorModel.findById(req.params.id);

	if (!visitor) {
		res.status(404);
		throw new Error('Visitor not found');
	}

	if (!['Approved', 'Rejected'].includes(status)) {
		res.status(400);
		throw new Error('Invalid visitor status');
	}

	if (visitor.meetWith.toString() !== req.user._id.toString()) {
		res.status(403);
		throw new Error('You are not authorized to update this visitor');
	}

	visitor.status = status;
	visitor.remark = remark?.trim() || '';

	const updatedVisitor = await visitor.save();

	res.status(200).json(updatedVisitor);
};

/**
 * @desc		Delete visitor
 * @route		DELETE /api/v1/visitors/:id
 * @access	private/admin
 */
const deleteVisitor = async (req, res) => {
	const visitor = await VisitorModel.findById(req.params.id);

	if (visitor) {
		await VisitorModel.deleteOne({ _id: req.params.id });

		res.status(200).json({
			message: 'Visitor deleted successfully',
		});
	} else {
		res.status(404);
		throw new Error('Visitor not found');
	}
};

export {
	createVisitor,
	deleteVisitor,
	getVisitorById,
	getVisitors,
	updateVisitorStatus,
};