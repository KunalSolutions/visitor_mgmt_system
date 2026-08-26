import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	ScrollView,
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
	floorNumber?: number | null;
	status?: string;
};

export default function AdminUserScreen() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await api.get('/users');
				setUsers(response.data);
			} catch (error: any) {
				setError(
					error?.response?.data?.message ||
						error?.message ||
						'Failed to load users'
				);
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" />
				<Text style={styles.loadingText}>
					Loading users...
				</Text>
			</View>
		);
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Users</Text>

			<Text style={styles.subtitle}>
				All registered users
			</Text>

			{error ? (
				<View style={styles.errorBox}>
					<Text style={styles.errorText}>
						{error}
					</Text>
				</View>
			) : null}

			{users.map((user) => (
				<View key={user._id} style={styles.card}>
					<Text style={styles.name}>
						{user.name}
					</Text>

					<Text style={styles.info}>
						{user.email}
					</Text>

					<Text style={styles.info}>
						Role: {user.role}
					</Text>

					{user.flatNumber ? (
						<Text style={styles.info}>
							Flat: {user.flatNumber}
						</Text>
					) : null}

					{user.floorNumber ? (
						<Text style={styles.info}>
							Floor: {user.floorNumber}
						</Text>
					) : null}

					{user.status ? (
						<Text style={styles.info}>
							Status: {user.status}
						</Text>
					) : null}
				</View>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		paddingBottom: 40,
		backgroundColor: '#f8fafc',
		flexGrow: 1,
	},

	center: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f8fafc',
	},

	loadingText: {
		marginTop: 10,
		color: '#64748b',
	},

	title: {
		marginTop: 30,
		fontSize: 28,
		fontWeight: '700',
		color: '#0f172a',
	},

	subtitle: {
		marginTop: 4,
		marginBottom: 20,
		fontSize: 15,
		color: '#64748b',
	},

	card: {
		marginBottom: 12,
		padding: 16,
		borderRadius: 14,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},

	name: {
		fontSize: 17,
		fontWeight: '700',
		color: '#0f172a',
		marginBottom: 6,
	},

	info: {
		marginTop: 4,
		fontSize: 14,
		color: '#475569',
	},

	errorBox: {
		marginBottom: 16,
		padding: 14,
		borderRadius: 12,
		backgroundColor: '#fef2f2',
	},

	errorText: {
		color: '#dc2626',
		fontSize: 14,
	},
});