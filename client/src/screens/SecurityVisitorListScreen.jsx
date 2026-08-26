import {
	ArrowLeft,
	Eye,
	Search,
	UserRound,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useGetVisitorsQuery } from '@slices/visitorApiSlice';

const SecurityVisitorListScreen = () => {
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('');

	const {
		data: visitors = [],
		isLoading,
		isError,
	} = useGetVisitorsQuery();

	const filteredVisitors = useMemo(() => {
		const value = search.toLowerCase().trim();

		return visitors.filter((visitor) => {
			const matchesSearch =
				!value ||
				visitor.visitorName
					?.toLowerCase()
					.includes(value) ||
				visitor.mobile?.includes(value) ||
				visitor.meetWith?.name
					?.toLowerCase()
					.includes(value) ||
				visitor.meetWith?.flatNumber
					?.toLowerCase()
					.includes(value);

			const matchesStatus =
				!status || visitor.status === status;

			return matchesSearch && matchesStatus;
		});
	}, [visitors, search, status]);

	const getStatusClass = (value) => {
		switch (value) {
			case 'Approved':
				return 'bg-emerald-50 text-emerald-700';

			case 'Rejected':
				return 'bg-red-50 text-red-700';

			default:
				return 'bg-amber-50 text-amber-700';
		}
	};

	return (
		<div className='space-y-6'>
			<div>
				<Link
					to='/security/dashboard'
					className='mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900'>
					<ArrowLeft size={17} />
					Back to Dashboard
				</Link>

				<h1 className='text-2xl font-semibold text-slate-900'>
					Visitors
				</h1>

				<p className='mt-1 text-sm text-slate-500'>
					View visitor registrations and approval status.
				</p>
			</div>

			<div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
				<div className='grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px]'>
					<div className='relative'>
						<Search
							size={18}
							className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
						/>

						<input
							type='text'
							value={search}
							onChange={(e) =>
								setSearch(e.target.value)
							}
							placeholder='Search visitor, mobile, resident or flat...'
							className='w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
						/>
					</div>

					<select
						value={status}
						onChange={(e) =>
							setStatus(e.target.value)
						}
						className='rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'>
						<option value=''>All Status</option>
						<option value='Pending'>Pending</option>
						<option value='Approved'>Approved</option>
						<option value='Rejected'>Rejected</option>
					</select>
				</div>
			</div>

			<div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
				<div className='border-b border-slate-200 px-5 py-4'>
					<h2 className='font-semibold text-slate-900'>
						Visitor List
					</h2>

					<p className='mt-1 text-xs text-slate-500'>
						{filteredVisitors.length} visitor
						{filteredVisitors.length !== 1 ? 's' : ''} found
					</p>
				</div>

				{isLoading ? (
					<div className='px-5 py-12 text-center text-sm text-slate-500'>
						Loading visitors...
					</div>
				) : isError ? (
					<div className='px-5 py-12 text-center text-sm text-red-500'>
						Failed to load visitors.
					</div>
				) : filteredVisitors.length === 0 ? (
					<div className='px-5 py-12 text-center'>
						<UserRound
							size={40}
							className='mx-auto text-slate-300'
						/>

						<p className='mt-3 text-sm font-medium text-slate-700'>
							No visitors found
						</p>

						<p className='mt-1 text-xs text-slate-500'>
							Try changing your search or filter.
						</p>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full min-w-[800px] text-left'>
							<thead className='bg-slate-50'>
								<tr className='border-b border-slate-200'>
									<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500'>
										Visitor
									</th>

									<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500'>
										Meet With
									</th>

									<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500'>
										Purpose
									</th>

									<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500'>
										Status
									</th>
								</tr>
							</thead>

							<tbody className='divide-y divide-slate-100'>
								{filteredVisitors.map(
									(visitor) => (
										<tr
											key={visitor._id}
											className='hover:bg-slate-50'>
											<td className='px-5 py-4'>
												<div className='flex items-center gap-3'>
													<div className='flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100'>
														{visitor.photo ? (
															<img
																src={
																	visitor.photo
																}
																alt={
																	visitor.visitorName
																}
																className='h-full w-full object-cover'
															/>
														) : (
															<UserRound
																size={
																	19
																}
																className='text-slate-400'
															/>
														)}
													</div>

													<div>
														<p className='text-sm font-medium text-slate-900'>
															{
																visitor.visitorName
															}
														</p>

														<p className='mt-0.5 text-xs text-slate-500'>
															{
																visitor.mobile
															}
														</p>
													</div>
												</div>
											</td>

											<td className='px-5 py-4'>
												<p className='text-sm font-medium text-slate-800'>
													{visitor.meetWith
														?.name ||
														'—'}
												</p>

												{visitor.meetWith
													?.flatNumber && (
													<p className='mt-0.5 text-xs text-slate-500'>
														Flat{' '}
														{
															visitor
																.meetWith
																.flatNumber
														}
													</p>
												)}
											</td>

											<td className='px-5 py-4 text-sm text-slate-600'>
												{visitor.purpose ||
													'—'}
											</td>

											<td className='px-5 py-4'>
												<span
													className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
														visitor.status
													)}`}>
													{visitor.status}
												</span>
											</td>
										</tr>
									)
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default SecurityVisitorListScreen;
