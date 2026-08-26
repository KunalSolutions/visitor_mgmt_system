import { useState } from 'react';
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '@/services/api';

export default function LoginScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleLogin = async () => {
		setError('');

		if (!email.trim() || !password.trim()) {
			setError('Please enter email and password.');
			return;
		}

		try {
			setLoading(true);

			const response = await api.post('/users/login', {
				email: email.trim(),
				password,
			});

			const data = response.data;

			console.log('Login response:', data);

			const token = data.token;

			if (!token) {
				setError(
					'Login successful but authentication token was not received.'
				);
				return;
			}

			// Store JWT token
			await AsyncStorage.setItem('token', token);

			// Get logged-in user
			const user = data.user || data;

			console.log('Logged in user:', user);

			// Navigate according to role
			if (user.role === 'admin') {
				router.replace('/admin/dashboard');
			} else if (user.role === 'security') {
				router.replace('/security/dashboard');
			} else if (user.role === 'resident') {
				router.replace('/resident/dashboard');
			} else {
				await AsyncStorage.removeItem('token');

				setError('Invalid user role.');
			}
		} catch (error: any) {
			console.error('Login error:', error);

			setError(
				error?.response?.data?.message ||
					'Invalid email or password.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={
					Platform.OS === 'ios'
						? 'padding'
						: undefined
				}>
				<View style={styles.content}>
					<View style={styles.header}>
						<View style={styles.logo}>
							<Text style={styles.logoText}>
								S
							</Text>
						</View>

						<Text style={styles.title}>
							Sunrise Towers
						</Text>

						<Text style={styles.subtitle}>
							Visitor Management System
						</Text>
					</View>

					<View style={styles.card}>
						<Text style={styles.heading}>
							Welcome Back
						</Text>

						<Text style={styles.description}>
							Sign in to continue to your account.
						</Text>

						<View style={styles.form}>
							<View>
								<Text style={styles.label}>
									Email Address
								</Text>

								<TextInput
									value={email}
									onChangeText={setEmail}
									placeholder="Enter your email"
									placeholderTextColor="#94a3b8"
									keyboardType="email-address"
									autoCapitalize="none"
									autoCorrect={false}
									style={styles.input}
								/>
							</View>

							<View>
								<Text style={styles.label}>
									Password
								</Text>

								<View style={styles.passwordBox}>
									<TextInput
										value={password}
										onChangeText={setPassword}
										placeholder="Enter your password"
										placeholderTextColor="#94a3b8"
										secureTextEntry={!showPassword}
										autoCapitalize="none"
										autoCorrect={false}
										style={styles.passwordInput}
									/>

									<Pressable
										onPress={() =>
											setShowPassword(
												(value) => !value
											)
										}
										style={styles.showButton}>
										<Text style={styles.showText}>
											{showPassword
												? 'Hide'
												: 'Show'}
										</Text>
									</Pressable>
								</View>
							</View>

							{error ? (
								<View style={styles.errorBox}>
									<Text style={styles.errorText}>
										{error}
									</Text>
								</View>
							) : null}

							<Pressable
								onPress={handleLogin}
								disabled={loading}
								style={({ pressed }) => [
									styles.loginButton,
									pressed &&
										styles.buttonPressed,
									loading &&
										styles.buttonDisabled,
								]}>
								{loading ? (
									<ActivityIndicator color="#ffffff" />
								) : (
									<Text style={styles.loginButtonText}>
										Sign In
									</Text>
								)}
							</Pressable>
						</View>
					</View>

					<Text style={styles.footer}>
						Sunrise Towers Management
					</Text>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},

	container: {
		flex: 1,
	},

	content: {
		flex: 1,
		width: '100%',
		maxWidth: 500,
		alignSelf: 'center',
		justifyContent: 'center',
		paddingHorizontal: 24,
		paddingVertical: 32,
	},

	header: {
		alignItems: 'center',
		marginBottom: 28,
	},

	logo: {
		width: 64,
		height: 64,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#232466',
		marginBottom: 14,
	},

	logoText: {
		fontSize: 32,
		fontWeight: '800',
		color: '#ffffff',
	},

	title: {
		fontSize: 26,
		fontWeight: '700',
		color: '#0f172a',
	},

	subtitle: {
		marginTop: 5,
		fontSize: 14,
		color: '#64748b',
	},

	card: {
		width: '100%',
		borderRadius: 18,
		backgroundColor: '#ffffff',
		padding: 24,
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},

	heading: {
		fontSize: 22,
		fontWeight: '700',
		color: '#0f172a',
	},

	description: {
		marginTop: 6,
		fontSize: 14,
		lineHeight: 21,
		color: '#64748b',
	},

	form: {
		marginTop: 24,
		gap: 18,
	},

	label: {
		marginBottom: 8,
		fontSize: 14,
		fontWeight: '600',
		color: '#334155',
	},

	input: {
		height: 50,
		borderWidth: 1,
		borderColor: '#cbd5e1',
		borderRadius: 10,
		paddingHorizontal: 14,
		fontSize: 15,
		color: '#0f172a',
		backgroundColor: '#ffffff',
	},

	passwordBox: {
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#cbd5e1',
		borderRadius: 10,
		backgroundColor: '#ffffff',
	},

	passwordInput: {
		flex: 1,
		height: '100%',
		paddingHorizontal: 14,
		fontSize: 15,
		color: '#0f172a',
	},

	showButton: {
		paddingHorizontal: 14,
	},

	showText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#232466',
	},

	errorBox: {
		padding: 12,
		borderRadius: 8,
		backgroundColor: '#fef2f2',
	},

	errorText: {
		fontSize: 13,
		color: '#dc2626',
	},

	loginButton: {
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
		backgroundColor: '#232466',
		marginTop: 4,
	},

	buttonPressed: {
		opacity: 0.8,
	},

	buttonDisabled: {
		opacity: 0.6,
	},

	loginButtonText: {
		fontSize: 15,
		fontWeight: '700',
		color: '#ffffff',
	},

	footer: {
		marginTop: 24,
		textAlign: 'center',
		fontSize: 12,
		color: '#94a3b8',
	},
});