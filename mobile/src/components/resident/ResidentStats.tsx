import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {
	Check,
	Clock3,
	Users,
	UsersRound,
} from 'lucide-react-native';

import api from '@/services/api';

type Visitor = {
	_id: string;
	status?: string;
	createdAt?: string;
	meetWith?: {
		_id?: string;
	};
};

type User = {
	_id: string;
};

export default function ResidentStats() {
	const [visitors, setVisitors] = useState<Visitor[]>([]);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchData = useCallback(async () => {
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

			const visitorData = visitorsResponse.data;

			setUser(profile);

			setVisitors(
				Array.isArray(visitorData)
					? visitorData
					: visitorData?.visitors || []
			);
		} catch (error) {
			console.error(
				'Resident stats error:',
				error
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	if (loading) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator
					size="small"
					color="#232466"
				/>

				<Text style={styles.loadingText}>
					Updating visitor information...
				</Text>
			</View>
		);
	}

	const residentVisitors = visitors.filter(
		(visitor) =>
			visitor.meetWith?._id?.toString() ===
			user?._id?.toString()
	);

	const today = new Date().toDateString();

	const todayVisitors = residentVisitors.filter(
		(visitor) =>
			visitor.createdAt &&
			new Date(visitor.createdAt).toDateString() ===
				today
	);

	const pendingVisitors = residentVisitors.filter(
		(visitor) => visitor.status === 'Pending'
	);

	const approvedVisitors = todayVisitors.filter(
		(visitor) => visitor.status === 'Approved'
	);

	const stats = [
		{
			title: 'Pending Requests',
			value: pendingVisitors.length,
			label: 'Need your response',
			icon: Clock3,
		},
		{
			title: "Today's Visitors",
			value: todayVisitors.length,
			label: 'Registered today',
			icon: Users,
		},
		{
			title: 'Approved Today',
			value: approvedVisitors.length,
			label: 'Approved visitors',
			icon: Check,
		},
		{
			title: 'Total Visitors',
			value: residentVisitors.length,
			label: 'All visitor requests',
			icon: UsersRound,
		},
	];

	return (
		<View style={styles.wrapper}>
			<View style={styles.header}>
				<View>
					<Text style={styles.title}>
						Overview
					</Text>

					<Text style={styles.subtitle}>
						Your visitor activity
					</Text>
				</View>

				<View style={styles.liveBadge}>
					<View style={styles.liveDot} />

					<Text style={styles.liveText}>
						Live
					</Text>
				</View>
			</View>

			<View style={styles.grid}>
				{stats.map((stat) => {
					const Icon = stat.icon;

					return (
						<View
							key={stat.title}
							style={styles.card}
						>
							<View style={styles.topRow}>
								<View style={styles.iconContainer}>
									<Icon
										size={19}
										color="#232466"
										strokeWidth={2.2}
									/>
								</View>

								<View style={styles.accentDot} />
							</View>

							<Text style={styles.value}>
								{stat.value}
							</Text>

							<Text style={styles.cardTitle}>
								{stat.title}
							</Text>

							<Text style={styles.label}>
								{stat.label}
							</Text>
						</View>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		marginTop: 24,
		backgroundColor: '#FFFFFF',
	},

	loading: {
		minHeight: 150,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
	},

	loadingText: {
		marginTop: 8,
		fontSize: 11,
		color: '#64748B',
	},

	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 13,
	},

	title: {
		fontSize: 19,
		fontWeight: '800',
		letterSpacing: -0.3,
		color: '#232466',
	},

	subtitle: {
		marginTop: 3,
		fontSize: 12,
		color: '#64748B',
	},

	liveBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 20,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	liveDot: {
		width: 7,
		height: 7,
		marginRight: 6,
		borderRadius: 4,
		backgroundColor: '#EF5622',
	},

	liveText: {
		fontSize: 11,
		fontWeight: '700',
		color: '#232466',
	},

	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		gap: 12,
	},

	card: {
		width: '48%',
		minHeight: 152,
		padding: 17,
		borderRadius: 17,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	topRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	iconContainer: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 12,
		backgroundColor: '#F4F4FA',
	},

	accentDot: {
		width: 7,
		height: 7,
		borderRadius: 4,
		backgroundColor: '#EF5622',
	},

	value: {
		marginTop: 16,
		fontSize: 29,
		fontWeight: '800',
		letterSpacing: -0.7,
		color: '#232466',
	},

	cardTitle: {
		marginTop: 3,
		fontSize: 14,
		fontWeight: '700',
		color: '#232466',
	},

	label: {
		marginTop: 4,
		fontSize: 11,
		lineHeight: 16,
		color: '#64748B',
	},
});