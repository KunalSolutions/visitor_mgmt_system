import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {
	CalendarDays,
	Phone,
	UserRound,
} from 'lucide-react-native';

import api from '@/services/api';

type Visitor = {
	_id: string;
	visitorName?: string;
	mobile?: string;
	purpose?: string;
	status?: string;
	createdAt?: string;
	meetWith?: {
		_id?: string;
	};
};

type User = {
	_id: string;
};

export default function ResidentRecentVisitors() {
	const [visitors, setVisitors] = useState<Visitor[]>([]);
	const [userId, setUserId] = useState('');
	const [loading, setLoading] = useState(true);

	const fetchVisitors = useCallback(async () => {
		try {
			const [profileResponse, visitorsResponse] =
				await Promise.all([
					api.get('/users/profile'),
					api.get('/visitors'),
				]);

			const profile =
				profileResponse.data?.user ||
				profileResponse.data?.data ||
				profileResponse.data;

			const data = visitorsResponse.data;

			setUserId(profile?._id || '');

			const allVisitors = Array.isArray(data)
				? data
				: data?.visitors || [];

			setVisitors(allVisitors);
		} catch (error) {
			console.error(
				'Resident recent visitors error:',
				error
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchVisitors();
	}, [fetchVisitors]);

	const residentVisitors = visitors
		.filter(
			(visitor) =>
				visitor.meetWith?._id?.toString() ===
				userId?.toString()
		)
		.sort(
			(a, b) =>
				new Date(b.createdAt || 0).getTime() -
				new Date(a.createdAt || 0).getTime()
		)
		.slice(0, 10);

	const getStatusStyle = (status?: string) => {
		switch (status) {
			case 'Approved':
				return styles.approved;

			case 'Rejected':
				return styles.rejected;

			default:
				return styles.pending;
		}
	};

	const getStatusTextStyle = (status?: string) => {
		switch (status) {
			case 'Approved':
				return styles.approvedText;

			case 'Rejected':
				return styles.rejectedText;

			default:
				return styles.pendingText;
		}
	};

	if (loading) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator
					size="small"
					color="#232466"
				/>

				<Text style={styles.loadingText}>
					Loading visitor history...
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Text style={styles.title}>
						Recent Visitors
					</Text>

					<Text style={styles.subtitle}>
						Your latest visitor requests and visits.
					</Text>
				</View>

				<Text style={styles.count}>
					{residentVisitors.length}
				</Text>
			</View>

			{residentVisitors.length === 0 ? (
				<View style={styles.empty}>
					<View style={styles.emptyIcon}>
						<UserRound
							size={24}
							color="#232466"
							strokeWidth={1.8}
						/>
					</View>

					<Text style={styles.emptyTitle}>
						No visitor records
					</Text>

					<Text style={styles.emptyText}>
						Your visitor history will appear here.
					</Text>
				</View>
			) : (
				<View style={styles.list}>
					{residentVisitors.map((visitor) => {
						const name =
							visitor.visitorName ||
							'Unknown Visitor';

						return (
							<View
								key={visitor._id}
								style={styles.card}
							>
								<View style={styles.top}>
									<View style={styles.avatar}>
										<Text
											style={
												styles.avatarText
											}
										>
											{name
												.charAt(0)
												.toUpperCase()}
										</Text>
									</View>

									<View
										style={
											styles.visitorInfo
										}
									>
										<Text
											style={
												styles.name
											}
											numberOfLines={1}
										>
											{name}
										</Text>

										<View
											style={
												styles.metaRow
											}
										>
											<Phone
												size={12}
												color="#64748B"
											/>

											<Text
												style={
													styles.metaText
												}
											>
												{visitor.mobile ||
													'No mobile number'}
											</Text>
										</View>
									</View>

									<View
										style={[
											styles.statusBadge,
											getStatusStyle(
												visitor.status
											),
										]}
									>
										<Text
											style={[
												styles.statusText,
												getStatusTextStyle(
													visitor.status
												),
											]}
										>
											{visitor.status ||
												'Pending'}
										</Text>
									</View>
								</View>

								<View style={styles.divider} />

								<View style={styles.detailRow}>
									<View style={styles.detailLeft}>
										<CalendarDays
											size={14}
											color="#64748B"
										/>

										<Text
											style={
												styles.detailLabel
											}
										>
											Date
										</Text>
									</View>

									<Text
										style={
											styles.detailValue
										}
									>
										{visitor.createdAt
											? new Date(
													visitor.createdAt
											  ).toLocaleDateString(
													undefined,
													{
														day: '2-digit',
														month: 'short',
														year: 'numeric',
													}
											  )
											: '—'}
									</Text>
								</View>

								<View style={styles.detailRow}>
									<View>
										<Text
											style={
												styles.detailLabel
											}
										>
											Purpose
										</Text>
									</View>

									<Text
										style={
											styles.detailValue
										}
										numberOfLines={1}
									>
										{visitor.purpose || '—'}
									</Text>
								</View>
							</View>
						);
					})}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 28,
		borderRadius: 18,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
		overflow: 'hidden',
	},

	loading: {
		minHeight: 160,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
	},

	loadingText: {
		marginTop: 8,
		fontSize: 12,
		color: '#64748B',
	},

	header: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		padding: 17,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5EC',
	},

	headerLeft: {
		flex: 1,
		paddingRight: 12,
	},

	title: {
		fontSize: 16,
		fontWeight: '800',
		color: '#232466',
	},

	subtitle: {
		marginTop: 5,
		fontSize: 11,
		lineHeight: 16,
		color: '#64748B',
	},

	count: {
		minWidth: 28,
		paddingHorizontal: 8,
		paddingVertical: 5,
		textAlign: 'center',
		borderRadius: 14,
		backgroundColor: '#F4F4FA',
		fontSize: 11,
		fontWeight: '800',
		color: '#232466',
	},

	list: {
		padding: 12,
	},

	card: {
		marginBottom: 10,
		padding: 15,
		borderRadius: 15,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	top: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	avatar: {
		width: 44,
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 22,
		backgroundColor: '#232466',
		borderWidth: 1,
		borderColor: '#EF5622',
	},

	avatarText: {
		fontSize: 16,
		fontWeight: '800',
		color: '#FFFFFF',
	},

	visitorInfo: {
		flex: 1,
		marginLeft: 11,
		marginRight: 8,
	},

	name: {
		fontSize: 14,
		fontWeight: '700',
		color: '#232466',
	},

	metaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 4,
	},

	metaText: {
		marginLeft: 4,
		fontSize: 11,
		color: '#64748B',
	},

	statusBadge: {
		paddingHorizontal: 9,
		paddingVertical: 5,
		borderRadius: 20,
	},

	approved: {
		backgroundColor: '#F1F1F8',
	},

	rejected: {
		backgroundColor: '#FFF1EC',
	},

	pending: {
		backgroundColor: '#FFF8F4',
	},

	statusText: {
		fontSize: 10,
		fontWeight: '700',
	},

	approvedText: {
		color: '#232466',
	},

	rejectedText: {
		color: '#EF5622',
	},

	pendingText: {
		color: '#232466',
	},

	divider: {
		height: 1,
		marginVertical: 12,
		backgroundColor: '#E5E5EC',
	},

	detailRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 8,
	},

	detailLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	detailLabel: {
		marginLeft: 6,
		fontSize: 11,
		color: '#64748B',
	},

	detailValue: {
		maxWidth: '65%',
		fontSize: 12,
		fontWeight: '600',
		textAlign: 'right',
		color: '#334155',
	},

	empty: {
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 36,
	},

	emptyIcon: {
		width: 48,
		height: 48,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 14,
		backgroundColor: '#F4F4FA',
	},

	emptyTitle: {
		marginTop: 11,
		fontSize: 14,
		fontWeight: '700',
		color: '#232466',
	},

	emptyText: {
		marginTop: 4,
		fontSize: 11,
		textAlign: 'center',
		color: '#64748B',
	},
});