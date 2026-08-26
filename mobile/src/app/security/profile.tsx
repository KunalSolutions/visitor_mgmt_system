import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { router } from 'expo-router';
import {
	ArrowLeft,
	Mail,
	Phone,
	ShieldCheck,
	Building2,
	Hash,
	LogOut,
	UserRound,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '@/services/api';

type User = {
	_id: string;
	name: string;
	email: string;
	mobile?: string;
	role: string;
	flatNumber?: string | null;
	floorNumber?: string | number | null;
	status?: string;
};

export default function SecurityProfileScreen() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchProfile = useCallback(async () => {
		try {
			const response = await api.get('/users/profile');

			setUser(response.data);
		} catch (error) {
			console.error('Profile error:', error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

	const handleLogout = async () => {
		try {
			await api.post('/users/logout');
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			await AsyncStorage.removeItem('token');
			router.replace('/login');
		}
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

	if (!user) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorTitle}>
					Unable to load profile
				</Text>

				<Pressable
					onPress={() => router.back()}
					style={styles.backButton}
				>
					<Text style={styles.backButtonText}>
						Go Back
					</Text>
				</Pressable>
			</View>
		);
	}

	const initials = user.name
		?.split(' ')
		.map((word) => word.charAt(0))
		.join('')
		.slice(0, 2)
		.toUpperCase();

	return (
		<ScrollView
			style={styles.screen}
			contentContainerStyle={styles.container}
			showsVerticalScrollIndicator={false}
		>
			<View style={styles.header}>
				<Pressable
					onPress={() => router.back()}
					style={({ pressed }) => [
						styles.headerButton,
						pressed && styles.pressed,
					]}
				>
					<ArrowLeft
						size={21}
						color="#232466"
						strokeWidth={2.2}
					/>
				</Pressable>

				<Text style={styles.headerTitle}>
					My Profile
				</Text>

				<View style={styles.headerSpacer} />
			</View>

			<View style={styles.profileCard}>
				<View style={styles.avatar}>
					<Text style={styles.avatarText}>
						{initials}
					</Text>
				</View>

				<Text style={styles.name}>
					{user.name}
				</Text>

				<View style={styles.roleBadge}>
					<ShieldCheck
						size={15}
						color="#232466"
						strokeWidth={2.2}
					/>

					<Text style={styles.roleText}>
						{user.role}
					</Text>
				</View>

				<View style={styles.statusRow}>
					<View style={styles.statusDot} />

					<Text style={styles.statusText}>
						{user.status || 'Active'}
					</Text>
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>
					Personal Information
				</Text>

				<View style={styles.detailsCard}>
					<View style={styles.detailRow}>
						<View style={styles.iconBox}>
							<Mail
								size={18}
								color="#232466"
							/>
						</View>

						<View style={styles.detailContent}>
							<Text style={styles.detailLabel}>
								Email Address
							</Text>

							<Text style={styles.detailValue}>
								{user.email}
							</Text>
						</View>
					</View>

					<View style={styles.divider} />

					<View style={styles.detailRow}>
						<View style={styles.iconBox}>
							<Phone
								size={18}
								color="#232466"
							/>
						</View>

						<View style={styles.detailContent}>
							<Text style={styles.detailLabel}>
								Mobile Number
							</Text>

							<Text style={styles.detailValue}>
								{user.mobile || 'Not available'}
							</Text>
						</View>
					</View>

					<View style={styles.divider} />

					<View style={styles.detailRow}>
						<View style={styles.iconBox}>
							<UserRound
								size={18}
								color="#232466"
							/>
						</View>

						<View style={styles.detailContent}>
							<Text style={styles.detailLabel}>
								Account Role
							</Text>

							<Text style={styles.detailValue}>
								{user.role}
							</Text>
						</View>
					</View>
				</View>
			</View>

			{(user.flatNumber || user.floorNumber) && (
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Residence
					</Text>

					<View style={styles.detailsCard}>
						{user.flatNumber ? (
							<View style={styles.detailRow}>
								<View style={styles.iconBox}>
									<Building2
										size={18}
										color="#232466"
									/>
								</View>

								<View style={styles.detailContent}>
									<Text style={styles.detailLabel}>
										Flat Number
									</Text>

									<Text style={styles.detailValue}>
										{user.flatNumber}
									</Text>
								</View>
							</View>
						) : null}

						{user.flatNumber && user.floorNumber ? (
							<View style={styles.divider} />
						) : null}

						{user.floorNumber ? (
							<View style={styles.detailRow}>
								<View style={styles.iconBox}>
									<Hash
										size={18}
										color="#232466"
									/>
								</View>

								<View style={styles.detailContent}>
									<Text style={styles.detailLabel}>
										Floor Number
									</Text>

									<Text style={styles.detailValue}>
										{user.floorNumber}
									</Text>
								</View>
							</View>
						) : null}
					</View>
				</View>
			)}

			<Pressable
				onPress={handleLogout}
				style={({ pressed }) => [
					styles.logoutButton,
					pressed && styles.pressed,
				]}
			>
				<LogOut
					size={18}
					color="#EF5622"
					strokeWidth={2.2}
				/>

				<Text style={styles.logoutText}>
					Logout
				</Text>
			</Pressable>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},

	container: {
		padding: 20,
		paddingBottom: 40,
	},

	header: {
		paddingTop: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 24,
	},

	headerButton: {
		width: 42,
		height: 42,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	headerTitle: {
		fontSize: 20,
		fontWeight: '800',
		color: '#232466',
	},

	headerSpacer: {
		width: 42,
	},

	profileCard: {
		alignItems: 'center',
		paddingVertical: 28,
		paddingHorizontal: 20,
		borderRadius: 20,
		backgroundColor: '#232466',
	},

	avatar: {
		width: 76,
		height: 76,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 38,
		backgroundColor: '#FFFFFF',
		borderWidth: 3,
		borderColor: '#EF5622',
	},

	avatarText: {
		fontSize: 25,
		fontWeight: '800',
		color: '#232466',
	},

	name: {
		marginTop: 15,
		fontSize: 22,
		fontWeight: '800',
		color: '#FFFFFF',
	},

	roleBadge: {
		marginTop: 9,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingHorizontal: 11,
		paddingVertical: 6,
		borderRadius: 10,
		backgroundColor: '#FFFFFF',
	},

	roleText: {
		fontSize: 12,
		fontWeight: '700',
		textTransform: 'capitalize',
		color: '#232466',
	},

	statusRow: {
		marginTop: 12,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},

	statusDot: {
		width: 7,
		height: 7,
		borderRadius: 4,
		backgroundColor: '#EF5622',
	},

	statusText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#FFFFFF',
	},

	section: {
		marginTop: 26,
	},

	sectionTitle: {
		marginBottom: 11,
		fontSize: 16,
		fontWeight: '800',
		color: '#232466',
	},

	detailsCard: {
		paddingHorizontal: 16,
		borderRadius: 17,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	detailRow: {
		minHeight: 72,
		flexDirection: 'row',
		alignItems: 'center',
	},

	iconBox: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 11,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#232466',
	},

	detailContent: {
		flex: 1,
		marginLeft: 13,
	},

	detailLabel: {
		fontSize: 11,
		fontWeight: '600',
		color: '#64748B',
	},

	detailValue: {
		marginTop: 4,
		fontSize: 14,
		fontWeight: '700',
		color: '#0F172A',
	},

	divider: {
		height: 1,
		backgroundColor: '#E5E5EC',
	},

	logoutButton: {
		height: 52,
		marginTop: 30,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 9,
		borderRadius: 14,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#EF5622',
	},

	logoutText: {
		fontSize: 15,
		fontWeight: '700',
		color: '#EF5622',
	},

	center: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#FFFFFF',
	},

	loadingText: {
		marginTop: 10,
		fontSize: 14,
		color: '#64748B',
	},

	errorTitle: {
		fontSize: 17,
		fontWeight: '700',
		color: '#232466',
	},

	backButton: {
		marginTop: 18,
		paddingHorizontal: 22,
		paddingVertical: 12,
		borderRadius: 10,
		backgroundColor: '#232466',
	},

	backButtonText: {
		fontSize: 14,
		fontWeight: '700',
		color: '#FFFFFF',
	},

	pressed: {
		opacity: 0.7,
	},
});