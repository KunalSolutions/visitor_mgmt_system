import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	StyleSheet,
	Text,
	View,
} from 'react-native';

import api from '@/services/api';

type User = {
	_id: string;
	name: string;
	email: string;
	role: string;
	flatNumber?: string | null;
	floorNumber?: string | number | null;
	status?: string;
};

export default function AdminUsersScreen() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState('');

	const fetchUsers = useCallback(async () => {
		try {
			setError('');

			const response = await api.get('/users');

			const data = response.data;

			if (Array.isArray(data)) {
				setUsers(data);
			} else if (Array.isArray(data.users)) {
				setUsers(data.users);
			} else if (Array.isArray(data.data)) {
				setUsers(data.data);
			} else {
				setUsers([]);
			}
		} catch (error: any) {
			console.error(error);

			setError(
				error?.response?.data?.message ||
					error?.message ||
					'Failed to load users'
			);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const handleRefresh = () => {
		setRefreshing(true);
		fetchUsers();
	};

	const renderUser = ({ item }: { item: User }) => (
		<View style={styles.card}>
			<View style={styles.avatar}>
				<Text style={styles.avatarText}>
					{item.name?.charAt(0)?.toUpperCase()}
				</Text>
			</View>

			<View style={styles.info}>
				<Text style={styles.name}>
					{item.name}
				</Text>

				<Text style={styles.email}>
					{item.email}
				</Text>

				<View style={styles.row}>
					<View style={styles.roleBadge}>
						<Text style={styles.roleText}>
							{item.role}
						</Text>
					</View>

					{item.flatNumber ? (
						<Text style={styles.detail}>
							Flat {item.flatNumber}
						</Text>
					) : null}

					{item.floorNumber ? (
						<Text style={styles.detail}>
							Floor {item.floorNumber}
						</Text>
					) : null}
				</View>
			</View>
		</View>
	);

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator
					size="large"
					color="#232466"
				/>

				<Text style={styles.loadingText}>
					Loading users...
				</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorTitle}>
					Unable to load users
				</Text>

				<Text style={styles.errorText}>
					{error}
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>
					Users
				</Text>

				<Text style={styles.count}>
					{users.length} users
				</Text>
			</View>

			<FlatList
				data={users}
				keyExtractor={(item) => item._id}
				renderItem={renderUser}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
					/>
				}
				ListEmptyComponent={
					<View style={styles.empty}>
						<Text style={styles.emptyTitle}>
							No users found
						</Text>

						<Text style={styles.emptyText}>
							There are no users available.
						</Text>
					</View>
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},

	header: {
		paddingTop: 55,
		paddingHorizontal: 20,
		paddingBottom: 18,
		backgroundColor: '#ffffff',
		borderBottomWidth: 1,
		borderBottomColor: '#e2e8f0',
	},

	title: {
		fontSize: 26,
		fontWeight: '700',
		color: '#0f172a',
	},

	count: {
		marginTop: 4,
		fontSize: 13,
		color: '#64748b',
	},

	list: {
		padding: 20,
		paddingBottom: 40,
	},

	card: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
		padding: 16,
		borderRadius: 16,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},

	avatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#232466',
	},

	avatarText: {
		fontSize: 18,
		fontWeight: '700',
		color: '#ffffff',
	},

	info: {
		flex: 1,
		marginLeft: 14,
	},

	name: {
		fontSize: 16,
		fontWeight: '700',
		color: '#0f172a',
	},

	email: {
		marginTop: 4,
		fontSize: 13,
		color: '#64748b',
	},

	row: {
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: 8,
		marginTop: 8,
	},

	roleBadge: {
		paddingHorizontal: 9,
		paddingVertical: 4,
		borderRadius: 8,
		backgroundColor: '#eef2ff',
	},

	roleText: {
		fontSize: 11,
		fontWeight: '700',
		color: '#232466',
		textTransform: 'capitalize',
	},

	detail: {
		fontSize: 12,
		color: '#64748b',
	},

	center: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#f8fafc',
	},

	loadingText: {
		marginTop: 10,
		fontSize: 14,
		color: '#64748b',
	},

	errorTitle: {
		fontSize: 17,
		fontWeight: '700',
		color: '#b91c1c',
	},

	errorText: {
		marginTop: 6,
		fontSize: 14,
		textAlign: 'center',
		color: '#dc2626',
	},

	empty: {
		alignItems: 'center',
		padding: 40,
	},

	emptyTitle: {
		fontSize: 17,
		fontWeight: '700',
		color: '#0f172a',
	},

	emptyText: {
		marginTop: 6,
		fontSize: 14,
		color: '#64748b',
	},
});
