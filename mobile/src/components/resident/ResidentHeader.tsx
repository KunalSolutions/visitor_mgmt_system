import { Pressable, StyleSheet, Text, View } from 'react-native';
import { UserRound } from 'lucide-react-native';
import { router } from 'expo-router';

type Props = {
	name?: string;
};

export default function ResidentHeader({
	name = 'Resident',
}: Props) {
	return (
		<View style={styles.container}>
			<View style={styles.left}>
				<Text style={styles.greeting}>
					Welcome back
				</Text>

				<Text style={styles.title}>
					Sunrise Towers
				</Text>

				<Text style={styles.subtitle}>
					{name} • Resident
				</Text>
			</View>

			<Pressable
				onPress={() => router.push('/resident/profile')}
				style={({ pressed }) => [
					styles.profileButton,
					pressed && styles.pressed,
				]}
			>
				<UserRound
					size={22}
					color="#FFFFFF"
					strokeWidth={2}
				/>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 26,
		backgroundColor: '#FFFFFF',
	},

	left: {
		flex: 1,
		paddingRight: 14,
	},

	greeting: {
		fontSize: 13,
		fontWeight: '500',
		color: '#64748B',
	},

	title: {
		marginTop: 5,
		fontSize: 26,
		fontWeight: '800',
		letterSpacing: -0.6,
		color: '#232466',
	},

	subtitle: {
		marginTop: 4,
		fontSize: 13,
		color: '#64748B',
	},

	profileButton: {
		width: 48,
		height: 48,
		marginLeft: 12,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 16,
		backgroundColor: '#232466',
		borderWidth: 2,
		borderColor: '#EF5622',
	},

	pressed: {
		opacity: 0.7,
	},
});