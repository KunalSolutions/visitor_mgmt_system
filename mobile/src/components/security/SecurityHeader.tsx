import { Pressable, StyleSheet, Text, View } from 'react-native';
import { UserRound } from 'lucide-react-native';
import { router } from 'expo-router';

type Props = {
	name?: string;
};

export default function SecurityHeader({
	name = 'Security',
}: Props) {
	return (
		<View style={styles.container}>
			<View style={styles.left}>
				<Text style={styles.greeting}>
					Good morning
				</Text>

				<Text style={styles.title}>
					Sunrise Towers
				</Text>

				<Text style={styles.subtitle}>
					{name} • Security Dashboard
				</Text>
			</View>

			<Pressable
				onPress={() => router.push('/security/profile')}
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
		marginBottom: 28,
		backgroundColor: '#FFFFFF',
	},

	left: {
		flex: 1,
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
		marginTop: 5,
		fontSize: 13,
		fontWeight: '500',
		color: '#64748B',
	},

	profileButton: {
		width: 48,
		height: 48,
		marginLeft: 16,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 24,
		backgroundColor: '#232466',
		borderWidth: 2,
		borderColor: '#EF5622',
	},

	pressed: {
		opacity: 0.7,
	},
});