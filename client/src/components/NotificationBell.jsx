import { Bell } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useGetNotificationsQuery } from '@slices/notificationApiSlice';

const NotificationBell = () => {
	const { userInfo } = useSelector((state) => state.auth);

	const { data: notifications = [] } =
		useGetNotificationsQuery(undefined, {
			skip: !userInfo,
		});

	const unreadCount = notifications.filter(
		(notification) => !notification.isRead
	).length;

	return (
		<Link
			to='/notifications'
			className='relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900'
			title='Notifications'>
			<Bell size={21} />

			{unreadCount > 0 && (
				<span className='absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white'>
					{unreadCount > 99 ? '99+' : unreadCount}
				</span>
			)}
		</Link>
	);
};

export default NotificationBell;