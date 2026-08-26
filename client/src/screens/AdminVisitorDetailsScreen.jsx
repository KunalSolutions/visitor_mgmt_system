import {
	ArrowLeft,
	CalendarDays,
	Clock,
	Mail,
	Phone,
	UserRound,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { useGetVisitorDetailsQuery } from '@slices/visitorApiSlice';

const AdminVisitorDetailsScreen = () => {
	const { id } = useParams();

	const {
		data: visitor,
		isLoading,
		isError,
	} = useGetVisitorDetailsQuery(id);

	const getStatusClass = (status) => {
		switch (status) {
			case 'Approved':
				return 'bg-emerald-50 text-emerald-700';

			case 'Rejected':
				return 'bg-red-50 text-red-700';

			case 'Checked In':
				return 'bg-blue-50 text-blue-700';

			case 'Checked Out':
				return 'bg-slate-100 text-slate-600';

			default:
				return 'bg-amber-50 text-amber-700';
		}
	};

	if (isLoading) {
		return (
			<div className='flex min-h-[400px] items-center justify-center'>
				<p className='text-sm text-slate-500'>
					Loading visitor...
				</p>
			</div>
		);
	}

	if (isError || !visitor) {
		return (
			<div className='rounded-xl border border-red-200 bg-white p-8 text-center'>
				<h2 className='text-lg font-semibold text-slate-900'>
					Visitor not found
				</h2>

				<p className='mt-1 text-sm text-slate-500'>
					The visitor details could not be loaded.
				</p>

				<Link
					to='/admin/visitors'
					className='mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'>
					Back to Visitors
				</Link>
			</div>
		);
	}

	const resident = visitor.meetWith;

	return (
		<div className='mx-auto max-w-4xl space-y-6'>
			<div>
				<Link
					to='/admin/visitors'
					className='mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900'>
					<ArrowLeft size={17} />
					Back to Visitors
				</Link>

				<div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
					<div>
						<h1 className='text-2xl font-semibold text-slate-900'>
							Visitor Details
						</h1>

						<p className='mt-1 text-sm text-slate-500'>
							View complete visitor information.
						</p>
					</div>

					<span
						className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClass(
							visitor.status
						)}`}>
						{visitor.status}
					</span>
				</div>
			</div>

			<div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
				<div className='border-b border-slate-200 px-5 py-4 sm:px-6'>
					<h2 className='font-semibold text-slate-900'>
						Visitor Information
					</h2>
				</div>

				<div className='p-5 sm:p-6'>
					<div className='flex flex-col gap-6 sm:flex-row'>
						<div className='flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50'>
							{visitor.photo ? (
								<img
									src={visitor.photo}
									alt={visitor.visitorName}
									className='h-full w-full object-cover'
								/>
							) : (
								<UserRound
									size={42}
									className='text-slate-300'
								/>
							)}
						</div>

						<div className='flex-1'>
							<h3 className='text-xl font-semibold text-slate-900'>
								{visitor.visitorName}
							</h3>

							<div className='mt-3 flex flex-col gap-2 sm:flex-row sm:gap-6'>
								<div className='flex items-center gap-2 text-sm text-slate-500'>
									<Phone size={16} />
									{visitor.mobile || '—'}
								</div>

								{visitor.email && (
									<div className='flex items-center gap-2 text-sm text-slate-500'>
										<Mail size={16} />
										{visitor.email}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
				<div className='rounded-xl border border-slate-200 bg-white shadow-sm'>
					<div className='border-b border-slate-200 px-5 py-4'>
						<h2 className='font-semibold text-slate-900'>
							Visit Information
						</h2>
					</div>

					<div className='space-y-4 p-5'>
						<div>
							<p className='text-xs font-medium uppercase tracking-wide text-slate-400'>
								Meet With
							</p>

							<p className='mt-1 text-sm font-medium text-slate-900'>
								{resident?.name || '—'}
							</p>
						</div>

						<div>
							<p className='text-xs font-medium uppercase tracking-wide text-slate-400'>
								Flat
							</p>

							<p className='mt-1 text-sm text-slate-700'>
								{resident?.flatNumber
									? `Flat ${resident.flatNumber}`
									: '—'}
							</p>
						</div>

						<div>
							<p className='text-xs font-medium uppercase tracking-wide text-slate-400'>
								Floor
							</p>

							<p className='mt-1 text-sm text-slate-700'>
								{resident?.floorNumber
									? `Floor ${resident.floorNumber}`
									: '—'}
							</p>
						</div>

						<div>
							<p className='text-xs font-medium uppercase tracking-wide text-slate-400'>
								Purpose
							</p>

							<p className='mt-1 text-sm text-slate-700'>
								{visitor.purpose || '—'}
							</p>
						</div>
					</div>
				</div>

				<div className='rounded-xl border border-slate-200 bg-white shadow-sm'>
					<div className='border-b border-slate-200 px-5 py-4'>
						<h2 className='font-semibold text-slate-900'>
							Registration Details
						</h2>
					</div>

					<div className='space-y-4 p-5'>
						<div className='flex items-start gap-3'>
							<CalendarDays
								size={18}
								className='mt-0.5 text-slate-400'
							/>

							<div>
								<p className='text-xs font-medium uppercase tracking-wide text-slate-400'>
									Registered Date
								</p>

								<p className='mt-1 text-sm text-slate-700'>
									{visitor.createdAt
										? new Date(
												visitor.createdAt
											).toLocaleDateString()
										: '—'}
								</p>
							</div>
						</div>

						<div className='flex items-start gap-3'>
							<Clock
								size={18}
								className='mt-0.5 text-slate-400'
							/>

							<div>
								<p className='text-xs font-medium uppercase tracking-wide text-slate-400'>
									Registered Time
								</p>

								<p className='mt-1 text-sm text-slate-700'>
									{visitor.createdAt
										? new Date(
												visitor.createdAt
											).toLocaleTimeString()
										: '—'}
								</p>
							</div>
						</div>

						<div>
							<p className='text-xs font-medium uppercase tracking-wide text-slate-400'>
								Remark
							</p>

							<p className='mt-1 text-sm text-slate-700'>
								{visitor.remark || 'No remark added.'}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className='rounded-xl border border-slate-200 bg-white shadow-sm'>
				<div className='border-b border-slate-200 px-5 py-4'>
					<h2 className='font-semibold text-slate-900'>
						Visitor Status
					</h2>
				</div>

				<div className='p-5'>
					<div className='flex items-center gap-3'>
						<span
							className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClass(
								visitor.status
							)}`}>
							{visitor.status}
						</span>

						<p className='text-sm text-slate-500'>
							Current visitor status
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminVisitorDetailsScreen;
