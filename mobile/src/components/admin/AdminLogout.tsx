import { Pressable, StyleSheet, Text } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminLogout() {
	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem('token');
			await AsyncStorage.removeItem('user');

			try {
				await fetch('/api/v1/users/logout', {
					method: 'POST',
				});
			} catch {}

			router.replace('/login');
		} catch (error) {
			console.error('Logout error:', error);
			router.replace('/login');
		}
	};

	return (
		<Pressable
			onPress={handleLogout}
			style={({ pressed }) => [
				styles.button,
				pressed && styles.pressed,
			]}
		>
			<LogOut
				size={19}
				color="#EF5622"
				strokeWidth={2.2}
			/>

			<Text style={styles.text}>
				Logout
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		height: 52,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 28,
		marginBottom: 24,
		borderRadius: 14,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	text: {
		marginLeft: 9,
		fontSize: 14,
		fontWeight: '700',
		color: '#232466',
	},

	pressed: {
		opacity: 0.65,
	},
});