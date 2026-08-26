import {
	 Bell,
	 Building2,
	 ChevronLeft,
	 LayoutDashboard,
	 LogOut,
	 Settings,
	 ShieldCheck,
	 Users,
	 UserRound,
	 UserRoundPlus,
	 X,
} from 'lucide-react';

import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { logout } from '@slices/authSlice';
import { useLogoutMutation } from '@slices/userApiSlice';

const Sidebar = ({ isOpen, setIsOpen }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { userInfo } = useSelector((state) => state.auth);

	const [logoutApiCall] = useLogoutMutation();

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

	const menuItems = {
		admin: [
			{
				name: 'Dashboard',
				path: '/admin/dashboard',
				icon: LayoutDashboard,
			},
			{
				name: 'Users',
				path: '/admin/users',
				icon: Users,
			},
			{
				name: 'Visitors',
				path: '/admin/visitors',
				icon: UserRound,
			},
		],

		security: [
			{
				name: 'Dashboard',
				path: '/security/dashboard',
				icon: LayoutDashboard,
			},
			{
				name: 'Register Visitor',
				path: '/security/visitors/create',
				icon: UserRoundPlus,
			},
			{
				name: 'Visitors',
				path: '/security/visitors',
				icon: UserRound,
			},
		],

		resident: [
			{
				name: 'Dashboard',
				path: '/resident/dashboard',
				icon: LayoutDashboard,
			},
			{
				name: 'Visitors',
				path: '/resident/visitors',
				icon: UserRound,
			},
			{
				name: 'Notifications',
				path: '/resident/notifications',
				icon: Bell,
			},
		],
	};

	const items = menuItems[userInfo?.role] || [];

	return (
		<>
			{isOpen && (
				<div
					className='fixed inset-0 z-40 bg-black/40 lg:hidden'
					onClick={() => setIsOpen(false)}
				/>
			)}

			<aside
				className={`
					fixed left-0 top-0 z-50 flex h-screen w-64
					flex-col border-r border-slate-200 bg-white
					transition-transform duration-300
					lg:sticky lg:top-0 lg:z-30
					${isOpen ? 'translate-x-0' : '-translate-x-full'}
					lg:translate-x-0
				`}>
				<div className='flex h-16 items-center justify-between border-b border-slate-200 px-5'>
					<div className='flex items-center gap-3'>
						<div className='flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white'>
							<Building2 size={20} />
						</div>

						<div>
							<h2 className='text-sm font-semibold text-slate-900'>
								Sunrise Towers
							</h2>

							<p className='text-[11px] text-slate-500'>
								Management System
							</p>
						</div>
					</div>

					<button
						type='button'
						onClick={() => setIsOpen(false)}
						className='rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden'>
						<X size={19} />
					</button>
				</div>

				<div className='flex-1 overflow-y-auto px-3 py-5'>
					<p className='mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400'>
						Main Menu
					</p>

					<nav className='space-y-1'>
						{items.map((item) => {
							const Icon = item.icon;

							return (
								<NavLink
									key={item.path}
									to={item.path}
									onClick={() => setIsOpen(false)}
									className={({ isActive }) =>
										`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
											isActive
												? 'bg-indigo-50 text-indigo-600'
												: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
										}`
									}>
									<Icon size={19} />

									<span>{item.name}</span>
								</NavLink>
							);
						})}
					</nav>

					<div className='my-5 border-t border-slate-100' />

					<p className='mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400'>
						Account
					</p>

					<nav className='space-y-1'>
						<NavLink
							to='/profile'
							onClick={() => setIsOpen(false)}
							className={({ isActive }) =>
								`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
									isActive
										? 'bg-indigo-50 text-indigo-600'
										: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
								}`
							}>
							<UserRound size={19} />
							<span>Profile</span>
						</NavLink>

						<button
							type='button'
							onClick={handleLogout}
							className='flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600'>
							<LogOut size={19} />
							<span>Logout</span>
						</button>
					</nav>
				</div>

				<div className='border-t border-slate-200 p-4'>
					<div className='flex items-center gap-3 rounded-lg bg-slate-50 p-3'>
						<div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600'>
							{userInfo?.name?.charAt(0)?.toUpperCase()}
						</div>

						<div className='min-w-0'>
							<p className='truncate text-sm font-medium text-slate-900'>
								{userInfo?.name}
							</p>

							<p className='truncate text-xs capitalize text-slate-500'>
								{userInfo?.role}
							</p>
						</div>
					</div>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;