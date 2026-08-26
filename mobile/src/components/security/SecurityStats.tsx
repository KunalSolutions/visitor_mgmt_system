import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {
	Clock3,
	UserRound,
	UsersRound,
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
		name?: string;
		flatNumber?: string;
	};
};

export default function SecurityStats() {
	const [visitors, setVisitors] = useState<Visitor[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchVisitors = useCallback(async () => {
		try {
			const response = await api.get('/visitors');

			const data = response.data;

			setVisitors(
				Array.isArray(data)
					? data
					: data?.visitors || []
			);
		} catch (error) {
			console.error(
				"Today's visitors error:",
				error
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchVisitors();
	}, [fetchVisitors]);

	const todayVisitors = useMemo(() => {
		const today = new Date();

		return visitors.filter((visitor) => {
			if (!visitor.createdAt) return false;

			const date = new Date(visitor.createdAt);

			return (
				date.getDate() === today.getDate() &&
				date.getMonth() === today.getMonth() &&
				date.getFullYear() === today.getFullYear()
			);
		});
	}, [visitors]);

	const getStatusStyle = (status?: string) => {
		if (status === 'Approved') {
			return styles.approved;
		}

		if (status === 'Rejected') {
			return styles.rejected;
		}

		return styles.pending;
	};

	const getStatusTextStyle = (status?: string) => {
		if (status === 'Approved') {
			return styles.approvedText;
		}

		if (status === 'Rejected') {
			return styles.rejectedText;
		}

		return styles.pendingText;
	};

	if (loading) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator
					size="small"
					color="#232466"
				/>

				<Text style={styles.loadingText}>
					Loading today's visitors...
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Text style={styles.title}>
						Today's Visitors
					</Text>

					<Text style={styles.subtitle}>
						Visitors registered at the security
						desk today
					</Text>
				</View>

				<Text style={styles.count}>
					{todayVisitors.length}{' '}
					{todayVisitors.length === 1
						? 'visitor'
						: 'visitors'}
				</Text>
			</View>

			{todayVisitors.length === 0 ? (
				<View style={styles.empty}>
					<View style={styles.emptyIcon}>
						<UsersRound
							size={24}
							color="#232466"
							strokeWidth={1.8}
						/>
					</View>

					<Text style={styles.emptyTitle}>
						No visitors registered today
					</Text>

					<Text style={styles.emptyText}>
						New visitor registrations will appear
						here.
					</Text>
				</View>
			) : (
				<View style={styles.list}>
					{todayVisitors.map((visitor) => (
						<View
							key={visitor._id}
							style={styles.visitorCard}
						>
							<View style={styles.visitorHeader}>
								<View style={styles.avatar}>
									<Text style={styles.avatarText}>
										{visitor.visitorName
											?.charAt(0)
											?.toUpperCase() || 'V'}
									</Text>
								</View>

								<View style={styles.visitorMain}>
									<Text
										style={styles.visitorName}
										numberOfLines={1}
									>
										{visitor.visitorName ||
											'Unknown Visitor'}
									</Text>

									<View style={styles.mobileRow}>
										<Clock3
											size={12}
											color="#64748B"
											strokeWidth={2}
										/>

										<Text style={styles.mobile}>
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

							<View style={styles.infoRow}>
								<Text style={styles.label}>
									Meet With
								</Text>

								<View style={styles.infoRight}>
									<Text style={styles.value}>
										{visitor.meetWith?.name ||
											'—'}
									</Text>

									{visitor.meetWith
										?.flatNumber ? (
										<Text
											style={styles.subValue}
										>
											Flat{' '}
											{
												visitor
													.meetWith
													.flatNumber
											}
										</Text>
									) : null}
								</View>
							</View>

							<View style={styles.infoRow}>
								<Text style={styles.label}>
									Purpose
								</Text>

								<Text
									style={styles.value}
									numberOfLines={1}
								>
									{visitor.purpose || '—'}
								</Text>
							</View>
						</View>
					))}
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

	header: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		paddingHorizontal: 17,
		paddingVertical: 16,
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
		paddingTop: 2,
		fontSize: 11,
		fontWeight: '700',
		color: '#64748B',
	},

	list: {
		padding: 12,
	},

	visitorCard: {
		padding: 14,
		marginBottom: 10,
		borderRadius: 14,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	visitorHeader: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	avatar: {
		width: 42,
		height: 42,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 21,
		backgroundColor: '#232466',
	},

	avatarText: {
		fontSize: 16,
		fontWeight: '800',
		color: '#FFFFFF',
	},

	visitorMain: {
		flex: 1,
		marginLeft: 11,
		marginRight: 8,
	},

	visitorName: {
		fontSize: 14,
		fontWeight: '700',
		color: '#0F172A',
	},

	mobileRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 4,
	},

	mobile: {
		marginLeft: 4,
		fontSize: 11,
		color: '#64748B',
	},

	statusBadge: {
		paddingHorizontal: 9,
		paddingVertical: 5,
		borderRadius: 20,
	},

	statusText: {
		fontSize: 10,
		fontWeight: '700',
	},

	approved: {
		backgroundColor: '#F0F1F8',
	},

	approvedText: {
		color: '#232466',
	},

	rejected: {
		backgroundColor: '#FFF1EC',
	},

	rejectedText: {
		color: '#EF5622',
	},

	pending: {
		backgroundColor: '#FFF8F4',
	},

	pendingText: {
		color: '#232466',
	},

	divider: {
		height: 1,
		marginVertical: 12,
		backgroundColor: '#E5E5EC',
	},

	infoRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		marginTop: 7,
	},

	label: {
		fontSize: 11,
		color: '#64748B',
	},

	infoRight: {
		maxWidth: '65%',
		alignItems: 'flex-end',
	},

	value: {
		maxWidth: '65%',
		fontSize: 12,
		fontWeight: '600',
		color: '#334155',
		textAlign: 'right',
	},

	subValue: {
		marginTop: 2,
		fontSize: 10,
		color: '#64748B',
	},

	empty: {
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 35,
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
		marginTop: 12,
		fontSize: 14,
		fontWeight: '700',
		color: '#232466',
	},

	emptyText: {
		marginTop: 5,
		fontSize: 11,
		textAlign: 'center',
		lineHeight: 16,
		color: '#64748B',
	},

	loading: {
		marginTop: 28,
		minHeight: 160,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 18,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	loadingText: {
		marginTop: 8,
		fontSize: 11,
		color: '#64748B',
	},
});