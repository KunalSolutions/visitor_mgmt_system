import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "User's full name is required."],
			trim: true,
		},

		email: {
			type: String,
			required: [true, "User's email is required."],
			unique: [true, "User's email must be unique."],
			lowercase: true,
			trim: true,
		},

		mobile: {
			type: String,
			required: [true, "User's mobile number is required."],
			unique: [true, "User's mobile number must be unique."],
			trim: true,
		},

		password: {
			type: String,
			required: [true, "User's password is required."],
			minlength: [6, 'Password must be at least 6 characters.'],
		},

		role: {
			type: String,
			enum: ['admin', 'security', 'resident'],
			required: [true, 'User role is required.'],
			default: 'resident',
		},

		flatNumber: {
			type: String,
			trim: true,
			default: null,
		},

		floorNumber: {
			type: Number,
			default: null,
		},

		photo: {
			type: String,
			default: '',
		},

		expoPushToken: {
			type: String,
			default: '',
			trim: true,
		},

		webPushSubscription: {
			type: Object,
			default: null,
		},

		status: {
			type: String,
			enum: ['Active', 'Inactive'],
			default: 'Active',
		},

		lastLogin: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
		collection: 'users',
	}
);

userSchema.methods.matchPassword = async function (enteredPassword) {
	return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
	if (!this.isModified('password')) {
		return;
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;