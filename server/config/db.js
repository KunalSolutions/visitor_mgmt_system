import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

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
