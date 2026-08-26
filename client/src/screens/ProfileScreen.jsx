import {
	ArrowLeft,
	Building2,
	Lock,
	Mail,
	Phone,
	Save,
	UserRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
	useGetProfileQuery,
	useUpdateProfileMutation,
} from '@slices/userApiSlice';

const ProfileScreen = () => {
	const {
		data: profile,
		isLoading,
		isError,
	} = useGetProfileQuery();

	const [updateProfile, { isLoading: isUpdating }] =
		useUpdateProfileMutation();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [mobile, setMobile] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	useEffect(() => {
		if (profile) {
			setName(profile.name || '');
			setEmail(profile.email || '');
			setMobile(profile.mobile || '');
		}
	}, [profile]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!name.trim()) {
			toast.error('Name is required');
			return;
		}

		if (!email.trim()) {
			toast.error('Email is required');
			return;
		}

		if (mobile.length !== 10) {
			toast.error(
				'Please enter a valid 10-digit mobile number'
			);
			return;
		}

		if (password && password.length < 6) {
			toast.error(
				'Password must be at least 6 characters'
			);
			return;
		}

		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		try {
			await updateProfile({
				name: name.trim(),
				email: email.trim(),
				mobile: mobile.trim(),
				...(password
					? { password }
					: {}),
			}).unwrap();

			setPassword('');
			setConfirmPassword('');

			toast.success('Profile updated successfully');
		} catch (error) {
			console.error(error);

			toast.error(
				error?.data?.message ||
					'Failed to update profile'
			);
		}
	};

	if (isLoading) {
		return (
			<div className='flex min-h-[60vh] items-center justify-center'>
				<div className='text-sm text-slate-500'>
					Loading profile...
				</div>
			</div>
		);
	}

	if (isError || !profile) {
		return (
			<div className='flex min-h-[60vh] items-center justify-center'>
				<div className='text-center'>
					<h2 className='text-lg font-semibold text-slate-900'>
						Unable to load profile
					</h2>

					<p className='mt-1 text-sm text-slate-500'>
						Please try again later.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='mx-auto max-w-4xl'>
			{/* Header */}
			<div className='mb-6'>
				<Link
					to='/'
					className='mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900'>
					<ArrowLeft size={17} />
					Back
				</Link>

				<h1 className='text-2xl font-semibold text-slate-900'>
					My Profile
				</h1>

				<p className='mt-1 text-sm text-slate-500'>
					View and update your account information.
				</p>
			</div>

			<div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
				{/* Account Summary */}
				<div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
					<div className='flex flex-col items-center text-center'>
						<div className='flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600'>
							<UserRound size={36} />
						</div>

						<h2 className='mt-4 text-lg font-semibold text-slate-900'>
							{profile.name}
						</h2>

						<p className='mt-1 text-sm capitalize text-slate-500'>
							{profile.role}
						</p>

						<span className='mt-3 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700'>
							{profile.status}
						</span>
					</div>

					<div className='mt-6 space-y-4 border-t border-slate-100 pt-5'>
						<div className='flex items-start gap-3'>
							<Mail
								size={17}
								className='mt-0.5 text-slate-400'
							/>

							<div>
								<p className='text-xs text-slate-400'>
									Email
								</p>

								<p className='mt-0.5 break-all text-sm text-slate-700'>
									{profile.email}
								</p>
							</div>
						</div>

						<div className='flex items-start gap-3'>
							<Phone
								size={17}
								className='mt-0.5 text-slate-400'
							/>

							<div>
								<p className='text-xs text-slate-400'>
									Mobile
								</p>

								<p className='mt-0.5 text-sm text-slate-700'>
									{profile.mobile}
								</p>
							</div>
						</div>

						{profile.role === 'resident' && (
							<>
								<div className='flex items-start gap-3'>
									<Building2
										size={17}
										className='mt-0.5 text-slate-400'
									/>

									<div>
										<p className='text-xs text-slate-400'>
											Flat Number
										</p>

										<p className='mt-0.5 text-sm text-slate-700'>
											{profile.flatNumber ||
												'-'}
										</p>
									</div>
								</div>

								<div className='flex items-start gap-3'>
									<Building2
										size={17}
										className='mt-0.5 text-slate-400'
									/>

									<div>
										<p className='text-xs text-slate-400'>
											Floor Number
										</p>

										<p className='mt-0.5 text-sm text-slate-700'>
											{profile.floorNumber ||
												'-'}
										</p>
									</div>
								</div>
							</>
						)}
					</div>
				</div>

				{/* Edit Profile */}
				<div className='lg:col-span-2'>
					<form
						onSubmit={handleSubmit}
						className='rounded-xl border border-slate-200 bg-white shadow-sm'>
						<div className='border-b border-slate-200 px-5 py-4 sm:px-6'>
							<h2 className='font-semibold text-slate-900'>
								Personal Information
							</h2>

							<p className='mt-1 text-xs text-slate-500'>
								Update your basic account details.
							</p>
						</div>

						<div className='space-y-5 p-5 sm:p-6'>
							{/* Name */}
							<div>
								<label
									htmlFor='name'
									className='mb-2 block text-sm font-medium text-slate-700'>
									Full Name
								</label>

								<input
									id='name'
									type='text'
									value={name}
									onChange={(e) =>
										setName(e.target.value)
									}
									className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
								/>
							</div>

							{/* Email */}
							<div>
								<label
									htmlFor='email'
									className='mb-2 block text-sm font-medium text-slate-700'>
									Email Address
								</label>

								<input
									id='email'
									type='email'
									value={email}
									onChange={(e) =>
										setEmail(e.target.value)
									}
									className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
								/>
							</div>

							{/* Mobile */}
							<div>
								<label
									htmlFor='mobile'
									className='mb-2 block text-sm font-medium text-slate-700'>
									Mobile Number
								</label>

								<input
									id='mobile'
									type='tel'
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
									className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
								/>
							</div>

							{/* Read Only Account Info */}
							<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
								<div>
									<label className='mb-2 block text-sm font-medium text-slate-700'>
										Role
									</label>

									<div className='rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm capitalize text-slate-600'>
										{profile.role}
									</div>
								</div>

								<div>
									<label className='mb-2 block text-sm font-medium text-slate-700'>
										Account Status
									</label>

									<div className='rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600'>
										{profile.status}
									</div>
								</div>
							</div>

							{/* Password */}
							<div className='border-t border-slate-200 pt-5'>
								<div className='mb-4'>
									<h3 className='flex items-center gap-2 text-sm font-semibold text-slate-900'>
										<Lock size={17} />
										Change Password
									</h3>

									<p className='mt-1 text-xs text-slate-500'>
										Leave these fields empty if
										you don't want to change your
										password.
									</p>
								</div>

								<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
									<div>
										<label
											htmlFor='password'
											className='mb-2 block text-sm font-medium text-slate-700'>
											New Password
										</label>

										<input
											id='password'
											type='password'
											value={password}
											onChange={(e) =>
												setPassword(
													e.target.value
												)
											}
											placeholder='Enter new password'
											className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
										/>
									</div>

									<div>
										<label
											htmlFor='confirmPassword'
											className='mb-2 block text-sm font-medium text-slate-700'>
											Confirm Password
										</label>

										<input
											id='confirmPassword'
											type='password'
											value={confirmPassword}
											onChange={(e) =>
												setConfirmPassword(
													e.target.value
												)
											}
											placeholder='Confirm new password'
											className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
										/>
									</div>
								</div>
							</div>
						</div>

						<div className='flex justify-end border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6'>
							<button
								type='submit'
								disabled={isUpdating}
								className='inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60'>
								<Save size={17} />

								{isUpdating
									? 'Saving...'
									: 'Save Changes'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ProfileScreen;