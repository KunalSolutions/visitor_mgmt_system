import colors from 'colors';
import dotenv from 'dotenv';

import connectDB from '#config/db.js';
import users from '#data/users.data.js';
import UserModel from '#models/user.model.js';

dotenv.config();

connectDB();

const importData = async () => {
	try {
		await UserModel.deleteMany();

		await UserModel.insertMany(users);

		console.log('Users imported'.bold.green.inverse);
		process.exit();
	} catch (error) {
		console.error(`${error.message}`.bold.red.underline);
		process.exit(1);
	}
};

const destroyData = async () => {
	try {
		await UserModel.deleteMany();

		console.log('Users destroyed'.bold.red.inverse);
		process.exit();
	} catch (error) {
		console.error(`${error.message}`.bold.red.underline);
		process.exit(1);
	}
};

if (process.argv[2] === '-d') {
	destroyData();
} else {
	importData();
}