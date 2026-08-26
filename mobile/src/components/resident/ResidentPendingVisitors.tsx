import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import {
	Check,
	Clock3,
	Phone,
	UserRound,
	X,
} from 'lucide-react-native';

import api from '@/services/api';

type Visitor = {
	_id: string;
	visitorName?: string;
	mobile?: string;
	purpose?: string;
	status?: string;
	createdAt?: string;
	photo?: string;
	meetWith?: {
		_id?: string;
	};
};

export default function ResidentPendingVisitors() {
	const [visitors, setVisitors] = useState<Visitor[]>([]);
	const [userId, setUserId] = useState('');
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState('');
	const [selectedVisitor, setSelectedVisitor] =
		useState<Visitor | null>(null);
	const [remark, setRemark] = useState('');
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [error, setError] = useState('');

	const fetchVisitors = useCallback(async () => {
		try {
			setError('');

			const [profileResponse, visitorsResponse] =
				await Promise.all([
					api.get('/users/profile'),
					api.get('/visitors'),
				]);

			const profile =
				profileResponse.data?.user ||
				profileResponse.data?.data ||
				profileResponse.data;

			const data = visitorsResponse.data;

			setUserId(profile?._id || '');

			setVisitors(
				Array.isArray(data)
					? data
					: data?.visitors || []
			);
		} catch (error: any) {
			console.error(
				'Resident pending visitors error:',
				error
			);

			setError(
				error?.response?.data?.message ||
					'Failed to load visitor requests.'
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchVisitors();
	}, [fetchVisitors]);

	const pendingVisitors = useMemo(() => {
		return visitors.filter(
			(visitor) =>
				visitor.meetWith?._id?.toString() ===
					userId?.toString() &&
				visitor.status === 'Pending'
		);
	}, [visitors, userId]);

	const handleApprove = async (visitor: Visitor) => {
		try {
			setUpdatingId(visitor._id);
			setError('');

			await api.put(
				`/visitors/${visitor._id}/status`,
				{
					status: 'Approved',
					remark: '',
				}
			);

			setVisitors((current) =>
				current.map((item) =>
					item._id === visitor._id
						? {
								...item,
								status: 'Approved',
							}
						: item
				)
			);
		} catch (error: any) {
			console.error(error);

			setError(
				error?.response?.data?.message ||
					'Failed to approve visitor.'
			);
		} finally {
			setUpdatingId('');
		}
	};

	const openRejectModal = (visitor: Visitor) => {
		setSelectedVisitor(visitor);
		setRemark('');
		setError('');
		setShowRejectModal(true);
	};

	const closeRejectModal = () => {
		if (updatingId) return;

		setSelectedVisitor(null);
		setRemark('');
		setShowRejectModal(false);
	};

	const handleReject = async () => {
		if (!selectedVisitor) return;

		try {
			setUpdatingId(selectedVisitor._id);
			setError('');

			await api.put(
				`/visitors/${selectedVisitor._id}/status`,
				{
					status: 'Rejected',
					remark: remark.trim(),
				}
			);

			setVisitors((current) =>
				current.map((item) =>
					item._id === selectedVisitor._id
						? {
								...item,
								status: 'Rejected',
							}
						: item
				)
			);

			closeRejectModal();
		} catch (error: any) {
			console.error(error);

			setError(
				error?.response?.data?.message ||
					'Failed to reject visitor.'
			);
		} finally {
			setUpdatingId('');
		}
	};

	if (loading) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator
					size="small"
					color="#232466"
				/>

				<Text style={styles.loadingText}>
					Loading visitor requests...
				</Text>
			</View>
		);
	}

	return (
		<>
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.headerLeft}>
						<Text style={styles.title}>
							Pending Visitor Requests
						</Text>

						<Text style={styles.subtitle}>
							Review visitors waiting for your approval.
						</Text>
					</View>

					<View style={styles.countBadge}>
						<Text style={styles.countText}>
							{pendingVisitors.length}
						</Text>
					</View>
				</View>

				{error ? (
					<View style={styles.errorBox}>
						<Text style={styles.errorText}>
							{error}
						</Text>
					</View>
				) : null}

				{pendingVisitors.length === 0 ? (
					<View style={styles.empty}>
						<View style={styles.emptyIcon}>
							<Check
								size={23}
								color="#232466"
								strokeWidth={2}
							/>
						</View>

						<Text style={styles.emptyTitle}>
							No pending requests
						</Text>

						<Text style={styles.emptyText}>
							You are all caught up.
						</Text>
					</View>
				) : (
					<View style={styles.list}>
						{pendingVisitors.map((visitor) => {
							const updating =
								updatingId === visitor._id;

							return (
								<View
									key={visitor._id}
									style={styles.card}
								>
									<View
										style={styles.visitorHeader}
									>
										<View style={styles.avatar}>
											<Text
												style={
													styles.avatarText
												}
											>
												{visitor.visitorName
													?.charAt(0)
													?.toUpperCase() ||
													'V'}
											</Text>
										</View>

										<View
											style={
												styles.visitorInfo
											}
										>
											<Text
												style={
													styles.visitorName
												}
											>
												{visitor.visitorName ||
													'Unknown Visitor'}
											</Text>

											<View
												style={
													styles.metaRow
												}
											>
												<Phone
													size={12}
													color="#64748B"
												/>

												<Text
													style={
														styles.metaText
													}
												>
													{visitor.mobile ||
														'No mobile number'}
												</Text>
											</View>
										</View>

										<View
											style={
												styles.pendingBadge
											}
										>
											<Clock3
												size={12}
												color="#EF5622"
											/>

											<Text
												style={
													styles.pendingText
												}
											>
												Pending
											</Text>
										</View>
									</View>

									<View style={styles.divider} />

									<View style={styles.detailRow}>
										<Text
											style={styles.label}
										>
											Purpose
										</Text>

										<Text
											style={styles.value}
											numberOfLines={2}
										>
											{visitor.purpose || '—'}
										</Text>
									</View>

									{visitor.createdAt ? (
										<View
											style={
												styles.detailRow
											}
										>
											<Text
												style={styles.label}
											>
												Requested
											</Text>

											<Text
												style={styles.value}
											>
												{new Date(
													visitor.createdAt
												).toLocaleString()}
											</Text>
										</View>
									) : null}

									<View style={styles.actions}>
										<Pressable
											disabled={updating}
											onPress={() =>
												handleApprove(
													visitor
												)
											}
											style={({ pressed }) => [
												styles.approveButton,
												pressed &&
													styles.pressed,
												updating &&
													styles.disabled,
											]}
										>
											{updating ? (
												<ActivityIndicator
													size="small"
													color="#FFFFFF"
												/>
											) : (
												<>
													<Check
														size={16}
														color="#FFFFFF"
													/>

													<Text
														style={
															styles.approveText
														}
													>
														Approve
													</Text>
												</>
											)}
										</Pressable>

										<Pressable
											disabled={updating}
											onPress={() =>
												openRejectModal(
													visitor
												)
											}
											style={({ pressed }) => [
												styles.rejectButton,
												pressed &&
													styles.pressed,
												updating &&
													styles.disabled,
											]}
										>
											<X
												size={16}
												color="#EF5622"
											/>

											<Text
												style={
													styles.rejectText
												}
											>
												Reject
											</Text>
										</Pressable>
									</View>
								</View>
							);
						})}
					</View>
				)}
			</View>

			<Modal
				visible={showRejectModal}
				transparent
				animationType="fade"
				onRequestClose={closeRejectModal}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modal}>
						<Text style={styles.modalTitle}>
							Reject Visitor
						</Text>

						<Text style={styles.modalSubtitle}>
							Why are you rejecting{' '}
							{selectedVisitor?.visitorName}?
						</Text>

						<Text style={styles.modalLabel}>
							Remark
						</Text>

						<TextInput
							value={remark}
							onChangeText={setRemark}
							placeholder="Enter reason for rejection..."
							placeholderTextColor="#94A3B8"
							multiline
							numberOfLines={4}
							textAlignVertical="top"
							style={styles.remarkInput}
						/>

						<View style={styles.modalActions}>
							<Pressable
								disabled={!!updatingId}
								onPress={closeRejectModal}
								style={styles.cancelButton}
							>
								<Text style={styles.cancelText}>
									Cancel
								</Text>
							</Pressable>

							<Pressable
								disabled={!!updatingId}
								onPress={handleReject}
								style={[
									styles.confirmRejectButton,
									updatingId &&
										styles.disabled,
								]}
							>
								{updatingId ? (
									<ActivityIndicator color="#FFFFFF" />
								) : (
									<Text
										style={
											styles.confirmRejectText
										}
									>
										Reject Visitor
									</Text>
								)}
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 28,
		borderRadius: 18,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
		overflow: 'hidden',
	},

	header: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		padding: 17,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5EC',
	},

	headerLeft: {
		flex: 1,
		paddingRight: 12,
	},

	title: {
		fontSize: 16,
		fontWeight: '800',
		color: '#232466',
	},

	subtitle: {
		marginTop: 5,
		fontSize: 11,
		lineHeight: 16,
		color: '#64748B',
	},

	countBadge: {
		minWidth: 28,
		paddingHorizontal: 8,
		paddingVertical: 5,
		alignItems: 'center',
		borderRadius: 14,
		backgroundColor: '#FFF1EC',
	},

	countText: {
		fontSize: 11,
		fontWeight: '800',
		color: '#EF5622',
	},

	list: {
		padding: 12,
	},

	card: {
		marginBottom: 10,
		padding: 15,
		borderRadius: 15,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	visitorHeader: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	avatar: {
		width: 44,
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 22,
		backgroundColor: '#232466',
		borderWidth: 1,
		borderColor: '#EF5622',
	},

	avatarText: {
		fontSize: 16,
		fontWeight: '800',
		color: '#FFFFFF',
	},

	visitorInfo: {
		flex: 1,
		marginLeft: 11,
		marginRight: 8,
	},

	visitorName: {
		fontSize: 14,
		fontWeight: '700',
		color: '#232466',
	},

	metaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 4,
	},

	metaText: {
		marginLeft: 4,
		fontSize: 11,
		color: '#64748B',
	},

	pendingBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingHorizontal: 8,
		paddingVertical: 5,
		borderRadius: 20,
		backgroundColor: '#FFF8F4',
	},

	pendingText: {
		fontSize: 10,
		fontWeight: '700',
		color: '#EF5622',
	},

	divider: {
		height: 1,
		marginVertical: 12,
		backgroundColor: '#E5E5EC',
	},

	detailRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		marginTop: 7,
	},

	label: {
		fontSize: 11,
		color: '#64748B',
	},

	value: {
		maxWidth: '66%',
		fontSize: 12,
		fontWeight: '600',
		textAlign: 'right',
		color: '#334155',
	},

	actions: {
		flexDirection: 'row',
		gap: 9,
		marginTop: 15,
	},

	approveButton: {
		flex: 1,
		height: 44,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 7,
		borderRadius: 11,
		backgroundColor: '#232466',
	},

	approveText: {
		fontSize: 13,
		fontWeight: '700',
		color: '#FFFFFF',
	},

	rejectButton: {
		flex: 1,
		height: 44,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 7,
		borderRadius: 11,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#EF5622',
	},

	rejectText: {
		fontSize: 13,
		fontWeight: '700',
		color: '#EF5622',
	},

	loading: {
		minHeight: 180,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
	},

	loadingText: {
		marginTop: 8,
		fontSize: 12,
		color: '#64748B',
	},

	errorBox: {
		margin: 12,
		padding: 12,
		borderRadius: 10,
		backgroundColor: '#FFF1EC',
	},

	errorText: {
		fontSize: 12,
		color: '#EF5622',
	},

	empty: {
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 36,
	},

	emptyIcon: {
		width: 48,
		height: 48,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 14,
		backgroundColor: '#F4F4FA',
	},

	emptyTitle: {
		marginTop: 11,
		fontSize: 14,
		fontWeight: '700',
		color: '#232466',
	},

	emptyText: {
		marginTop: 4,
		fontSize: 11,
		color: '#64748B',
	},

	modalOverlay: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		backgroundColor: 'rgba(35, 36, 102, 0.28)',
	},

	modal: {
		width: '100%',
		maxWidth: 420,
		padding: 20,
		borderRadius: 20,
		backgroundColor: '#FFFFFF',
	},

	modalTitle: {
		fontSize: 19,
		fontWeight: '800',
		color: '#232466',
	},

	modalSubtitle: {
		marginTop: 5,
		fontSize: 12,
		lineHeight: 17,
		color: '#64748B',
	},

	modalLabel: {
		marginTop: 20,
		marginBottom: 8,
		fontSize: 13,
		fontWeight: '700',
		color: '#334155',
	},

	remarkInput: {
		minHeight: 100,
		padding: 13,
		borderRadius: 11,
		borderWidth: 1,
		borderColor: '#D8DAE3',
		fontSize: 13,
		color: '#0F172A',
	},

	modalActions: {
		flexDirection: 'row',
		gap: 9,
		marginTop: 18,
	},

	cancelButton: {
		flex: 1,
		height: 46,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 11,
		borderWidth: 1,
		borderColor: '#E5E5EC',
		backgroundColor: '#FFFFFF',
	},

	cancelText: {
		fontSize: 13,
		fontWeight: '700',
		color: '#64748B',
	},

	confirmRejectButton: {
		flex: 1,
		height: 46,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 11,
		backgroundColor: '#EF5622',
	},

	confirmRejectText: {
		fontSize: 13,
		fontWeight: '700',
		color: '#FFFFFF',
	},

	disabled: {
		opacity: 0.55,
	},

	pressed: {
		opacity: 0.7,
	},
});