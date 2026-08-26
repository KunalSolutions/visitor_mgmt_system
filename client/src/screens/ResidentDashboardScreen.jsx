import {
	Check,
	Clock3,
	Phone,
	UserRound,
	Users,
	X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
	useGetVisitorsQuery,
	useUpdateVisitorStatusMutation,
} from '@slices/visitorApiSlice';

const ResidentDashboardScreen = () => {
	const { userInfo } = useSelector((state) => state.auth);

	const {
		data: visitors = [],
		isLoading,
	} = useGetVisitorsQuery();

	const [selectedVisitor, setSelectedVisitor] = useState(null);
	const [remark, setRemark] = useState('');
	const [showRejectModal, setShowRejectModal] = useState(false);

	const [
		updateVisitorStatus,
		{ isLoading: isUpdating },
	] = useUpdateVisitorStatusMutation();

	const residentVisitors = useMemo(() => {
		return visitors.filter(
			(visitor) =>
				visitor.meetWith?._id?.toString() ===
				userInfo?._id?.toString()
		);
	}, [visitors, userInfo]);

	const today = new Date().toDateString();

	const todayVisitors = residentVisitors.filter(
		(visitor) =>
			new Date(visitor.createdAt).toDateString() === today
	);

	const pendingVisitors = residentVisitors.filter(
		(visitor) => visitor.status === 'Pending'
	);

	const approvedVisitors = todayVisitors.filter(
		(visitor) => visitor.status === 'Approved'
	);

	const handleApprove = async (visitor) => {
		try {
			await updateVisitorStatus({
				visitorId: visitor._id,
				status: 'Approved',
				remark: '',
			}).unwrap();

			toast.success(
				`${visitor.visitorName} has been approved`
			);
		} catch (error) {
			console.error(error);

			toast.error(
				error?.data?.message ||
					'Failed to approve visitor'
			);
		}
	};

	const openRejectModal = (visitor) => {
		setSelectedVisitor(visitor);
		setRemark('');
		setShowRejectModal(true);
	};

	const closeRejectModal = () => {
		if (isUpdating) return;

		setSelectedVisitor(null);
		setRemark('');
		setShowRejectModal(false);
	};

	const handleReject = async (e) => {
		e.preventDefault();

		if (!selectedVisitor) return;

		try {
			await updateVisitorStatus({
				visitorId: selectedVisitor._id,
				status: 'Rejected',
				remark: remark.trim(),
			}).unwrap();

			toast.success(
				`${selectedVisitor.visitorName} has been rejected`
			);

			closeRejectModal();
		} catch (error) {
			console.error(error);

			toast.error(
				error?.data?.message ||
					'Failed to reject visitor'
			);
		}
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div>
				<h1 className='text-2xl font-semibold text-slate-900'>
					Resident Dashboard
				</h1>

				<p className='mt-1 text-sm text-slate-500'>
					Welcome back, {userInfo?.name}. Manage your
					visitor requests here.
				</p>
			</div>

			{/* Resident Information */}
			<div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
				<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
					<div className='flex items-center gap-4'>
						<div className='flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600'>
							<UserRound size={22} />
						</div>

						<div>
							<h2 className='font-semibold text-slate-900'>
								{userInfo?.name}
							</h2>

							<p className='text-sm text-slate-500'>
								Flat {userInfo?.flatNumber} • Floor{' '}
								{userInfo?.floorNumber}
							</p>
						</div>
					</div>

					<div className='text-left sm:text-right'>
						<p className='text-xs text-slate-500'>
							Mobile
						</p>

						<p className='mt-1 text-sm font-medium text-slate-800'>
							{userInfo?.mobile}
						</p>
					</div>
				</div>
			</div>

			{/* Statistics */}
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				<div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-slate-500'>
								Pending Requests
							</p>

							<p className='mt-2 text-2xl font-semibold text-slate-900'>
								{pendingVisitors.length}
							</p>

							<p className='mt-1 text-xs text-slate-400'>
								Need your response
							</p>
						</div>

						<div className='flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600'>
							<Clock3 size={21} />
						</div>
					</div>
				</div>

				<div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-slate-500'>
								Today's Visitors
							</p>

							<p className='mt-2 text-2xl font-semibold text-slate-900'>
								{todayVisitors.length}
							</p>

							<p className='mt-1 text-xs text-slate-400'>
								Registered today
							</p>
						</div>

						<div className='flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600'>
							<Users size={21} />
						</div>
					</div>
				</div>

				<div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-slate-500'>
								Approved Today
							</p>

							<p className='mt-2 text-2xl font-semibold text-slate-900'>
								{approvedVisitors.length}
							</p>

							<p className='mt-1 text-xs text-slate-400'>
								Approved visitors
							</p>
						</div>

						<div className='flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600'>
							<Check size={21} />
						</div>
					</div>
				</div>

				<div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-slate-500'>
								Total Visitors
							</p>

							<p className='mt-2 text-2xl font-semibold text-slate-900'>
								{residentVisitors.length}
							</p>

							<p className='mt-1 text-xs text-slate-400'>
								All visitor requests
							</p>
						</div>

						<div className='flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-600'>
							<Users size={21} />
						</div>
					</div>
				</div>
			</div>

			{/* Pending Requests */}
			<div className='rounded-xl border border-slate-200 bg-white shadow-sm'>
				<div className='border-b border-slate-200 px-5 py-4'>
					<h2 className='font-semibold text-slate-900'>
						Pending Visitor Requests
					</h2>

					<p className='mt-1 text-xs text-slate-500'>
						Review visitors waiting for your approval.
					</p>
				</div>

				{isLoading ? (
					<div className='px-5 py-10 text-center text-sm text-slate-500'>
						Loading visitor requests...
					</div>
				) : pendingVisitors.length === 0 ? (
					<div className='px-5 py-12 text-center'>
						<div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400'>
							<Check size={22} />
						</div>

						<p className='mt-3 text-sm font-medium text-slate-700'>
							No pending requests
						</p>

						<p className='mt-1 text-xs text-slate-500'>
							You are all caught up.
						</p>
					</div>
				) : (
					<div className='divide-y divide-slate-100'>
						{pendingVisitors.map((visitor) => (
							<div
								key={visitor._id}
								className='flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between'>
								<div className='flex items-start gap-4'>
									<div className='flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100'>
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
												size={21}
												className='text-slate-400'
											/>
										)}
									</div>

									<div>
										<h3 className='font-medium text-slate-900'>
											{visitor.visitorName}
										</h3>

										<div className='mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500'>
											<span className='inline-flex items-center gap-1'>
												<Phone size={13} />
												{visitor.mobile}
											</span>

											<span>
												{visitor.purpose}
											</span>
										</div>

										<p className='mt-2 text-xs text-slate-400'>
											Requested{' '}
											{new Date(
												visitor.createdAt
											).toLocaleString()}
										</p>
									</div>
								</div>

								<div className='flex gap-2'>
									<button
										type='button'
										disabled={isUpdating}
										onClick={() =>
											handleApprove(
												visitor
											)
										}
										className='inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none'>
										<Check size={17} />
										Approve
									</button>

									<button
										type='button'
										disabled={isUpdating}
										onClick={() =>
											openRejectModal(
												visitor
											)
										}
										className='inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none'>
										<X size={17} />
										Reject
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Recent Visitors */}
			<div className='rounded-xl border border-slate-200 bg-white shadow-sm'>
				<div className='border-b border-slate-200 px-5 py-4'>
					<h2 className='font-semibold text-slate-900'>
						Recent Visitors
					</h2>

					<p className='mt-1 text-xs text-slate-500'>
						Your latest visitor requests.
					</p>
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
									Purpose
								</th>

								<th className='px-5 py-3'>
									Status
								</th>

								<th className='px-5 py-3'>
									Date
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-slate-100'>
							{residentVisitors.length === 0 ? (
								<tr>
									<td
										colSpan='5'
										className='px-5 py-10 text-center text-sm text-slate-500'>
										No visitor records found.
									</td>
								</tr>
							) : (
								residentVisitors
									.slice(0, 10)
									.map((visitor) => (
										<tr
											key={visitor._id}
											className='hover:bg-slate-50'>
											<td className='px-5 py-4 font-medium text-slate-900'>
												{
													visitor.visitorName
												}
											</td>

											<td className='px-5 py-4 text-slate-600'>
												{visitor.mobile}
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
													{
														visitor.status
													}
												</span>
											</td>

											<td className='px-5 py-4 text-xs text-slate-500'>
												{new Date(
													visitor.createdAt
												).toLocaleDateString()}
											</td>
										</tr>
									))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Reject Modal */}
			{showRejectModal && selectedVisitor && (
				<div className='fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4'>
					<div className='w-full max-w-md rounded-xl bg-white shadow-xl'>
						<div className='border-b border-slate-200 px-5 py-4'>
							<h2 className='text-lg font-semibold text-slate-900'>
								Reject Visitor
							</h2>

							<p className='mt-1 text-sm text-slate-500'>
								Why are you rejecting{' '}
								<span className='font-medium text-slate-700'>
									{selectedVisitor.visitorName}
								</span>
								?
							</p>
						</div>

						<form onSubmit={handleReject}>
							<div className='p-5'>
								<label
									htmlFor='remark'
									className='mb-2 block text-sm font-medium text-slate-700'>
									Remark
								</label>

								<textarea
									id='remark'
									rows='4'
									value={remark}
									onChange={(e) =>
										setRemark(
											e.target.value
										)
									}
									placeholder='Enter reason for rejection...'
									className='w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
								/>
							</div>

							<div className='flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4'>
								<button
									type='button'
									disabled={isUpdating}
									onClick={closeRejectModal}
									className='rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50'>
									Cancel
								</button>

								<button
									type='submit'
									disabled={isUpdating}
									className='rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'>
									{isUpdating
										? 'Rejecting...'
										: 'Reject Visitor'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ResidentDashboardScreen;