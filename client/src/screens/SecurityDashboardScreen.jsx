import {
	Clock3,
	UserCheck,
	UserRound,
	Users,
} from 'lucide-react';

import StatCard from '@components/dashboard/StatCard';

import { useGetVisitorsQuery } from '@slices/visitorApiSlice';

const SecurityDashboardScreen = () => {
	const {
		data: visitors = [],
		isLoading,
	} = useGetVisitorsQuery();

	const today = new Date().toDateString();

	const todayVisitors = visitors.filter(
		(visitor) =>
			new Date(visitor.createdAt).toDateString() === today
	);

	const pendingVisitors = todayVisitors.filter(
		(visitor) => visitor.status === 'Pending'
	);

	const approvedVisitors = todayVisitors.filter(
		(visitor) => visitor.status === 'Approved'
	);

	const rejectedVisitors = todayVisitors.filter(
		(visitor) => visitor.status === 'Rejected'
	);

	return (
		<div className='space-y-6'>
			{/* Page Header */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-2xl font-semibold text-slate-900'>
						Dashboard
					</h1>

					<p className='mt-1 text-sm text-slate-500'>
						Welcome back. Here's today's visitor activity at
						Sunrise Towers.
					</p>
				</div>

				<a
					href='/security/visitors/create'
					className='inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700'>
					+ Register Visitor
				</a>
			</div>

			{/* Statistics */}
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
							title="Today's Visitors"
							value={todayVisitors.length}
							description='Visitors registered today'
							icon={Users}
						/>

						<StatCard
							title='Pending'
							value={pendingVisitors.length}
							description='Waiting for approval'
							icon={Clock3}
							iconBg='bg-amber-50'
							iconColor='text-amber-600'
						/>

						<StatCard
							title='Approved'
							value={approvedVisitors.length}
							description='Approved visitors today'
							icon={UserCheck}
							iconBg='bg-emerald-50'
							iconColor='text-emerald-600'
						/>

						<StatCard
							title='Rejected'
							value={rejectedVisitors.length}
							description='Rejected visitors today'
							icon={UserRound}
							iconBg='bg-red-50'
							iconColor='text-red-600'
						/>
					</div>

					{/* Today's Visitors */}
					<div className='rounded-xl border border-slate-200 bg-white shadow-sm'>
						<div className='flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
							<div>
								<h2 className='font-semibold text-slate-900'>
									Today's Visitors
								</h2>

								<p className='mt-1 text-xs text-slate-500'>
									Visitors registered at the security
									desk today
								</p>
							</div>

							<span className='text-xs font-medium text-slate-500'>
								{todayVisitors.length} visitors
							</span>
						</div>

						<div className='overflow-x-auto'>
							<table className='w-full min-w-[700px] text-left text-sm'>
								<thead className='bg-slate-50 text-xs uppercase text-slate-500'>
									<tr>
										<th className='px-5 py-3'>
											Visitor
										</th>

										<th className='px-5 py-3'>
											Mobile
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
									{todayVisitors.length === 0 ? (
										<tr>
											<td
												colSpan='5'
												className='px-5 py-10 text-center'>
												<p className='text-sm text-slate-500'>
													No visitors registered
													today.
												</p>
											</td>
										</tr>
									) : (
										todayVisitors.map((visitor) => (
											<tr
												key={visitor._id}
												className='hover:bg-slate-50'>
												<td className='px-5 py-4'>
													<p className='font-medium text-slate-900'>
														{
															visitor.visitorName
														}
													</p>
												</td>

												<td className='px-5 py-4 text-slate-600'>
													{visitor.mobile}
												</td>

												<td className='px-5 py-4'>
													<div>
														<p className='font-medium text-slate-700'>
															{
																visitor
																	.meetWith
																	?.name
															}
														</p>

														<p className='text-xs text-slate-500'>
															Flat{' '}
															{
																visitor
																	.meetWith
																	?.flatNumber
															}
														</p>
													</div>
												</td>

												<td className='px-5 py-4 text-slate-600'>
													{visitor.purpose}
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
														{visitor.status}
													</span>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default SecurityDashboardScreen;