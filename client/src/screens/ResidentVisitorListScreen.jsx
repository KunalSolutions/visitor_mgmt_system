import {
	ArrowLeft,
	CalendarDays,
	Eye,
	Search,
	UserRound,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useGetVisitorsQuery } from '@slices/visitorApiSlice';

const ResidentVisitorListScreen = () => {
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
				visitor.purpose
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
					to='/resident/dashboard'
					className='mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900'>
					<ArrowLeft size={17} />
					Back to Dashboard
				</Link>

				<h1 className='text-2xl font-semibold text-slate-900'>
					My Visitors
				</h1>

				<p className='mt-1 text-sm text-slate-500'>
					View visitors registered to meet you.
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
							placeholder='Search visitor, mobile or purpose...'
							className='w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
						/>
					</div>

					<select
						value={status}
						onChange={(e) =>
							setStatus(e.target.value)
						}
						className='rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'>
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
						Visitor History
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
							Visitors registered to meet you will appear
							here.
						</p>
					</div>
				) : (
					<div className='divide-y divide-slate-100'>
						{filteredVisitors.map((visitor) => (
							<div
								key={visitor._id}
								className='flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50'>
								<div className='flex items-center gap-3'>
									<div className='flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100'>
										{visitor.photo ? (
											<img
												src={visitor.photo}
												alt={
													visitor.visitorName
												}
												className='h-full w-full object-cover'
											/>
										) : (
											<UserRound
												size={22}
												className='text-slate-400'
											/>
										)}
									</div>

									<div>
										<p className='text-sm font-semibold text-slate-900'>
											{visitor.visitorName}
										</p>

										<p className='mt-0.5 text-xs text-slate-500'>
											{visitor.mobile}
										</p>

										<div className='mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500'>
											<span>
												{visitor.purpose ||
													'Personal Visit'}
											</span>

											<span className='text-slate-300'>
												•
											</span>

											<span className='inline-flex items-center gap-1'>
												<CalendarDays
													size={13}
												/>

												{visitor.createdAt
													? new Date(
															visitor.createdAt
														).toLocaleDateString(
															[],
															{
																day: '2-digit',
																month: 'short',
																year: 'numeric',
															}
														)
													: '—'}
											</span>
										</div>
									</div>
								</div>

								<div className='flex items-center justify-between gap-3 sm:justify-end'>
									<span
										className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
											visitor.status
										)}`}>
										{visitor.status}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ResidentVisitorListScreen;
