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
	Building2,
	Mail,
	Phone,
	UserRound,
} from 'lucide-react-native';

import api from '@/services/api';

type User = {
	_id: string;
	name: string;
	email: string;
	mobile?: string;
	role?: string;
	flatNumber?: string | null;
	floorNumber?: string | number | null;
	status?: string;
};

export default function ResidentProfileScreen() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchProfile = useCallback(async () => {
		try {
			const response = await api.get('/users/profile');

			setUser(
				response.data?.user ||
					response.data?.data ||
					response.data
			);
		} catch (error) {
			console.error('Resident profile error:', error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

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

	const initials =
		user.name
			?.split(' ')
			.map((word) => word.charAt(0))
			.join('')
			.slice(0, 2)
			.toUpperCase() || 'R';

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
						styles.backIcon,
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

				<View style={styles.headerSpace} />
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
					<Text style={styles.roleText}>
						{user.role || 'Resident'}
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

				<View style={styles.card}>
					<View style={styles.infoRow}>
						<View style={styles.iconBox}>
							<UserRound
								size={18}
								color="#232466"
							/>
						</View>

						<View style={styles.info}>
							<Text style={styles.label}>
								Full Name
							</Text>

							<Text style={styles.value}>
								{user.name}
							</Text>
						</View>
					</View>

					<View style={styles.divider} />

					<View style={styles.infoRow}>
						<View style={styles.iconBox}>
							<Mail
								size={18}
								color="#232466"
							/>
						</View>

						<View style={styles.info}>
							<Text style={styles.label}>
								Email
							</Text>

							<Text style={styles.value}>
								{user.email}
							</Text>
						</View>
					</View>

					<View style={styles.divider} />

					<View style={styles.infoRow}>
						<View style={styles.iconBox}>
							<Phone
								size={18}
								color="#232466"
							/>
						</View>

						<View style={styles.info}>
							<Text style={styles.label}>
								Mobile
							</Text>

							<Text style={styles.value}>
								{user.mobile || 'Not available'}
							</Text>
						</View>
					</View>
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>
					Residence
				</Text>

				<View style={styles.card}>
					<View style={styles.infoRow}>
						<View style={styles.iconBox}>
							<Building2
								size={18}
								color="#232466"
							/>
						</View>

						<View style={styles.info}>
							<Text style={styles.label}>
								Flat Number
							</Text>

							<Text style={styles.value}>
								{user.flatNumber || 'Not available'}
							</Text>
						</View>
					</View>

					<View style={styles.divider} />

					<View style={styles.infoRow}>
						<View style={styles.iconBox}>
							<Text style={styles.floorIcon}>
								{user.floorNumber || '—'}
							</Text>
						</View>

						<View style={styles.info}>
							<Text style={styles.label}>
								Floor Number
							</Text>

							<Text style={styles.value}>
								{user.floorNumber || 'Not available'}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},

	container: {
		flexGrow: 1,
		padding: 20,
		paddingTop: 28,
		paddingBottom: 40,
		backgroundColor: '#FFFFFF',
	},

	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 24,
	},

	backIcon: {
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

	headerSpace: {
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
		width: 78,
		height: 78,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 39,
		backgroundColor: '#FFFFFF',
		borderWidth: 3,
		borderColor: '#EF5622',
	},

	avatarText: {
		fontSize: 26,
		fontWeight: '800',
		color: '#232466',
	},

	name: {
		marginTop: 14,
		fontSize: 22,
		fontWeight: '800',
		color: '#FFFFFF',
	},

	roleBadge: {
		marginTop: 9,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		backgroundColor: '#FFFFFF',
	},

	roleText: {
		fontSize: 11,
		fontWeight: '700',
		color: '#232466',
		textTransform: 'capitalize',
	},

	statusRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 11,
	},

	statusDot: {
		width: 7,
		height: 7,
		marginRight: 6,
		borderRadius: 4,
		backgroundColor: '#EF5622',
	},

	statusText: {
		fontSize: 11,
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

	card: {
		paddingHorizontal: 16,
		borderRadius: 17,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	infoRow: {
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
		backgroundColor: '#F4F4FA',
	},

	floorIcon: {
		fontSize: 14,
		fontWeight: '800',
		color: '#232466',
	},

	info: {
		flex: 1,
		marginLeft: 13,
	},

	label: {
		fontSize: 11,
		fontWeight: '600',
		color: '#64748B',
	},

	value: {
		marginTop: 4,
		fontSize: 14,
		fontWeight: '700',
		color: '#0F172A',
	},

	divider: {
		height: 1,
		backgroundColor: '#E5E5EC',
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
		fontSize: 13,
		color: '#64748B',
	},

	errorTitle: {
		fontSize: 17,
		fontWeight: '700',
		color: '#232466',
	},

	backButton: {
		marginTop: 18,
		paddingHorizontal: 20,
		paddingVertical: 11,
		borderRadius: 10,
		backgroundColor: '#232466',
	},

	backButtonText: {
		fontSize: 13,
		fontWeight: '700',
		color: '#FFFFFF',
	},

	pressed: {
		opacity: 0.7,
	},
});