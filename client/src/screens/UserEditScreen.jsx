import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
	useGetUserDetailsQuery,
	useUpdateUserMutation,
} from '@slices/userApiSlice';

const UserEditScreen = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [mobile, setMobile] = useState('');
	const [role, setRole] = useState('resident');
	const [flatNumber, setFlatNumber] = useState('');
	const [floorNumber, setFloorNumber] = useState('');
	const [status, setStatus] = useState('Active');

	const {
		data: user,
		isLoading: userLoading,
		isError,
	} = useGetUserDetailsQuery(id);

	const [updateUser, { isLoading }] =
		useUpdateUserMutation();

	useEffect(() => {
		if (user) {
			setName(user.name || '');
			setEmail(user.email || '');
			setMobile(user.mobile || '');
			setRole(user.role || 'resident');
			setFlatNumber(user.flatNumber || '');
			setFloorNumber(user.floorNumber || '');
			setStatus(user.status || 'Active');
		}
	}, [user]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await updateUser({
				userId: id,
				name: name.trim(),
				email: email.trim(),
				mobile: mobile.trim(),
				role,
				flatNumber:
					role === 'resident'
						? flatNumber.trim()
						: null,
				floorNumber:
					role === 'resident' && floorNumber
						? Number(floorNumber)
						: null,
				status,
			}).unwrap();

			toast.success('User updated successfully');

			navigate('/admin/users');
		} catch (error) {
			console.error(error);

			toast.error(
				error?.data?.message ||
					'Failed to update user'
			);
		}
	};

	if (userLoading) {
		return (
			<div className='flex min-h-[400px] items-center justify-center'>
				<p className='text-sm text-slate-500'>
					Loading user...
				</p>
			</div>
		);
	}

	if (isError || !user) {
		return (
			<div className='rounded-xl border border-red-200 bg-white p-8 text-center'>
				<h2 className='text-lg font-semibold text-slate-900'>
					User not found
				</h2>

				<p className='mt-1 text-sm text-slate-500'>
					The requested user could not be found.
				</p>

				<Link
					to='/admin/users'
					className='mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'>
					Back to Users
				</Link>
			</div>
		);
	}

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
					Edit User
				</h1>

				<p className='mt-1 text-sm text-slate-500'>
					Update the user's account information.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
				<div className='border-b border-slate-200 px-5 py-4 sm:px-6'>
					<h2 className='font-semibold text-slate-900'>
						User Information
					</h2>

					<p className='mt-1 text-xs text-slate-500'>
						Update account and residential details.
					</p>
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

								<option value='admin'>
									Admin
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
						className='inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60'>
						<Save size={17} />

						{isLoading
							? 'Saving...'
							: 'Save Changes'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default UserEditScreen;