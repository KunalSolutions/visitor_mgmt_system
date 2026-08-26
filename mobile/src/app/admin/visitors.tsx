import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {
	ShieldCheck,
	Users,
	UserRound,
	UsersRound,
} from 'lucide-react-native';

import api from '@/services/api';

type User = {
	_id: string;
	role: string;
};

type Visitor = {
	_id: string;
	status?: string;
	createdAt?: string;
};

export default function AdminStats() {
	const [users, setUsers] = useState<User[]>([]);
	const [visitors, setVisitors] = useState<Visitor[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchStats = useCallback(async () => {
		try {
			const [usersResponse, visitorsResponse] =
				await Promise.all([
					api.get('/users'),
					api.get('/visitors'),
				]);

			const usersData = usersResponse.data;
			const visitorsData = visitorsResponse.data;

			setUsers(
				Array.isArray(usersData)
					? usersData
					: usersData?.users || []
			);

			setVisitors(
				Array.isArray(visitorsData)
					? visitorsData
					: visitorsData?.visitors || []
			);
		} catch (error) {
			console.error('Dashboard stats error:', error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	const totalUsers = users.length;

	const residents = users.filter(
		(user) => user.role === 'resident'
	).length;

	const security = users.filter(
		(user) => user.role === 'security'
	).length;

	const totalVisitors = visitors.length;

	const stats = [
		{
			title: 'Total Users',
			value: totalUsers,
			label: 'Registered users',
			icon: Users,
		},
		{
			title: 'Residents',
			value: residents,
			label: 'Active residents',
			icon: UserRound,
		},
		{
			title: 'Security',
			value: security,
			label: 'Security staff',
			icon: ShieldCheck,
		},
		{
			title: 'Visitors',
			value: totalVisitors,
			label: 'Total visitors',
			icon: UsersRound,
		},
	];

	if (loading) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator
					size="small"
					color="#232466"
				/>

				<Text style={styles.loadingText}>
					Updating dashboard...
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.wrapper}>
			<View style={styles.sectionHeader}>
				<View>
					<Text style={styles.sectionTitle}>
						Overview
					</Text>

					<Text style={styles.sectionSubtitle}>
						Your community at a glance
					</Text>
				</View>

				<View style={styles.liveIndicator}>
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
							<View style={styles.cardTop}>
								<View style={styles.iconContainer}>
									<Icon
										size={20}
										color="#232466"
										strokeWidth={2}
									/>
								</View>

								<View style={styles.orangeAccent} />
							</View>

							<Text style={styles.value}>
								{stat.value}
							</Text>

							<Text style={styles.title}>
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
		width: '100%',
	},

	loading: {
		minHeight: 180,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
	},

	loadingText: {
		marginTop: 8,
		fontSize: 12,
		color: '#64748B',
	},

	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 14,
	},

	sectionTitle: {
		fontSize: 19,
		fontWeight: '800',
		letterSpacing: -0.3,
		color: '#232466',
	},

	sectionSubtitle: {
		marginTop: 3,
		fontSize: 12,
		color: '#64748B',
	},

	liveIndicator: {
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
		minHeight: 158,
		padding: 17,
		borderRadius: 18,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	cardTop: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	iconContainer: {
		width: 42,
		height: 42,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 12,
		backgroundColor: '#F4F4FA',
	},

	orangeAccent: {
		width: 7,
		height: 7,
		borderRadius: 4,
		backgroundColor: '#EF5622',
	},

	value: {
		marginTop: 17,
		fontSize: 30,
		fontWeight: '800',
		letterSpacing: -1,
		color: '#232466',
	},

	title: {
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