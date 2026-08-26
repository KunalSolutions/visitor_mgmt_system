const StatCard = ({
	title,
	value,
	icon: Icon,
	description,
	iconBg = 'bg-indigo-50',
	iconColor = 'text-indigo-600',
}) => {
	return (
		<div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
			<div className='flex items-start justify-between'>
				<div>
					<p className='text-sm font-medium text-slate-500'>
						{title}
					</p>

					<h3 className='mt-2 text-2xl font-semibold text-slate-900'>
						{value}
					</h3>

					{description && (
						<p className='mt-1 text-xs text-slate-500'>
							{description}
						</p>
					)}
				</div>

				<div
					className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconBg}`}>
					<Icon size={21} className={iconColor} />
				</div>
			</div>
		</div>
	);
};

export default StatCard;