import { Outlet } from 'react-router-dom';

import Header from '@components/Header';
import Sidebar from '@components/Sidebar';

const Layout = () => {
	return (
		<div className='min-h-screen bg-slate-50'>
			<Header />

			<div className='flex'>
				<Sidebar />

				<main className='min-h-[calc(100vh-64px)] flex-1 p-4 sm:p-6 lg:p-8'>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Layout;