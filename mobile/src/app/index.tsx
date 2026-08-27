import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '@/services/api';

export default function IndexScreen() {
	const [checking, setChecking] = useState(true);

	useEffect(() => {
		const checkAuthentication = async () => {
			try {
				const token = await AsyncStorage.getItem('token');

				if (!token) {
					router.replace('/login');
					return;
				}

				const response = await api.get('/users/profile');

				const user = response.data;

				if (user.role === 'admin') {
					router.replace('/admin/dashboard');
				} else if (user.role === 'security') {
					router.replace('/security/dashboard');
				} else if (user.role === 'resident') {
					router.replace('/resident/dashboard');
				} else {
					await AsyncStorage.removeItem('token');
					router.replace('/login');
				}
			} catch (error) {
				console.error(
					'Authentication check failed:',
					error
				);

				await AsyncStorage.removeItem('token');
				router.replace('/login');
			} finally {
				setChecking(false);
			}
		};

		checkAuthentication();
	}, []);

	if (checking) {
		return (
			<View style={styles.container}>
				<View style={styles.logo}>
					<Text style={styles.logoText}>S</Text>
				</View>

				<Text style={styles.title}>
					Sunrise Towers
				</Text>

				<ActivityIndicator
					size="small"
					color="#232466"
					style={styles.loader}
				/>
			</View>
		);
	}

	return null;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
	},

	logo: {
		width: 64,
		height: 64,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 18,
		backgroundColor: '#232466',
		borderWidth: 2,
		borderColor: '#EF5622',
	},

	logoText: {
		fontSize: 30,
		fontWeight: '800',
		color: '#FFFFFF',
	},

	title: {
		marginTop: 14,
		fontSize: 20,
		fontWeight: '800',
		color: '#232466',
	},

	loader: {
		marginTop: 20,
	},
});