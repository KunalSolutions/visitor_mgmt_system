import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '@components/Layout';
import PrivateRoute from '@components/PrivateRoute';
import RoleRoute from '@components/RoleRoute';

import {
	LoginScreen,
	ErrorScreen,
	AdminDashboardScreen,
	SecurityDashboardScreen,
	ResidentDashboardScreen,
	RegisterVisitorScreen,
	NotificationScreen,
	ProfileScreen,
	
	UserListScreen,
	UserCreateScreen,
	UserEditScreen,

	AdminVisitorListScreen,
	AdminVisitorDetailsScreen,

	SecurityVisitorListScreen,

	ResidentVisitorListScreen,
} from '@screens';

import store from './store';

const router = createBrowserRouter([
	{
		path: '/login',
		element: <LoginScreen />,
		errorElement: <ErrorScreen />,
	},
	{
		element: <PrivateRoute />,
		errorElement: <ErrorScreen />,
		children: [
			{
				element: <Layout />,
				errorElement: <ErrorScreen />,
				children: [
					{
						path: '/notifications',
						element: <NotificationScreen />,
					},
					{
						path: '/profile',
						element: <ProfileScreen />,
					},
					{
						element: <RoleRoute allowedRoles={['admin']} />,
						children: [
							{
								path: '/admin/dashboard',
								element: <AdminDashboardScreen />,
							},
							{
								path: '/admin/users',
								element: <UserListScreen />,
							},
							{
								path: '/admin/users/create',
								element: <UserCreateScreen />,
							},
							{
								path: '/admin/users/:id/edit',
								element: <UserEditScreen />,
							},
							{
								path: '/admin/visitors',
								element: <AdminVisitorListScreen />,
							},
							{
								path: '/admin/visitors/:id',
								element: <AdminVisitorDetailsScreen />,
							},
						],
					},
					{
						element: <RoleRoute allowedRoles={['security']} />,
						children: [
							{
								path: '/security/dashboard',
								element: <SecurityDashboardScreen />,
							},
							{
								path: '/security/visitors',
								element: <SecurityVisitorListScreen />,
							},
							{
								path: '/security/visitors/create',
								element: <RegisterVisitorScreen />,
							},
						],
					},
					{
						element: <RoleRoute allowedRoles={['resident']} />,
						children: [
							{
								path: '/resident/dashboard',
								element: <ResidentDashboardScreen />,
							},
							{
								path: '/resident/visitors',
								element: <ResidentVisitorListScreen />,
							}, 
							{
								path: '/resident/notifications',
								element: <NotificationScreen />,
							}, 
						],
					},
				],
			},
		],
	},
]);

const App = () => {
	return (
		<Provider store={store}>
			<RouterProvider router={router} />
			<ToastContainer
				position='bottom-right'
				autoClose={5000}
				hideProgressBar
			/>
		</Provider>
	);
};

export default App;
