import { Bell, LogOut, Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { logout } from '@slices/authSlice';
import { useLogoutMutation } from '@slices/userApiSlice';
import { useGetNotificationsQuery } from '@slices/notificationApiSlice';

const Header = ({ setSidebarOpen }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { userInfo } = useSelector((state) => state.auth);

	const [logoutApiCall] = useLogoutMutation();

	const { data: notifications = [] } =
		useGetNotificationsQuery(undefined, {
			skip: !userInfo,
		});

	const unreadCount = notifications.filter(
		(notification) => !notification.isRead
	).length;

	const handleLogout = async () => {
		try {
			await logoutApiCall().unwrap();
		} catch (error) {
			console.error(error);
		} finally {
			dispatch(logout());

			toast.success('Logged out successfully');

			navigate('/login');
		}
	};

	return (
		<header className='sticky top-0 z-40 h-16 border-b border-slate-200 bg-white'>
			<div className='flex h-full items-center justify-between px-4 sm:px-6 lg:px-8'>
				{/* Left */}
				<div className='flex items-center gap-3'>
					<button
						type='button'
						onClick={() => setSidebarOpen?.(true)}
						className='rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden'>
						<Menu size={22} />
					</button>

					<div>
						<h1 className='text-lg font-semibold text-slate-900'>
							Sunrise Towers
						</h1>

						<p className='hidden text-xs text-slate-500 sm:block'>
							Visitor Management System
						</p>
					</div>
				</div>

				{/* Right */}
				<div className='flex items-center gap-3 sm:gap-5'>
					{/* Notifications */}
					<Link
						to='/notifications'
						aria-label='Notifications'
						className='relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900'>
						<Bell size={21} />

						{unreadCount > 0 && (
							<span className='absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white'>
								{unreadCount > 99
									? '99+'
									: unreadCount}
							</span>
						)}
					</Link>

					<div className='hidden h-8 w-px bg-slate-200 sm:block' />

					{/* User */}
					<div className='hidden text-right sm:block'>
						<p className='text-sm font-medium text-slate-900'>
							{userInfo?.name}
						</p>

						<p className='text-xs capitalize text-slate-500'>
							{userInfo?.role}
						</p>
					</div>

					{/* Logout */}
					<button
						type='button'
						onClick={handleLogout}
						className='fleax items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900'>
						<LogOut size={18} />

						<span className='hidden sm:inline'>
							Logout
						</span>
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;