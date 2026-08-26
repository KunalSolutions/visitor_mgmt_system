import {
	ArrowLeft,
	Camera,
	Search,
	UserRound,
	X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useGetUsersQuery } from '@slices/userApiSlice';
import { useCreateVisitorMutation } from '@slices/visitorApiSlice';

const RegisterVisitorScreen = () => {
	const navigate = useNavigate();

	const [visitorName, setVisitorName] = useState('');
	const [mobile, setMobile] = useState('');
	const [photo, setPhoto] = useState('');
	const [search, setSearch] = useState('');
	const [meetWith, setMeetWith] = useState(null);
	const [purpose, setPurpose] = useState('');
	const [showResidents, setShowResidents] = useState(false);

	const {
		data: users = [],
		isLoading: usersLoading,
		isError: usersError,
	} = useGetUsersQuery();

	const [createVisitor, { isLoading }] =
		useCreateVisitorMutation();

	// Only active residents
	const residents = users.filter(
		(user) =>
			user.role === 'resident' &&
			user.status === 'Active'
	);

	// Search residents by name, mobile or flat number
	const filteredResidents = residents.filter((resident) => {
		const searchValue = search.toLowerCase().trim();

		if (!searchValue) {
			return true;
		}

		return (
			resident.name
				?.toLowerCase()
				.includes(searchValue) ||
			resident.mobile?.includes(searchValue) ||
			resident.flatNumber
				?.toLowerCase()
				.includes(searchValue)
		);
	});

	useEffect(() => {
		if (meetWith) {
			setSearch(meetWith.name);
			setShowResidents(false);
		}
	}, [meetWith]);

	const handlePhotoChange = (e) => {
		const file = e.target.files?.[0];

		if (!file) {
			return;
		}

		const reader = new FileReader();

		reader.onloadend = () => {
			setPhoto(reader.result);
		};

		reader.readAsDataURL(file);
	};

	const handleResidentSelect = (resident) => {
		setMeetWith(resident);
		setSearch(resident.name);
		setShowResidents(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!visitorName.trim()) {
			toast.error('Please enter visitor name');
			return;
		}

		if (mobile.length !== 10) {
			toast.error(
				'Please enter a valid 10-digit mobile number'
			);
			return;
		}

		if (!meetWith) {
			toast.error('Please select the resident to meet');
			return;
		}

		if (!purpose.trim()) {
			toast.error('Please enter the purpose of visit');
			return;
		}

		try {
			await createVisitor({
				visitorName: visitorName.trim(),
				mobile: mobile.trim(),
				photo,
				meetWith: meetWith._id,
				purpose: purpose.trim(),
				status: 'Pending',
			}).unwrap();

			toast.success(
				`Visitor registered for ${meetWith.name}`
			);

			navigate('/security/dashboard');
		} catch (error) {
			console.error(error);

			toast.error(
				error?.data?.message ||
					'Failed to register visitor'
			);
		}
	};

	return (
		<div className='mx-auto max-w-3xl'>
			{/* Page Header */}
			<div className='mb-6'>
				<Link
					to='/security/dashboard'
					className='mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900'>
					<ArrowLeft size={17} />
					Back to Dashboard
				</Link>

				<h1 className='text-2xl font-semibold text-slate-900'>
					Register Visitor
				</h1>

				<p className='mt-1 text-sm text-slate-500'>
					Register a visitor and send an approval request
					to the resident.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className='rounded-xl border border-slate-200 bg-white shadow-sm'>
				{/* Section Header */}
				<div className='border-b border-slate-200 px-5 py-4 sm:px-6'>
					<h2 className='font-semibold text-slate-900'>
						Visitor Information
					</h2>

					<p className='mt-1 text-xs text-slate-500'>
						Enter the visitor's basic details.
					</p>
				</div>

				<div className='space-y-6 p-5 sm:p-6'>
					{/* Visitor Photo */}
					<div>
						<label className='mb-2 block text-sm font-medium text-slate-700'>
							Visitor Photo
							<span className='ml-1 text-xs font-normal text-slate-400'>
								(Optional)
							</span>
						</label>

						<div className='flex items-center gap-4'>
							<div className='flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50'>
								{photo ? (
									<img
										src={photo}
										alt='Visitor preview'
										className='h-full w-full object-cover'
									/>
								) : (
									<UserRound
										size={30}
										className='text-slate-400'
									/>
								)}
							</div>

							<label className='inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50'>
								<Camera size={18} />

								<span>Choose Photo</span>

								<input
									type='file'
									accept='image/*'
									className='hidden'
									onChange={handlePhotoChange}
								/>
							</label>
						</div>
					</div>

					{/* Visitor Name + Mobile */}
					<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
						<div>
							<label
								htmlFor='visitorName'
								className='mb-2 block text-sm font-medium text-slate-700'>
								Visitor Name
							</label>

							<input
								type='text'
								id='visitorName'
								required
								value={visitorName}
								onChange={(e) =>
									setVisitorName(e.target.value)
								}
								placeholder='Enter visitor name'
								className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
							/>
						</div>

						<div>
							<label
								htmlFor='mobile'
								className='mb-2 block text-sm font-medium text-slate-700'>
								Mobile Number
							</label>

							<input
								type='tel'
								id='mobile'
								required
								maxLength='10'
								value={mobile}
								onChange={(e) =>
									setMobile(
										e.target.value.replace(
											/\D/g,
											''
										)
									)
								}
								placeholder='Enter mobile number'
								className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
							/>
						</div>
					</div>

					{/* Resident Search */}
					<div>
						<label
							htmlFor='resident'
							className='mb-2 block text-sm font-medium text-slate-700'>
							Whom to Meet
						</label>

						<div className='relative'>
							<Search
								size={18}
								className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
							/>

							<input
								type='text'
								id='resident'
								value={search}
								onFocus={() =>
									setShowResidents(true)
								}
								onChange={(e) => {
									setSearch(e.target.value);
									setMeetWith(null);
									setShowResidents(true);
								}}
								placeholder='Search by name, mobile or flat'
								className='w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
							/>

							{search && (
								<button
									type='button'
									onClick={() => {
										setSearch('');
										setMeetWith(null);
										setShowResidents(true);
									}}
									className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700'>
									<X size={17} />
								</button>
							)}
						</div>

						{/* Selected Resident */}
						{meetWith && (
							<div className='mt-2 flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3'>
								<div>
									<p className='text-sm font-medium text-indigo-900'>
										{meetWith.name}
									</p>

									<p className='mt-0.5 text-xs text-indigo-700'>
										Flat {meetWith.flatNumber} •
										Floor {meetWith.floorNumber}
									</p>
								</div>

								<button
									type='button'
									onClick={() => {
										setMeetWith(null);
										setSearch('');
										setShowResidents(true);
									}}
									className='text-xs font-medium text-indigo-600 hover:text-indigo-800'>
									Change
								</button>
							</div>
						)}

						{/* Resident List */}
						{showResidents && !meetWith && (
							<div className='mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg'>
								{usersLoading ? (
									<div className='px-4 py-4 text-sm text-slate-500'>
										Loading residents...
									</div>
								) : usersError ? (
									<div className='px-4 py-4 text-sm text-red-500'>
										Failed to load residents.
									</div>
								) : filteredResidents.length ===
								  0 ? (
									<div className='px-4 py-4 text-sm text-slate-500'>
										No resident found.
									</div>
								) : (
									<>
										<div className='border-b border-slate-100 bg-slate-50 px-4 py-2'>
											<p className='text-xs font-medium text-slate-500'>
												Residents
											</p>
										</div>

										<div className='max-h-64 overflow-y-auto'>
											{filteredResidents.map(
												(resident) => (
													<button
														key={
															resident._id
														}
														type='button'
														onClick={() =>
															handleResidentSelect(
																resident
															)
														}
														className='flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50'>
														<div className='flex items-center gap-3'>
															<div className='flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600'>
																<UserRound
																	size={
																		17
																	}
																/>
															</div>

															<div>
																<p className='text-sm font-medium text-slate-900'>
																	{
																		resident.name
																	}
																</p>

																<p className='mt-0.5 text-xs text-slate-500'>
																	Flat{' '}
																	{
																		resident.flatNumber
																	}{' '}
																	• Floor{' '}
																	{
																		resident.floorNumber
																	}
																</p>
															</div>
														</div>

														<span className='text-xs font-medium text-indigo-600'>
															Select
														</span>
													</button>
												)
											)}
										</div>
									</>
								)}
							</div>
						)}

						<p className='mt-2 text-xs text-slate-400'>
							Search using resident name, mobile number
							or flat number.
						</p>
					</div>

					{/* Purpose */}
					<div>
						<label
							htmlFor='purpose'
							className='mb-2 block text-sm font-medium text-slate-700'>
							Purpose of Visit
						</label>

						<select
							id='purpose'
							required
							value={purpose}
							onChange={(e) =>
								setPurpose(e.target.value)
							}
							className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'>
							<option value=''>
								Select purpose
							</option>

							<option value='Personal Visit'>
								Personal Visit
							</option>

							<option value='Family Visit'>
								Family Visit
							</option>

							<option value='Delivery'>
								Delivery
							</option>

							<option value='Maintenance'>
								Maintenance
							</option>

							<option value='Service'>
								Service
							</option>

							<option value='Other'>Other</option>
						</select>
					</div>
				</div>

				{/* Footer */}
				<div className='flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6'>
					<Link
						to='/security/dashboard'
						className='inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50'>
						Cancel
					</Link>

					<button
						type='submit'
						disabled={isLoading}
						className='inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60'>
						{isLoading
							? 'Registering...'
							: 'Register Visitor'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default RegisterVisitorScreen;