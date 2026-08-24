import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(
			`MongoDB connected: ${conn.connection.host}`.bold.cyan.underline
		);
	} catch (error) {
		console.error(`Error: ${error.message}`.bold.red.underline);
		process.exit(1);
	}
};

export default connectDB;
