import { UserPlus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';

export default function CreateUserButton() {
	return (
		<Pressable
			onPress={() => router.push('/admin/create-user')}
			style={({ pressed }) => [
				styles.button,
				pressed && styles.pressed,
			]}
		>
			<UserPlus
				size={19}
				color="#ffffff"
				strokeWidth={2.2}
			/>

			<Text style={styles.text}>
				Create User
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 9,
		marginBottom: 24,
		borderRadius: 12,
		backgroundColor: '#EF5622',
	},

	text: {
		fontSize: 14,
		fontWeight: '700',
		color: '#FFFFFF',
	},

	pressed: {
		opacity: 0.75,
	},
});