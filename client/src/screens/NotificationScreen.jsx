import {
	Check,
	Clock3,
	Info,
	UserRound,
	X,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import {
	useGetNotificationsQuery,
	useMarkNotificationAsReadMutation,
} from '@slices/notificationApiSlice';

const NotificationScreen = () => {
	const {
		data: notifications = [],
		isLoading,
	} = useGetNotificationsQuery();

	const [
		markNotificationAsRead,
		{ isLoading: isMarkingRead },
	] = useMarkNotificationAsReadMutation();

	const unreadNotifications = useMemo(
		() =>
			notifications.filter(
				(notification) => !notification.isRead
			),
		[notifications]
	);

	const readNotifications = useMemo(
		() =>
			notifications.filter(
				(notification) => notification.isRead
			),
		[notifications]
	);

	const handleMarkAsRead = async (notificationId) => {
		try {
			await markNotificationAsRead(
				notificationId
			).unwrap();
		} catch (error) {
			console.error(error);
		}
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleString();
	};

	const getIcon = (notification) => {
		if (
			notification.type?.toLowerCase().includes('visitor')
		) {
			if (
				notification.visitor?.status === 'Approved'
			) {
				return (
					<div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600'>
						<Check size={20} />
					</div>
				);
			}

			if (
				notification.visitor?.status === 'Rejected'
			) {
				return (
					<div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600'>
						<X size={20} />
					</div>
				);
			}

			return (
				<div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600'>
					<Clock3 size={20} />
				</div>
			);
		}

		return (
			<div className='flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600'>
				<Info size={20} />
			</div>
		);
	};

	const NotificationItem = ({ notification }) => {
		const isUnread = !notification.isRead;

		return (
			<div
				className={`flex gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0 ${
					isUnread
						? 'bg-indigo-50/30'
						: 'bg-white'
				}`}>
				<div className='shrink-0'>
					{getIcon(notification)}
				</div>

				<div className='min-w-0 flex-1'>
					<div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
						<div>
							<div className='flex items-center gap-2'>
								<h3 className='text-sm font-semibold text-slate-900'>
									{notification.title ||
										'Notification'}
								</h3>

								{isUnread && (
									<span className='h-2 w-2 rounded-full bg-indigo-600' />
								)}
							</div>

							<p className='mt-1 text-sm leading-6 text-slate-600'>
								{notification.message}
							</p>
						</div>

						<span className='shrink-0 text-xs text-slate-400'>
							{formatDate(
								notification.createdAt
							)}
						</span>
					</div>

					{notification.visitor && (
						<div className='mt-3 rounded-lg border border-slate-200 bg-white p-3'>
							<div className='flex items-center gap-3'>
								<div className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500'>
									<UserRound size={17} />
								</div>

								<div>
									<p className='text-sm font-medium text-slate-800'>
										{
											notification
												.visitor
												.visitorName
										}
									</p>

									<p className='text-xs text-slate-500'>
										{
											notification
												.visitor
												.purpose
										}
									</p>
								</div>
							</div>
						</div>
					)}

					<div className='mt-3 flex flex-wrap items-center gap-3'>
						{isUnread && (
							<button
								type='button'
								disabled={isMarkingRead}
								onClick={() =>
									handleMarkAsRead(
										notification._id
									)
								}
								className='text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50'>
								{isMarkingRead
									? 'Marking...'
									: 'Mark as read'}
							</button>
						)}

						{notification.visitor?._id && (
							<Link
								to={`/resident/visitors/${notification.visitor._id}`}
								className='text-xs font-medium text-slate-600 hover:text-slate-900'>
								View visitor
							</Link>
						)}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div>
				<h1 className='text-2xl font-semibold text-slate-900'>
					Notifications
				</h1>

				<p className='mt-1 text-sm text-slate-500'>
					Stay updated with visitor requests and system
					notifications.
				</p>
			</div>

			{/* Summary */}
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
				<div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
					<p className='text-sm text-slate-500'>
						Total Notifications
					</p>

					<p className='mt-2 text-2xl font-semibold text-slate-900'>
						{notifications.length}
					</p>
				</div>

				<div className='rounded-xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm'>
					<p className='text-sm text-indigo-600'>
						Unread
					</p>

					<p className='mt-2 text-2xl font-semibold text-indigo-900'>
						{unreadNotifications.length}
					</p>
				</div>

				<div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
					<p className='text-sm text-slate-500'>
						Read
					</p>

					<p className='mt-2 text-2xl font-semibold text-slate-900'>
						{readNotifications.length}
					</p>
				</div>
			</div>

			{/* Notifications */}
			<div className='rounded-xl border border-slate-200 bg-white shadow-sm'>
				<div className='border-b border-slate-200 px-5 py-4'>
					<h2 className='font-semibold text-slate-900'>
						All Notifications
					</h2>

					<p className='mt-1 text-xs text-slate-500'>
						Your latest notifications.
					</p>
				</div>

				{isLoading ? (
					<div className='px-5 py-12 text-center text-sm text-slate-500'>
						Loading notifications...
					</div>
				) : notifications.length === 0 ? (
					<div className='px-5 py-14 text-center'>
						<div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400'>
							<Info size={24} />
						</div>

						<h3 className='mt-4 text-sm font-semibold text-slate-800'>
							No notifications
						</h3>

						<p className='mt-1 text-sm text-slate-500'>
							You're all caught up.
						</p>
					</div>
				) : (
					<div>
						{unreadNotifications.length > 0 && (
							<div className='border-b border-slate-200'>
								<div className='bg-slate-50 px-5 py-3'>
									<h3 className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
										Unread
									</h3>
								</div>

								{unreadNotifications.map(
									(notification) => (
										<NotificationItem
											key={
												notification._id
											}
											notification={
												notification
											}
										/>
									)
								)}
							</div>
						)}

						{readNotifications.length > 0 && (
							<div>
								<div className='bg-slate-50 px-5 py-3'>
									<h3 className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
										Previously Read
									</h3>
								</div>

								{readNotifications.map(
									(notification) => (
										<NotificationItem
											key={
												notification._id
											}
											notification={
												notification
											}
										/>
									)
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default NotificationScreen;