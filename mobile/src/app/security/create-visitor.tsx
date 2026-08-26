import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import {
	ArrowLeft,
	Check,
	ChevronDown,
	Search,
	UserRound,
} from 'lucide-react-native';
import { router } from 'expo-router';

import api from '@/services/api';

type Resident = {
	_id: string;
	name: string;
	email: string;
	mobile?: string;
	flatNumber?: string | null;
	floorNumber?: string | number | null;
	role: string;
};

export default function CreateVisitorScreen() {
	const [visitorName, setVisitorName] = useState('');
	const [mobile, setMobile] = useState('');
	const [purpose, setPurpose] = useState('');

	const [residents, setResidents] = useState<Resident[]>(
		[]
	);

	const [selectedResident, setSelectedResident] =
		useState<Resident | null>(null);

	const [residentSearch, setResidentSearch] =
		useState('');

	const [showResidents, setShowResidents] =
		useState(false);

	const [loadingResidents, setLoadingResidents] =
		useState(true);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		const fetchResidents = async () => {
			try {
				const response = await api.get('/users');

				const users = Array.isArray(response.data)
					? response.data
					: response.data?.users || [];

				const residentUsers = users.filter(
					(user: Resident) =>
						user.role === 'resident'
				);

				setResidents(residentUsers);
			} catch (error) {
				console.error(
					'Failed to load residents:',
					error
				);

				setError(
					'Unable to load residents. Please try again.'
				);
			} finally {
				setLoadingResidents(false);
			}
		};

		fetchResidents();
	}, []);

	const filteredResidents = residents.filter((resident) => {
		const value = residentSearch.toLowerCase().trim();

		if (!value) return true;

		return (
			resident.name?.toLowerCase().includes(value) ||
			resident.email?.toLowerCase().includes(value) ||
			resident.flatNumber
				?.toLowerCase()
				.includes(value)
		);
	});

	const handleCreateVisitor = async () => {
		setError('');
		setSuccess(false);

		if (
			!visitorName.trim() ||
			!mobile.trim() ||
			!selectedResident ||
			!purpose.trim()
		) {
			setError(
				'Please complete all visitor details.'
			);
			return;
		}

		if (!/^\d{10}$/.test(mobile.trim())) {
			setError(
				'Please enter a valid 10-digit mobile number.'
			);
			return;
		}

		try {
			setLoading(true);

			await api.post('/visitors', {
				visitorName: visitorName.trim(),
				mobile: mobile.trim(),
				meetWith: selectedResident._id,
				purpose: purpose.trim(),
			});

			setSuccess(true);

			setVisitorName('');
			setMobile('');
			setPurpose('');
			setSelectedResident(null);

			setTimeout(() => {
				router.back();
			}, 1200);
		} catch (error: any) {
			console.error(
				'Create visitor error:',
				error
			);

			setError(
				error?.response?.data?.message ||
					'Failed to create visitor entry.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.safeArea}
			behavior={
				Platform.OS === 'ios' ? 'padding' : undefined
			}
		>
			<ScrollView
				contentContainerStyle={styles.container}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
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
							Register Visitor
						</Text>

						<Text style={styles.subtitle}>
							Create a new visitor entry
						</Text>
					</View>
				</View>

				<View style={styles.formCard}>
					<Text style={styles.sectionTitle}>
						Visitor Details
					</Text>

					<View style={styles.field}>
						<Text style={styles.label}>
							Visitor Name
						</Text>

						<TextInput
							value={visitorName}
							onChangeText={setVisitorName}
							placeholder="Enter visitor name"
							placeholderTextColor="#94A3B8"
							autoCapitalize="words"
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
							placeholder="Enter 10-digit mobile number"
							placeholderTextColor="#94A3B8"
							keyboardType="phone-pad"
							maxLength={10}
							style={styles.input}
						/>
					</View>

					<View style={styles.field}>
						<Text style={styles.label}>
							Meet With
						</Text>

						<Pressable
							onPress={() =>
								setShowResidents(true)
							}
							style={styles.selectButton}
						>
							<View style={styles.selectLeft}>
								<View style={styles.selectIcon}>
									<UserRound
										size={18}
										color="#232466"
									/>
								</View>

								<View style={styles.selectedInfo}>
									{selectedResident ? (
										<>
											<Text
												style={
													styles.selectedName
												}
											>
												{
													selectedResident.name
												}
											</Text>

											<Text
												style={
													styles.selectedMeta
												}
											>
												{selectedResident.flatNumber
													? `Flat ${selectedResident.flatNumber}`
													: selectedResident.email}
											</Text>
										</>
									) : (
										<Text
											style={
												styles.placeholder
											}
										>
											Select resident
										</Text>
									)}
								</View>
							</View>

							<ChevronDown
								size={19}
								color="#64748B"
							/>
						</Pressable>
					</View>

					<View style={styles.field}>
						<Text style={styles.label}>
							Purpose of Visit
						</Text>

						<TextInput
							value={purpose}
							onChangeText={setPurpose}
							placeholder="e.g. Personal visit"
							placeholderTextColor="#94A3B8"
							style={[
								styles.input,
								styles.textArea,
							]}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
						/>
					</View>

					{error ? (
						<View style={styles.errorBox}>
							<Text style={styles.errorText}>
								{error}
							</Text>
						</View>
					) : null}

					{success ? (
						<View style={styles.successBox}>
							<Check
								size={18}
								color="#232466"
							/>

							<Text style={styles.successText}>
								Visitor registered successfully.
							</Text>
						</View>
					) : null}

					<Pressable
						onPress={handleCreateVisitor}
						disabled={loading || success}
						style={({ pressed }) => [
							styles.submitButton,
							pressed && styles.pressed,
							(loading || success) &&
								styles.disabled,
						]}
					>
						{loading ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<Text style={styles.submitText}>
								Register Visitor
							</Text>
						)}
					</Pressable>
				</View>
			</ScrollView>

			<Modal
				visible={showResidents}
				animationType="slide"
				transparent
				onRequestClose={() =>
					setShowResidents(false)
				}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modal}>
						<View style={styles.modalHeader}>
							<View>
								<Text style={styles.modalTitle}>
									Select Resident
								</Text>

								<Text style={styles.modalSubtitle}>
									Choose who the visitor wants to meet
								</Text>
							</View>

							<Pressable
								onPress={() =>
									setShowResidents(false)
								}
							>
								<Text style={styles.closeText}>
									Close
								</Text>
							</Pressable>
						</View>

						<View style={styles.searchBox}>
							<Search
								size={18}
								color="#64748B"
							/>

							<TextInput
								value={residentSearch}
								onChangeText={setResidentSearch}
								placeholder="Search resident or flat..."
								placeholderTextColor="#94A3B8"
								style={styles.searchInput}
							/>
						</View>

						{loadingResidents ? (
							<View style={styles.modalLoading}>
								<ActivityIndicator
									color="#232466"
								/>

								<Text style={styles.loadingText}>
									Loading residents...
								</Text>
							</View>
						) : (
							<ScrollView
								style={styles.residentList}
								showsVerticalScrollIndicator={false}
							>
								{filteredResidents.length === 0 ? (
									<View style={styles.empty}>
										<Text
											style={styles.emptyTitle}
										>
											No residents found
										</Text>
									</View>
								) : (
									filteredResidents.map(
										(resident) => {
											const selected =
												selectedResident?._id ===
												resident._id;

											return (
												<Pressable
													key={
														resident._id
													}
													onPress={() => {
														setSelectedResident(
															resident
														);

														setShowResidents(
															false
														);

														setResidentSearch(
															''
														);
													}}
													style={[
														styles.residentCard,
														selected &&
															styles.selectedCard,
													]}
												>
													<View
														style={
															styles.residentAvatar
														}
													>
														<Text
															style={
																styles.avatarText
															}
														>
															{resident.name
																.charAt(
																	0
																)
																.toUpperCase()}
														</Text>
													</View>

													<View
														style={
															styles.residentInfo
														}
													>
														<Text
															style={
																styles.residentName
															}
														>
															{
																resident.name
															}
														</Text>

														<Text
															style={
																styles.residentMeta
															}
														>
															{resident.flatNumber
																? `Flat ${resident.flatNumber}`
																: 'Resident'}
															{resident.floorNumber
																? ` • Floor ${resident.floorNumber}`
																: ''}
														</Text>
													</View>

													{selected ? (
														<Check
															size={
																20
															}
															color="#EF5622"
														/>
													) : null}
												</Pressable>
											);
										}
									)
								)}
							</ScrollView>
						)}
					</View>
				</View>
			</Modal>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},

	container: {
		padding: 20,
		paddingTop: 28,
		paddingBottom: 40,
	},

	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 24,
	},

	backButton: {
		width: 44,
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 13,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
		marginRight: 13,
	},

	title: {
		fontSize: 23,
		fontWeight: '800',
		color: '#232466',
	},

	subtitle: {
		marginTop: 3,
		fontSize: 12,
		color: '#64748B',
	},

	formCard: {
		padding: 18,
		borderRadius: 18,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	sectionTitle: {
		marginBottom: 20,
		fontSize: 17,
		fontWeight: '800',
		color: '#232466',
	},

	field: {
		marginBottom: 17,
	},

	label: {
		marginBottom: 8,
		fontSize: 13,
		fontWeight: '700',
		color: '#334155',
	},

	input: {
		height: 50,
		paddingHorizontal: 14,
		borderRadius: 11,
		borderWidth: 1,
		borderColor: '#D8DAE3',
		backgroundColor: '#FFFFFF',
		fontSize: 14,
		color: '#0F172A',
	},

	textArea: {
		height: 100,
		paddingTop: 14,
	},

	selectButton: {
		minHeight: 64,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 11,
		borderWidth: 1,
		borderColor: '#D8DAE3',
		backgroundColor: '#FFFFFF',
	},

	selectLeft: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},

	selectIcon: {
		width: 38,
		height: 38,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
		backgroundColor: '#F4F4FA',
	},

	selectedInfo: {
		flex: 1,
		marginLeft: 10,
	},

	selectedName: {
		fontSize: 14,
		fontWeight: '700',
		color: '#232466',
	},

	selectedMeta: {
		marginTop: 3,
		fontSize: 11,
		color: '#64748B',
	},

	placeholder: {
		marginLeft: 10,
		fontSize: 14,
		color: '#94A3B8',
	},

	errorBox: {
		padding: 12,
		marginBottom: 14,
		borderRadius: 10,
		backgroundColor: '#FFF1F2',
	},

	errorText: {
		fontSize: 12,
		color: '#DC2626',
	},

	successBox: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		marginBottom: 14,
		borderRadius: 10,
		backgroundColor: '#F4F4FA',
	},

	successText: {
		marginLeft: 8,
		fontSize: 12,
		fontWeight: '600',
		color: '#232466',
	},

	submitButton: {
		height: 52,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 13,
		backgroundColor: '#232466',
	},

	submitText: {
		fontSize: 14,
		fontWeight: '800',
		color: '#FFFFFF',
	},

	disabled: {
		opacity: 0.6,
	},

	pressed: {
		opacity: 0.7,
	},

	modalOverlay: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(35, 36, 102, 0.25)',
	},

	modal: {
		maxHeight: '82%',
		paddingTop: 20,
		paddingHorizontal: 20,
		paddingBottom: 30,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		backgroundColor: '#FFFFFF',
	},

	modalHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		marginBottom: 16,
	},

	modalTitle: {
		fontSize: 20,
		fontWeight: '800',
		color: '#232466',
	},

	modalSubtitle: {
		marginTop: 4,
		fontSize: 11,
		color: '#64748B',
	},

	closeText: {
		fontSize: 13,
		fontWeight: '700',
		color: '#EF5622',
	},

	searchBox: {
		height: 48,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 13,
		borderRadius: 11,
		borderWidth: 1,
		borderColor: '#D8DAE3',
		backgroundColor: '#FFFFFF',
	},

	searchInput: {
		flex: 1,
		marginLeft: 8,
		fontSize: 14,
		color: '#0F172A',
	},

	residentList: {
		marginTop: 14,
	},

	residentCard: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 13,
		paddingHorizontal: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5EC',
	},

	selectedCard: {
		backgroundColor: '#FFF8F4',
		borderRadius: 12,
		borderBottomWidth: 0,
	},

	residentAvatar: {
		width: 42,
		height: 42,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 21,
		backgroundColor: '#232466',
	},

	avatarText: {
		fontSize: 16,
		fontWeight: '800',
		color: '#FFFFFF',
	},

	residentInfo: {
		flex: 1,
		marginLeft: 12,
	},

	residentName: {
		fontSize: 14,
		fontWeight: '700',
		color: '#232466',
	},

	residentMeta: {
		marginTop: 3,
		fontSize: 11,
		color: '#64748B',
	},

	modalLoading: {
		minHeight: 180,
		alignItems: 'center',
		justifyContent: 'center',
	},

	loadingText: {
		marginTop: 8,
		fontSize: 12,
		color: '#64748B',
	},

	empty: {
		alignItems: 'center',
		paddingVertical: 35,
	},

	emptyTitle: {
		fontSize: 14,
		fontWeight: '700',
		color: '#232466',
	},
});