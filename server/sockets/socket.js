import { Server } from 'socket.io';

let io;

const initializeSocket = (httpServer) => {
	io = new Server(httpServer, {
		cors: {
			origin: [
				'http://localhost:3000',
				'http://localhost:8081',
				'https://visitor-management-system-eta.vercel.app',
			],
			credentials: true,
		},
	});

	io.on('connection', (socket) => {
		console.log(`Socket connected: ${socket.id}`);

		/**
		 * Join a role-based room
		 *
		 * Examples:
		 * admin
		 * security
		 * resident:<userId>
		 */
		socket.on('joinRoom', ({ role, userId }) => {
			if (!role) return;

			if (role === 'admin') {
				socket.join('admin');
			}

			if (role === 'security') {
				socket.join('security');
			}

			if (role === 'resident' && userId) {
				socket.join(`resident:${userId}`);
			}

			console.log(
				`Socket ${socket.id} joined room`,
				role === 'resident'
					? `resident:${userId}`
					: role
			);
		});

		socket.on('disconnect', (reason) => {
			console.log(
				`Socket disconnected: ${socket.id} - ${reason}`
			);
		});
	});

	return io;
};

const getIO = () => {
	if (!io) {
		throw new Error(
			'Socket.IO has not been initialized.'
		);
	}

	return io;
};

export {
	getIO,
	initializeSocket,
};