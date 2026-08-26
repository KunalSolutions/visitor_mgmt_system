import { ArrowLeft, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useRegisterMutation } from '@slices/userApiSlice';

const UserCreateScreen = () => {
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [mobile, setMobile] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState('resident');
	const [flatNumber, setFlatNumber] = useState('');
	const [floorNumber, setFloorNumber] = useState('');
	const [status, setStatus] = useState('Active');

	const [register, { isLoading }] = useRegisterMutation();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await register({
				name: name.trim(),
				email: email.trim(),
				mobile: mobile.trim(),
				password,
				role,
				flatNumber: role === 'resident' ? flatNumber.trim() : null,
				floorNumber:
					role === 'resident' && floorNumber
						? Number(floorNumber)
						: null,
				status,
			}).unwrap();

			toast.success('User created successfully');

			navigate('/admin/users');
		} catch (error) {
			console.error(error);

			toast.error(
				error?.data?.message ||
					'Failed to create user'
			);
		}
	};

	return (
		<div className='mx-auto max-w-3xl'>
			<div className='mb-6'>
				<Link
					to='/admin/users'
					className='mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900'>
					<ArrowLeft size={17} />
					Back to Users
				</Link>

				<h1 className='text-2xl font-semibold text-slate-900'>
					Create User
				</h1>

				<p className='mt-1 text-sm text-slate-500'>
					Add a new resident or security user.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
				<div className='flex items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-6'>
					<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600'>
						<UserPlus size={20} />
					</div>

					<div>
						<h2 className='font-semibold text-slate-900'>
							User Information
						</h2>

						<p className='text-xs text-slate-500'>
							Enter the user's account details.
						</p>
					</div>
				</div>

				<div className='space-y-5 p-5 sm:p-6'>
					<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
						<div>
							<label className='mb-2 block text-sm font-medium text-slate-700'>
								Full Name
							</label>

							<input
								type='text'
								required
								value={name}
								onChange={(e) =>
									setName(e.target.value)
								}
								placeholder='Enter full name'
								className='w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
							/>
						</div>

						<div>
							<label className='mb-2 block text-sm font-medium text-slate-700'>
								Mobile Number
							</label>

							<input
								type='tel'
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
								className='w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
							/>
						</div>
					</div>

					<div>
						<label className='mb-2 block text-sm font-medium text-slate-700'>
							Email Address
						</label>

						<input
							type='email'
							required
							value={email}
							onChange={(e) =>
								setEmail(e.target.value)
							}
							placeholder='Enter email address'
							className='w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
						/>
					</div>

					<div>
						<label className='mb-2 block text-sm font-medium text-slate-700'>
							Password
						</label>

						<input
							type='password'
							required
							minLength='6'
							value={password}
							onChange={(e) =>
								setPassword(e.target.value)
							}
							placeholder='Enter password'
							className='w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
						/>
					</div>

					<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
						<div>
							<label className='mb-2 block text-sm font-medium text-slate-700'>
								Role
							</label>

							<select
								value={role}
								onChange={(e) =>
									setRole(e.target.value)
								}
								className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'>
								<option value='resident'>
									Resident
								</option>

								<option value='security'>
									Security
								</option>
							</select>
						</div>

						<div>
							<label className='mb-2 block text-sm font-medium text-slate-700'>
								Status
							</label>

							<select
								value={status}
								onChange={(e) =>
									setStatus(e.target.value)
								}
								className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'>
								<option value='Active'>
									Active
								</option>

								<option value='Inactive'>
									Inactive
								</option>
							</select>
						</div>
					</div>

					{role === 'resident' && (
						<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
							<div>
								<label className='mb-2 block text-sm font-medium text-slate-700'>
									Flat Number
								</label>

								<input
									type='text'
									required
									value={flatNumber}
									onChange={(e) =>
										setFlatNumber(
											e.target.value
										)
									}
									placeholder='e.g. 101'
									className='w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
								/>
							</div>

							<div>
								<label className='mb-2 block text-sm font-medium text-slate-700'>
									Floor Number
								</label>

								<input
									type='number'
									required
									min='1'
									max='10'
									value={floorNumber}
									onChange={(e) =>
										setFloorNumber(
											e.target.value
										)
									}
									placeholder='e.g. 1'
									className='w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
								/>
							</div>
						</div>
					)}
				</div>

				<div className='flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6'>
					<Link
						to='/admin/users'
						className='inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50'>
						Cancel
					</Link>

					<button
						type='submit'
						disabled={isLoading}
						className='inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60'>
						{isLoading
							? 'Creating...'
							: 'Create User'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default UserCreateScreen;