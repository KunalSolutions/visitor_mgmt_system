import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import socket from '@services/socket';

const SocketSetup = () => {
	const { userInfo } = useSelector(
		(state) => state.auth
	);

	useEffect(() => {
		if (!userInfo?._id || !userInfo?.role) {
			socket.disconnect();
			return;
		}

		socket.connect();

		const handleConnect = () => {
			console.log(
				'Socket connected:',
				socket.id
			);

			socket.emit('joinRoom', {
				role: userInfo.role,
				userId: userInfo._id,
			});
		};

		socket.on('connect', handleConnect);

		if (socket.connected) {
			handleConnect();
		}

		return () => {
			socket.off('connect', handleConnect);
			socket.disconnect();
		};
	}, [userInfo?._id, userInfo?.role]);

	return null;
};

export default SocketSetup;