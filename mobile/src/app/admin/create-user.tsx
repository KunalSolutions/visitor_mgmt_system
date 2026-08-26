import { useState } from 'react';
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import api from '@/services/api';

export default function CreateUserScreen() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [mobile, setMobile] = useState('');
	const [password, setPassword] = useState('');
	const [flatNumber, setFlatNumber] = useState('');
	const [floorNumber, setFloorNumber] = useState('');
	const [role, setRole] = useState('resident');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleCreateUser = async () => {
		setError('');
		setSuccess('');

		if (!name.trim() || !email.trim() || !password.trim()) {
			setError('Name, email and password are required.');
			return;
		}

		try {
			setLoading(true);

			await api.post('/users', {
				name: name.trim(),
				email: email.trim(),
				mobile: mobile.trim(),
				password,
				role,
				flatNumber: flatNumber.trim() || null,
				floorNumber: floorNumber.trim() || null,
			});

			setSuccess('User created successfully.');

			setName('');
			setEmail('');
			setMobile('');
			setPassword('');
			setFlatNumber('');
			setFloorNumber('');
			setRole('resident');
		} catch (error: any) {
			console.error('Create user error:', error);

			setError(
				error?.response?.data?.message ||
					'Failed to create user.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={
				Platform.OS === 'ios'
					? 'padding'
					: undefined
			}
		>
			<View style={styles.header}>
				<Pressable
					onPress={() => router.back()}
					style={styles.backButton}
				>
					<ArrowLeft
						size={21}
						color="#232466"
					/>
				</Pressable>

				<View>
					<Text style={styles.title}>
						Create User
					</Text>

					<Text style={styles.subtitle}>
						Add a new Sunrise Towers user
					</Text>
				</View>
			</View>

			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>
						Basic Information
					</Text>

					<View style={styles.field}>
						<Text style={styles.label}>
							Full Name
						</Text>

						<TextInput
							value={name}
							onChangeText={setName}
							placeholder="Enter full name"
							placeholderTextColor="#94a3b8"
							style={styles.input}
						/>
					</View>

					<View style={styles.field}>
						<Text style={styles.label}>
							Email Address
						</Text>

						<TextInput
							value={email}
							onChangeText={setEmail}
							placeholder="Enter email address"
							placeholderTextColor="#94a3b8"
							keyboardType="email-address"
							autoCapitalize="none"
							style={styles.input}
						/>
					</View>

					<View style={styles.field}>
						<Text style={styles.label}>
							Mobile Number
						</Text>

						<TextInput
							value={mobile}
							onChangeText={setMobile}
							placeholder="Enter mobile number"
							placeholderTextColor="#94a3b8"
							keyboardType="phone-pad"
							style={styles.input}
						/>
					</View>

					<View style={styles.field}>
						<Text style={styles.label}>
							Password
						</Text>

						<TextInput
							value={password}
							onChangeText={setPassword}
							placeholder="Enter password"
							placeholderTextColor="#94a3b8"
							secureTextEntry
							style={styles.input}
						/>
					</View>

					<Text style={styles.sectionTitle}>
						Role
					</Text>

					<View style={styles.roleRow}>
						{['resident', 'security', 'admin'].map(
							(item) => (
								<Pressable
									key={item}
									onPress={() => setRole(item)}
									style={[
										styles.roleButton,
										role === item &&
											styles.roleButtonActive,
									]}
								>
									<Text
										style={[
											styles.roleText,
											role === item &&
												styles.roleTextActive,
										]}
									>
										{item}
									</Text>
								</Pressable>
							)
						)}
					</View>

					{role === 'resident' ? (
						<>
							<Text style={styles.sectionTitle}>
								Residence
							</Text>

							<View style={styles.field}>
								<Text style={styles.label}>
									Flat Number
								</Text>

								<TextInput
									value={flatNumber}
									onChangeText={setFlatNumber}
									placeholder="Example: 101"
									placeholderTextColor="#94a3b8"
									style={styles.input}
								/>
							</View>

							<View style={styles.field}>
								<Text style={styles.label}>
									Floor Number
								</Text>

								<TextInput
									value={floorNumber}
									onChangeText={setFloorNumber}
									placeholder="Example: 1"
									placeholderTextColor="#94a3b8"
									keyboardType="numeric"
									style={styles.input}
								/>
							</View>
						</>
					) : null}

					{error ? (
						<View style={styles.errorBox}>
							<Text style={styles.errorText}>
								{error}
							</Text>
						</View>
					) : null}

					{success ? (
						<View style={styles.successBox}>
							<Text style={styles.successText}>
								{success}
							</Text>
						</View>
					) : null}

					<Pressable
						onPress={handleCreateUser}
						disabled={loading}
						style={({ pressed }) => [
							styles.createButton,
							pressed && styles.pressed,
							loading && styles.disabled,
						]}
					>
						{loading ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<Text style={styles.createButtonText}>
								Create User
							</Text>
						)}
					</Pressable>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},

	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 55,
		paddingHorizontal: 20,
		paddingBottom: 18,
		borderBottomWidth: 1,
		borderBottomColor: '#e2e8f0',
		backgroundColor: '#FFFFFF',
	},

	backButton: {
		width: 42,
		height: 42,
		marginRight: 13,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 12,
		backgroundColor: '#f1f2ff',
	},

	title: {
		fontSize: 22,
		fontWeight: '800',
		color: '#0f172a',
	},

	subtitle: {
		marginTop: 3,
		fontSize: 12,
		color: '#64748b',
	},

	content: {
		padding: 20,
		paddingBottom: 40,
	},

	card: {
		padding: 20,
		borderRadius: 18,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},

	sectionTitle: {
		marginBottom: 16,
		fontSize: 16,
		fontWeight: '800',
		color: '#232466',
	},

	field: {
		marginBottom: 16,
	},

	label: {
		marginBottom: 7,
		fontSize: 13,
		fontWeight: '600',
		color: '#334155',
	},

	input: {
		height: 50,
		paddingHorizontal: 14,
		borderWidth: 1,
		borderColor: '#cbd5e1',
		borderRadius: 11,
		fontSize: 14,
		color: '#0f172a',
		backgroundColor: '#FFFFFF',
	},

	roleRow: {
		flexDirection: 'row',
		gap: 8,
		marginBottom: 24,
	},

	roleButton: {
		flex: 1,
		paddingVertical: 11,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#cbd5e1',
		borderRadius: 10,
		backgroundColor: '#FFFFFF',
	},

	roleButtonActive: {
		borderColor: '#232466',
		backgroundColor: '#232466',
	},

	roleText: {
		fontSize: 12,
		fontWeight: '700',
		color: '#64748b',
		textTransform: 'capitalize',
	},

	roleTextActive: {
		color: '#FFFFFF',
	},

	errorBox: {
		marginBottom: 14,
		padding: 12,
		borderRadius: 10,
		backgroundColor: '#fef2f2',
	},

	errorText: {
		fontSize: 13,
		color: '#dc2626',
	},

	successBox: {
		marginBottom: 14,
		padding: 12,
		borderRadius: 10,
		backgroundColor: '#f0fdf4',
	},

	successText: {
		fontSize: 13,
		color: '#15803d',
	},

	createButton: {
		height: 52,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 12,
		backgroundColor: '#EF5622',
	},

	createButtonText: {
		fontSize: 14,
		fontWeight: '800',
		color: '#FFFFFF',
	},

	pressed: {
		opacity: 0.75,
	},

	disabled: {
		opacity: 0.6,
	},
});