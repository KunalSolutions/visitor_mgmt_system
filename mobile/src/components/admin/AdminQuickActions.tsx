import { useRouter } from 'expo-router';
import {
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';

export default function AdminQuickActions() {
	const router = useRouter();

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>
				Quick Actions
			</Text>

			<View style={styles.actions}>
				<Pressable
					style={({ pressed }) => [
						styles.actionCard,
						pressed && styles.pressed,
					]}
					onPress={() => router.push('/admin/users')}
				>
					<View style={styles.iconBox}>
						<Text style={styles.icon}>
							US
						</Text>
					</View>

					<View style={styles.content}>
						<Text style={styles.title}>
							Users
						</Text>

						<Text style={styles.subtitle}>
							Manage residents and security
						</Text>
					</View>

					<Text style={styles.arrow}>
						›
					</Text>
				</Pressable>

				<Pressable
					style={({ pressed }) => [
						styles.actionCard,
						pressed && styles.pressed,
					]}
					onPress={() => router.push('/admin/visitors')}
				>
					<View style={styles.iconBox}>
						<Text style={styles.icon}>
							VI
						</Text>
					</View>

					<View style={styles.content}>
						<Text style={styles.title}>
							Visitors
						</Text>

						<Text style={styles.subtitle}>
							View and manage visitor records
						</Text>
					</View>

					<Text style={styles.arrow}>
						›
					</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		marginTop: 28,
	},

	sectionTitle: {
		marginBottom: 12,
		fontSize: 18,
		fontWeight: '700',
		color: '#0f172a',
	},

	actions: {
		gap: 12,
	},

	actionCard: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 16,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},

	iconBox: {
		width: 46,
		height: 46,
		borderRadius: 13,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#eef2ff',
	},

	icon: {
		fontSize: 12,
		fontWeight: '800',
		color: '#232466',
	},

	content: {
		flex: 1,
		marginLeft: 13,
	},

	title: {
		fontSize: 16,
		fontWeight: '700',
		color: '#0f172a',
	},

	subtitle: {
		marginTop: 4,
		fontSize: 12,
		color: '#64748b',
	},

	arrow: {
		marginLeft: 10,
		fontSize: 28,
		fontWeight: '300',
		color: '#94a3b8',
	},

	pressed: {
		opacity: 0.7,
	},
});