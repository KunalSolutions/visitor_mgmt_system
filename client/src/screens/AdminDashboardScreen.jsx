import {
	Clock3,
	UserCheck,
	Users,
	UserRound,
} from 'lucide-react';

import StatCard from '@components/dashboard/StatCard';

import { useGetUsersQuery } from '@slices/userApiSlice';
import { useGetVisitorsQuery } from '@slices/visitorApiSlice';

const AdminDashboardScreen = () => {
	const {
		data: users = [],
		isLoading: usersLoading,
	} = useGetUsersQuery();

	const {
		data: visitors = [],
		isLoading: visitorsLoading,
	} = useGetVisitorsQuery();

	const residents = users.filter(
		(user) => user.role === 'resident'
	);

	const pendingVisitors = visitors.filter(
		(visitor) => visitor.status === 'Pending'
	);

	const today = new Date().toDateString();

	const todayVisitors = visitors.filter(
		(visitor) =>
			new Date(visitor.createdAt).toDateString() === today
	);

	const isLoading = usersLoading || visitorsLoading;

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-2xl font-semibold text-slate-900'>
					Dashboard
				</h1>

				<p className='mt-1 text-sm text-slate-500'>
					Welcome back. Here's what's happening at Sunrise
					Towers.
				</p>
			</div>

			{isLoading ? (
				<div className='flex min-h-[300px] items-center justify-center'>
					<p className='text-sm text-slate-500'>
						Loading dashboard...
					</p>
				</div>
			) : (
				<>
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
						<StatCard
							title='Total Residents'
							value={residents.length}
							description='Active residents'
							icon={Users}
						/>

						<StatCard
							title='Total Visitors'
							value={visitors.length}
							description='All registered visitors'
							icon={UserRound}
							iconBg='bg-blue-50'
							iconColor='text-blue-600'
						/>

						<StatCard
							title='Pending Visitors'
							value={pendingVisitors.length}
							description='Waiting for approval'
							icon={Clock3}
							iconBg='bg-amber-50'
							iconColor='text-amber-600'
						/>

						<StatCard
							title="Today's Visitors"
							value={todayVisitors.length}
							description='Visitors registered today'
							icon={UserCheck}
							iconBg='bg-emerald-50'
							iconColor='text-emerald-600'
						/>
					</div>

					<div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
						<div className='rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2'>
							<div className='border-b border-slate-200 px-5 py-4'>
								<h2 className='font-semibold text-slate-900'>
									Recent Visitors
								</h2>

								<p className='mt-1 text-xs text-slate-500'>
									Latest visitor registrations
								</p>
							</div>

							<div className='overflow-x-auto'>
								<table className='w-full text-left text-sm'>
									<thead className='bg-slate-50 text-xs uppercase text-slate-500'>
										<tr>
											<th className='px-5 py-3'>
												Visitor
											</th>

											<th className='px-5 py-3'>
												Meet With
											</th>

											<th className='px-5 py-3'>
												Purpose
											</th>

											<th className='px-5 py-3'>
												Status
											</th>
										</tr>
									</thead>

									<tbody className='divide-y divide-slate-100'>
										{visitors
											.slice(0, 5)
											.map((visitor) => (
												<tr
													key={visitor._id}
													className='hover:bg-slate-50'>
													<td className='px-5 py-4'>
														<div>
															<p className='font-medium text-slate-900'>
																{
																	visitor.visitorName
																}
															</p>

															<p className='text-xs text-slate-500'>
																{
																	visitor.mobile
																}
															</p>
														</div>
													</td>

													<td className='px-5 py-4 text-slate-700'>
														{
															visitor.meetWith
																?.name
														}
													</td>

													<td className='px-5 py-4 text-slate-600'>
														{
															visitor.purpose
														}
													</td>

													<td className='px-5 py-4'>
														<span
															className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
																visitor.status ===
																'Approved'
																	? 'bg-emerald-50 text-emerald-700'
																	: visitor.status ===
																	  'Rejected'
																	? 'bg-red-50 text-red-700'
																	: 'bg-amber-50 text-amber-700'
															}`}>
															{
																visitor.status
															}
														</span>
													</td>
												</tr>
											))}
									</tbody>
								</table>
							</div>
						</div>

						<div className='rounded-xl border border-slate-200 bg-white shadow-sm'>
							<div className='border-b border-slate-200 px-5 py-4'>
								<h2 className='font-semibold text-slate-900'>
									Pending Approvals
								</h2>

								<p className='mt-1 text-xs text-slate-500'>
									Visitors waiting for resident response
								</p>
							</div>

							<div className='divide-y divide-slate-100'>
								{pendingVisitors.length === 0 ? (
									<div className='px-5 py-8 text-center'>
										<p className='text-sm text-slate-500'>
											No pending visitors
										</p>
									</div>
								) : (
									pendingVisitors
										.slice(0, 5)
										.map((visitor) => (
											<div
												key={visitor._id}
												className='px-5 py-4'>
												<p className='text-sm font-medium text-slate-900'>
													{
														visitor.visitorName
													}
												</p>

												<p className='mt-1 text-xs text-slate-500'>
													Visiting{' '}
													{
														visitor.meetWith
															?.name
													}
												</p>

												<p className='mt-1 text-xs text-slate-400'>
													{
														visitor.purpose
													}
												</p>
											</div>
										))
								)}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default AdminDashboardScreen;