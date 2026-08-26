import {
	Edit,
	Plus,
	Search,
	Trash2,
	Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
	useDeleteUserMutation,
	useGetUsersQuery,
} from '@slices/userApiSlice';

const UserListScreen = () => {
	const [search, setSearch] = useState('');
	const [role, setRole] = useState('all');
	const [status, setStatus] = useState('all');

	const {
		data: users = [],
		isLoading,
		isError,
	} = useGetUsersQuery();

	const [deleteUser, { isLoading: isDeleting }] =
		useDeleteUserMutation();

	const filteredUsers = useMemo(() => {
		const value = search.toLowerCase().trim();

		return users.filter((user) => {
			const matchesSearch =
				!value ||
				user.name?.toLowerCase().includes(value) ||
				user.email?.toLowerCase().includes(value) ||
				user.mobile?.includes(value) ||
				user.flatNumber?.toLowerCase().includes(value);

			const matchesRole =
				role === 'all' || user.role === role;

			const matchesStatus =
				status === 'all' || user.status === status;

			return (
				matchesSearch &&
				matchesRole &&
				matchesStatus
			);
		});
	}, [users, search, role, status]);

	const totalUsers = users.length;
	const residents = users.filter(
		(user) => user.role === 'resident'
	).length;
	const security = users.filter(
		(user) => user.role === 'security'
	).length;
	const admins = users.filter(
		(user) => user.role === 'admin'
	).length;

	const handleDelete = async (user) => {
		if (user.role === 'admin') {
			toast.error('Admin users cannot be deleted');
			return;
		}

		const confirmed = window.confirm(
			`Are you sure you want to delete ${user.name}?`
		);

		if (!confirmed) {
			return;
		}

		try {
			await deleteUser(user._id).unwrap();

			toast.success('User deleted successfully');
		} catch (error) {
			toast.error(
				error?.data?.message || 'Failed to delete user'
			);
		}
	};

	return (
		<div>
			<div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-2xl font-semibold text-slate-900'>
						Users
					</h1>

					<p className='mt-1 text-sm text-slate-500'>
						Manage residents, security staff and
						administrators.
					</p>
				</div>

				<Link
					to='/admin/users/create'
					className='inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700'>
					<Plus size={18} />
					Add User
				</Link>
			</div>

			<div className='mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4'>
				<div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
					<p className='text-sm text-slate-500'>
						Total Users
					</p>

					<div className='mt-2 flex items-center justify-between'>
						<p className='text-2xl font-semibold text-slate-900'>
							{totalUsers}
						</p>

						<Users
							size={22}
							className='text-indigo-500'
						/>
					</div>
				</div>

				<div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
					<p className='text-sm text-slate-500'>
						Residents
					</p>

					<p className='mt-2 text-2xl font-semibold text-slate-900'>
						{residents}
					</p>
				</div>

				<div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
					<p className='text-sm text-slate-500'>
						Security
					</p>

					<p className='mt-2 text-2xl font-semibold text-slate-900'>
						{security}
					</p>
				</div>

				<div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
					<p className='text-sm text-slate-500'>
						Admins
					</p>

					<p className='mt-2 text-2xl font-semibold text-slate-900'>
						{admins}
					</p>
				</div>
			</div>

			<div className='rounded-xl border border-slate-200 bg-white shadow-sm'>
				<div className='border-b border-slate-200 p-4 sm:p-5'>
					<div className='flex flex-col gap-3 lg:flex-row'>
						<div className='relative flex-1'>
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
								placeholder='Search by name, email, mobile or flat...'
								className='w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
							/>
						</div>

						<select
							value={role}
							onChange={(e) =>
								setRole(e.target.value)
							}
							className='rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'>
							<option value='all'>All Roles</option>
							<option value='resident'>
								Residents
							</option>
							<option value='security'>
								Security
							</option>
							<option value='admin'>Admins</option>
						</select>

						<select
							value={status}
							onChange={(e) =>
								setStatus(e.target.value)
							}
							className='rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'>
							<option value='all'>
								All Status
							</option>
							<option value='Active'>Active</option>
							<option value='Inactive'>
								Inactive
							</option>
						</select>
					</div>
				</div>

				{isLoading ? (
					<div className='p-10 text-center text-sm text-slate-500'>
						Loading users...
					</div>
				) : isError ? (
					<div className='p-10 text-center text-sm text-red-500'>
						Failed to load users.
					</div>
				) : filteredUsers.length === 0 ? (
					<div className='p-10 text-center'>
						<Users
							size={36}
							className='mx-auto text-slate-300'
						/>

						<p className='mt-3 text-sm font-medium text-slate-700'>
							No users found
						</p>

						<p className='mt-1 text-xs text-slate-500'>
							Try changing your search or filters.
						</p>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full min-w-[800px]'>
							<thead>
								<tr className='border-b border-slate-200 bg-slate-50 text-left'>
									<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500'>
										User
									</th>

									<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500'>
										Contact
									</th>

									<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500'>
										Role
									</th>

									<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500'>
										Flat
									</th>

									<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500'>
										Status
									</th>

									<th className='px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500'>
										Action
									</th>
								</tr>
							</thead>

							<tbody className='divide-y divide-slate-100'>
								{filteredUsers.map((user) => (
									<tr
										key={user._id}
										className='hover:bg-slate-50'>
										<td className='px-5 py-4'>
											<div className='flex items-center gap-3'>
												<div className='flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600'>
													{user.name
														?.charAt(0)
														.toUpperCase()}
												</div>

												<div>
													<p className='text-sm font-medium text-slate-900'>
														{user.name}
													</p>

													<p className='text-xs text-slate-500'>
														{user.email}
													</p>
												</div>
											</div>
										</td>

										<td className='px-5 py-4 text-sm text-slate-600'>
											{user.mobile}
										</td>

										<td className='px-5 py-4'>
											<span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700'>
												{user.role}
											</span>
										</td>

										<td className='px-5 py-4 text-sm text-slate-600'>
											{user.flatNumber
												? `Flat ${user.flatNumber}`
												: '-'}
										</td>

										<td className='px-5 py-4'>
											<span
												className={`rounded-full px-2.5 py-1 text-xs font-medium ${
													user.status ===
													'Active'
														? 'bg-emerald-50 text-emerald-700'
														: 'bg-red-50 text-red-700'
												}`}>
												{user.status}
											</span>
										</td>

										<td className='px-5 py-4'>
											<div className='flex justify-end gap-2'>
												<Link
													to={`/admin/users/${user._id}/edit`}
													className='rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'>
													<Edit
														size={17}
													/>
												</Link>

												<button
													type='button'
													disabled={
														isDeleting ||
														user.role ===
															'admin'
													}
													onClick={() =>
														handleDelete(
															user
														)
													}
													className='rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40'>
													<Trash2
														size={17}
													/>
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserListScreen;