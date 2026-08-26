import { useRouter } from 'expo-router';
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useEffect, useState } from 'react';

import api from '@/services/api';

type User = {
	_id: string;
	name: string;
	email: string;
	role: string;
	flatNumber?: string | null;
	floorNumber?: string | number | null;
	status?: string;
	mobile?: string | null;
};

export default function ProfileScreen() {
	const router = useRouter();

	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				setError('');

				/*
				 * Change this endpoint if your backend
				 * uses a different "current user" endpoint.
				 */
				const response = await api.get('/users/profile');

				setUser(
					response.data?.user ||
						response.data?.data ||
						response.data
				);
			} catch (error: any) {
				console.error(error);

				setError(
					error?.response?.data?.message ||
						error?.message ||
						'Failed to load profile'
				);
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	const handleLogout = () => {
		router.replace('/login');
	};

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator
					size="large"
					color="#232466"
				/>

				<Text style={styles.loadingText}>
					Loading profile...
				</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorTitle}>
					Unable to load profile
				</Text>

				<Text style={styles.errorText}>
					{error}
				</Text>

				<Pressable
					style={styles.backButton}
					onPress={() =>
						router.replace('/admin/dashboard')
					}
				>
					<Text style={styles.backButtonText}>
						Back to Dashboard
					</Text>
				</Pressable>
			</View>
		);
	}

	if (!user) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorTitle}>
					Profile not found
				</Text>

				<Pressable
					style={styles.backButton}
					onPress={() =>
						router.replace('/admin/dashboard')
					}
				>
					<Text style={styles.backButtonText}>
						Back to Dashboard
					</Text>
				</Pressable>
			</View>
		);
	}

	const initials = user.name
		?.split(' ')
		.map((part) => part.charAt(0))
		.join('')
		.substring(0, 2)
		.toUpperCase();

	return (
		<ScrollView
			contentContainerStyle={styles.container}
			showsVerticalScrollIndicator={false}
		>
			<View style={styles.header}>
				<Pressable
					onPress={() =>
						router.replace('/admin/dashboard')
					}
					style={styles.back}
				>
					<Text style={styles.backIcon}>‹</Text>

					<Text style={styles.backText}>
						Dashboard
					</Text>
				</Pressable>

				<Text style={styles.headerTitle}>
					Profile
				</Text>

				<View style={styles.headerSpacer} />
			</View>

			<View style={styles.profileCard}>
				<View style={styles.avatar}>
					<Text style={styles.avatarText}>
						{initials || 'U'}
					</Text>
				</View>

				<Text style={styles.name}>
					{user.name}
				</Text>

				<View style={styles.roleBadge}>
					<Text style={styles.roleText}>
						{user.role}
					</Text>
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>
					Account Information
				</Text>

				<View style={styles.infoCard}>
					<View style={styles.infoRow}>
						<Text style={styles.label}>
							Name
						</Text>

						<Text style={styles.value}>
							{user.name}
						</Text>
					</View>

					<View style={styles.divider} />

					<View style={styles.infoRow}>
						<Text style={styles.label}>
							Email
						</Text>

						<Text style={styles.value}>
							{user.email}
						</Text>
					</View>

					{user.mobile ? (
						<>
							<View style={styles.divider} />

							<View style={styles.infoRow}>
								<Text style={styles.label}>
									Mobile
								</Text>

								<Text style={styles.value}>
									{user.mobile}
								</Text>
							</View>
						</>
					) : null}

					<View style={styles.divider} />

					<View style={styles.infoRow}>
						<Text style={styles.label}>
							Role
						</Text>

						<Text style={styles.value}>
							{user.role}
						</Text>
					</View>

					{user.status ? (
						<>
							<View style={styles.divider} />

							<View style={styles.infoRow}>
								<Text style={styles.label}>
									Status
								</Text>

								<Text
									style={[
										styles.value,
										styles.status,
									]}
								>
									{user.status}
								</Text>
							</View>
						</>
					) : null}
				</View>
			</View>

			{user.role === 'resident' ? (
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Residence
					</Text>

					<View style={styles.infoCard}>
						{user.flatNumber ? (
							<View style={styles.infoRow}>
								<Text style={styles.label}>
									Flat
								</Text>

								<Text style={styles.value}>
									{user.flatNumber}
								</Text>
							</View>
						) : null}

						{user.floorNumber ? (
							<>
								<View style={styles.divider} />

								<View style={styles.infoRow}>
									<Text style={styles.label}>
										Floor
									</Text>

									<Text style={styles.value}>
										{user.floorNumber}
									</Text>
								</View>
							</>
						) : null}
					</View>
				</View>
			) : null}

			<Pressable
				style={({ pressed }) => [
					styles.logoutButton,
					pressed && styles.pressed,
				]}
				onPress={handleLogout}
			>
				<Text style={styles.logoutText}>
					Logout
				</Text>
			</Pressable>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		paddingBottom: 40,
		backgroundColor: '#f8fafc',
	},

	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 55,
		paddingHorizontal: 20,
		paddingBottom: 18,
		backgroundColor: '#ffffff',
		borderBottomWidth: 1,
		borderBottomColor: '#e2e8f0',
	},

	back: {
		flexDirection: 'row',
		alignItems: 'center',
		width: 100,
	},

	backIcon: {
		fontSize: 30,
		lineHeight: 30,
		color: '#232466',
	},

	backText: {
		marginLeft: 4,
		fontSize: 13,
		fontWeight: '600',
		color: '#232466',
	},

	headerTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#0f172a',
	},

	headerSpacer: {
		width: 100,
	},

	profileCard: {
		alignItems: 'center',
		paddingVertical: 30,
		paddingHorizontal: 20,
		backgroundColor: '#ffffff',
	},

	avatar: {
		width: 82,
		height: 82,
		borderRadius: 41,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#232466',
	},

	avatarText: {
		fontSize: 28,
		fontWeight: '700',
		color: '#ffffff',
	},

	name: {
		marginTop: 14,
		fontSize: 22,
		fontWeight: '700',
		color: '#0f172a',
	},

	roleBadge: {
		marginTop: 8,
		paddingHorizontal: 12,
		paddingVertical: 5,
		borderRadius: 20,
		backgroundColor: '#eef2ff',
	},

	roleText: {
		fontSize: 12,
		fontWeight: '700',
		color: '#232466',
		textTransform: 'capitalize',
	},

	section: {
		marginTop: 24,
		paddingHorizontal: 20,
	},

	sectionTitle: {
		marginBottom: 10,
		fontSize: 17,
		fontWeight: '700',
		color: '#0f172a',
	},

	infoCard: {
		padding: 18,
		borderRadius: 16,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},

	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		minHeight: 30,
	},

	label: {
		fontSize: 13,
		color: '#64748b',
	},

	value: {
		maxWidth: '65%',
		fontSize: 14,
		fontWeight: '600',
		color: '#334155',
		textAlign: 'right',
		textTransform: 'capitalize',
	},

	status: {
		color: '#047857',
	},

	divider: {
		height: 1,
		marginVertical: 12,
		backgroundColor: '#e2e8f0',
	},

	logoutButton: {
		marginTop: 30,
		marginHorizontal: 20,
		paddingVertical: 15,
		alignItems: 'center',
		borderRadius: 14,
		backgroundColor: '#ef5622',
	},

	logoutText: {
		fontSize: 15,
		fontWeight: '700',
		color: '#ffffff',
	},

	pressed: {
		opacity: 0.7,
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
		fontSize: 18,
		fontWeight: '700',
		color: '#b91c1c',
	},

	errorText: {
		marginTop: 6,
		fontSize: 14,
		textAlign: 'center',
		color: '#dc2626',
	},

	backButton: {
		marginTop: 20,
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 10,
		backgroundColor: '#232466',
	},

	backButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#ffffff',
	},
});
