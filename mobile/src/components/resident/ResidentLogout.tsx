import { LogOut } from 'lucide-react-native';
import { useState } from 'react';
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '@/services/api';

export default function ResidentLogout() {
	const [loading, setLoading] = useState(false);

	const handleLogout = async () => {
		try {
			setLoading(true);

			await api.post('/users/logout');
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			await AsyncStorage.removeItem('token');
			await AsyncStorage.removeItem('user');

			router.replace('/login');

			setLoading(false);
		}
	};

	return (
		<Pressable
			disabled={loading}
			onPress={handleLogout}
			style={({ pressed }) => [
				styles.button,
				pressed && styles.pressed,
				loading && styles.disabled,
			]}
		>
			{loading ? (
				<ActivityIndicator
					size="small"
					color="#EF5622"
				/>
			) : (
				<LogOut
					size={18}
					color="#EF5622"
					strokeWidth={2.2}
				/>
			)}

			<Text style={styles.text}>
				{loading ? 'Logging out...' : 'Logout'}
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
		gap: 9,
		marginTop: 30,
		marginBottom: 20,
		borderRadius: 14,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#EF5622',
	},

	text: {
		fontSize: 14,
		fontWeight: '700',
		color: '#EF5622',
	},

	pressed: {
		opacity: 0.7,
	},

	disabled: {
		opacity: 0.6,
	},
});