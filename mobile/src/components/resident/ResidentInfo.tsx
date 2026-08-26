import { Mail, Phone, UserRound } from 'lucide-react-native';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useEffect, useState } from 'react';

import api from '@/services/api';

type User = {
	name?: string;
	email?: string;
	mobile?: string;
	flatNumber?: string | null;
	floorNumber?: string | number | null;
	role?: string;
};

export default function ResidentInfo() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await api.get('/users/profile');

				setUser(
					response.data?.user ||
						response.data?.data ||
						response.data
				);
			} catch (error) {
				console.error(
					'Resident profile error:',
					error
				);
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	if (loading) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator
					size="small"
					color="#232466"
				/>
			</View>
		);
	}

	if (!user) {
		return null;
	}

	const initials =
		user.name
			?.split(' ')
			.map((word) => word.charAt(0))
			.join('')
			.slice(0, 2)
			.toUpperCase() || 'R';

	return (
		<View style={styles.card}>
			<View style={styles.top}>
				<View style={styles.avatar}>
					<Text style={styles.avatarText}>
						{initials}
					</Text>
				</View>

				<View style={styles.identity}>
					<Text style={styles.name}>
						{user.name}
					</Text>

					<Text style={styles.location}>
						{user.flatNumber
							? `Flat ${user.flatNumber}`
							: 'Resident'}
						{user.floorNumber
							? ` • Floor ${user.floorNumber}`
							: ''}
					</Text>
				</View>
			</View>

			<View style={styles.divider} />

			<View style={styles.contactRow}>
				<View style={styles.contactItem}>
					<View style={styles.iconBox}>
						<Phone
							size={16}
							color="#232466"
							strokeWidth={2}
						/>
					</View>

					<View>
						<Text style={styles.label}>
							Mobile
						</Text>

						<Text style={styles.value}>
							{user.mobile || 'Not available'}
						</Text>
					</View>
				</View>

				<View style={styles.contactItem}>
					<View style={styles.iconBox}>
						<Mail
							size={16}
							color="#232466"
							strokeWidth={2}
						/>
					</View>

					<View style={styles.emailContent}>
						<Text style={styles.label}>
							Email
						</Text>

						<Text
							style={styles.value}
							numberOfLines={1}
						>
							{user.email || 'Not available'}
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.roleRow}>
				<UserRound
					size={14}
					color="#EF5622"
					strokeWidth={2.2}
				/>

				<Text style={styles.roleText}>
					{user.role || 'Resident'}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		padding: 17,
		borderRadius: 18,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	loading: {
		height: 150,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
	},

	top: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	avatar: {
		width: 52,
		height: 52,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 26,
		backgroundColor: '#232466',
		borderWidth: 2,
		borderColor: '#EF5622',
	},

	avatarText: {
		fontSize: 17,
		fontWeight: '800',
		color: '#FFFFFF',
	},

	identity: {
		flex: 1,
		marginLeft: 13,
	},

	name: {
		fontSize: 17,
		fontWeight: '800',
		color: '#232466',
	},

	location: {
		marginTop: 4,
		fontSize: 12,
		color: '#64748B',
	},

	divider: {
		height: 1,
		marginVertical: 15,
		backgroundColor: '#E5E5EC',
	},

	contactRow: {
		flexDirection: 'row',
		gap: 12,
	},

	contactItem: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		minWidth: 0,
	},

	iconBox: {
		width: 34,
		height: 34,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
		backgroundColor: '#F4F4FA',
	},

	emailContent: {
		flex: 1,
		marginLeft: 8,
	},


	label: {
		marginLeft: 8,
		fontSize: 10,
		color: '#94A3B8',
	},

	value: {
		marginTop: 2,
		marginLeft: 8,
		fontSize: 11,
		fontWeight: '600',
		color: '#334155',
	},

	roleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 14,
		paddingTop: 11,
		borderTopWidth: 1,
		borderTopColor: '#E5E5EC',
	},

	roleText: {
		marginLeft: 6,
		fontSize: 11,
		fontWeight: '700',
		color: '#232466',
		textTransform: 'capitalize',
	},
});