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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import api from '@/services/api';

export default function LoginScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] =
		useState(false);
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

			const user = response.data;

			await AsyncStorage.setItem(
				'userInfo',
				JSON.stringify(user)
			);

			await AsyncStorage.setItem(
				'token',
				user.token
			);

			console.log('Logged in user:', user);

		} catch (error: any) {
			console.error(error);

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
					<View style={styles.logoContainer}>
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
									placeholder='Enter your email'
									placeholderTextColor='#94a3b8'
									keyboardType='email-address'
									autoCapitalize='none'
									autoCorrect={false}
									style={styles.input}
								/>
							</View>

							<View>
								<Text style={styles.label}>
									Password
								</Text>

								<View
									style={
										styles.passwordContainer
									}>
									<TextInput
										value={password}
										onChangeText={setPassword}
										placeholder='Enter your password'
										placeholderTextColor='#94a3b8'
										secureTextEntry={
											!showPassword
										}
										autoCapitalize='none'
										style={
											styles.passwordInput
										}
									/>

									<Pressable
										onPress={() =>
											setShowPassword(
												(value) =>
													!value
											)
										}
										style={styles.showButton}>
										<Text
											style={
												styles.showText
											}>
											{showPassword
												? 'Hide'
												: 'Show'}
										</Text>
									</Pressable>
								</View>
							</View>

							{error ? (
								<View
									style={
										styles.errorContainer
									}>
									<Text
										style={
											styles.errorText
										}>
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
									<ActivityIndicator color='#ffffff' />
								) : (
									<Text
										style={
											styles.loginText
										}>
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

	logoContainer: {
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
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.06,
		shadowRadius: 12,
		elevation: 3,
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

	passwordContainer: {
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

	errorContainer: {
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

	loginText: {
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