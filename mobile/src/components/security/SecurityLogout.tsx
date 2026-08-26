import { Pressable, StyleSheet, Text } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '@/services/api';

export default function SecurityLogout() {
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

	return (
		<Pressable
			onPress={handleLogout}
			style={({ pressed }) => [
				styles.button,
				pressed && styles.pressed,
			]}
		>
			<LogOut
				size={18}
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
		marginTop: 30,
		marginBottom: 20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 9,
		borderRadius: 14,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#EF5622',
	},

	text: {
		fontSize: 15,
		fontWeight: '700',
		color: '#EF5622',
	},

	pressed: {
		opacity: 0.7,
	},
});