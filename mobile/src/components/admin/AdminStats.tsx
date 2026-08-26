import {
	ShieldCheck,
	Users,
	UserRound,
	UsersRound,
} from 'lucide-react-native';
import {
	StyleSheet,
	Text,
	View,
} from 'react-native';

const stats = [
	{
		title: 'Total Users',
		value: '9',
		label: 'Registered users',
		icon: Users,
	},
	{
		title: 'Residents',
		value: '6',
		label: 'Active residents',
		icon: UserRound,
	},
	{
		title: 'Security',
		value: '2',
		label: 'Security staff',
		icon: ShieldCheck,
	},
	{
		title: 'Visitors',
		value: '0',
		label: 'Total visitors',
		icon: UsersRound,
	},
];

export default function AdminStats() {
	return (
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
									strokeWidth={2}
								/>
							</View>
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
	);
}

const styles = StyleSheet.create({
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		gap: 12,
	},

	card: {
		width: '48%',
		minHeight: 150,
		padding: 16,
		borderRadius: 16,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},

	topRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	iconContainer: {
		width: 38,
		height: 38,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 11,
		backgroundColor: '#eef0ff',
	},

	value: {
		marginTop: 15,
		fontSize: 27,
		fontWeight: '800',
		letterSpacing: -0.5,
		color: '#0f172a',
	},

	title: {
		marginTop: 3,
		fontSize: 14,
		fontWeight: '700',
		color: '#334155',
	},

	label: {
		marginTop: 3,
		fontSize: 11,
		lineHeight: 16,
		color: '#94a3b8',
	},
});