import colors from "colors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from 'cors';

import connectDB from '#config/db.js';
import userRoutes from '#routes/user.route.js';
import visitorRoutes from '#routes/visitor.route.js';
import notificationRoutes from '#routes/notification.route.js';

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(
	cors({
		origin: [
			'http://localhost:3000',
			'http://localhost:8081',
			'https://visitor-management-system-eta.vercel.app',
		],
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1/users", userRoutes);
app.use('/api/v1/visitors', visitorRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Visitor Management System API is running...",
  });
});

app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}`.bold.yellow
  );
});