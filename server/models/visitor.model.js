import mongoose from 'mongoose';

const visitorSchema = mongoose.Schema(
	{
		visitorName: {
			type: String,
			required: ["Visitor's name is required."],
			trim: true,
		},

		mobile: {
			type: String,
			required: ["Visitor's mobile number is required."],
			trim: true,
		},

		photo: {
			type: String,
			default: '',
		},

		meetWith: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserModel',
			required: ['Person to meet is required.'],
		},

		purpose: {
			type: String,
			required: ['Visit purpose is required.'],
			trim: true,
		},

		status: {
			type: String,
			enum: ['Pending', 'Approved', 'Rejected'],
			default: 'Pending',
		},
		remark: String,
	},
	{
		timestamps: true,
		collection: 'visitors',
	}
);

const VisitorModel = mongoose.model('VisitorModel', visitorSchema);

export default VisitorModel;