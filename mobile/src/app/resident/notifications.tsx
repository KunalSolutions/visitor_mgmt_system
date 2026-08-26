import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {
	ArrowLeft,
	Bell,
	CheckCircle2,
	Clock3,
	UserRound,
} from 'lucide-react-native';
import { router } from 'expo-router';

import api from '@/services/api';

type Notification = {
	_id: string;
	title?: string;
	message?: string;
	type?: string;
	read?: boolean;
	createdAt?: string;
	visitor?: {
		visitorName?: string;
		status?: string;
	};
};

export default function ResidentNotificationsScreen() {
	const [notifications, setNotifications] = useState<
		Notification[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState('');

	const fetchNotifications = useCallback(async () => {
		try {
			setError('');

			const response = await api.get('/notifications');

			const data = response.data;

			setNotifications(
				Array.isArray(data)
					? data
					: data?.notifications || []
			);
		} catch (error: any) {
			console.error(
				'Notifications error:',
				error
			);

			setError(
				error?.response?.data?.message ||
					'Failed to load notifications.'
			);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	const handleRefresh = () => {
		setRefreshing(true);
		fetchNotifications();
	};

	const getIcon = (notification: Notification) => {
		switch (notification.type?.toLowerCase()) {
			case 'visitor':
				return (
					<UserRound
						size={19}
						color="#232466"
						strokeWidth={2}
					/>
				);

			case 'approved':
				return (
					<CheckCircle2
						size={19}
						color="#232466"
						strokeWidth={2}
					/>
				);

			case 'pending':
				return (
					<Clock3
						size={19}
						color="#EF5622"
						strokeWidth={2}
					/>
				);

			default:
				return (
					<Bell
						size={19}
						color="#232466"
						strokeWidth={2}
					/>
				);
		}
	};

	const formatDate = (value?: string) => {
		if (!value) return '';

		return new Date(value).toLocaleString(
			undefined,
			{
				day: '2-digit',
				month: 'short',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			}
		);
	};

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator
					size="large"
					color="#232466"
				/>

				<Text style={styles.loadingText}>
					Loading notifications...
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.screen}>
			<View style={styles.header}>
				<Pressable
					onPress={() => router.back()}
					style={({ pressed }) => [
						styles.backButton,
						pressed && styles.pressed,
					]}
				>
					<ArrowLeft
						size={21}
						color="#232466"
						strokeWidth={2.2}
					/>
				</Pressable>

				<View style={styles.headerText}>
					<Text style={styles.title}>
						Notifications
					</Text>

					<Text style={styles.subtitle}>
						Stay updated with visitor activity
					</Text>
				</View>

				<View style={styles.headerIcon}>
					<Bell
						size={20}
						color="#232466"
						strokeWidth={2}
					/>
				</View>
			</View>

			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
						tintColor="#232466"
					/>
				}
			>
				{error ? (
					<View style={styles.errorBox}>
						<Text style={styles.errorText}>
							{error}
						</Text>

						<Pressable
							onPress={fetchNotifications}
							style={styles.retryButton}
						>
							<Text style={styles.retryText}>
								Try Again
							</Text>
						</Pressable>
					</View>
				) : notifications.length === 0 ? (
					<View style={styles.empty}>
						<View style={styles.emptyIcon}>
							<Bell
								size={25}
								color="#232466"
								strokeWidth={1.8}
							/>
						</View>

						<Text style={styles.emptyTitle}>
							No notifications
						</Text>

						<Text style={styles.emptyText}>
							You're all caught up.
						</Text>
					</View>
				) : (
					<View style={styles.list}>
						{notifications.map(
							(notification) => (
								<View
									key={notification._id}
									style={[
										styles.card,
										notification.read === false &&
											styles.unreadCard,
									]}
								>
									<View style={styles.cardTop}>
										<View style={styles.iconContainer}>
											{getIcon(
												notification
											)}
										</View>

										<View style={styles.cardContent}>
											<View
												style={
													styles.titleRow
												}
											>
												<Text
													style={
														styles.notificationTitle
													}
												>
													{notification.title ||
														'Notification'}
												</Text>

												{notification.read ===
												false ? (
													<View
														style={
															styles.unreadDot
														}
													/>
												) : null}
											</View>

											<Text
												style={
													styles.message
												}
											>
												{notification.message ||
													'No message available.'}
											</Text>

											{notification
												.visitor
												?.visitorName ? (
												<View
													style={
														styles.visitorTag
													}
												>
													<UserRound
														size={12}
														color="#232466"
													/>

													<Text
														style={
															styles.visitorText
														}
													>
														{
															notification
																.visitor
																.visitorName
														}
													</Text>
												</View>
											) : null}

											<Text
												style={
													styles.date
												}
											>
												{formatDate(
													notification.createdAt
												)}
											</Text>
										</View>
									</View>
								</View>
							)
						)}
					</View>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},

	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 28,
		paddingHorizontal: 20,
		paddingBottom: 16,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5EC',
	},

	backButton: {
		width: 42,
		height: 42,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	headerText: {
		flex: 1,
		marginLeft: 12,
	},

	title: {
		fontSize: 20,
		fontWeight: '800',
		color: '#232466',
	},

	subtitle: {
		marginTop: 3,
		fontSize: 11,
		color: '#64748B',
	},

	headerIcon: {
		width: 42,
		height: 42,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 12,
		backgroundColor: '#F4F4FA',
	},

	content: {
		flexGrow: 1,
		padding: 20,
		paddingBottom: 40,
	},

	list: {
		gap: 10,
	},

	card: {
		padding: 15,
		borderRadius: 16,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	unreadCard: {
		borderColor: '#232466',
	},

	cardTop: {
		flexDirection: 'row',
	},

	iconContainer: {
		width: 42,
		height: 42,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 12,
		backgroundColor: '#F4F4FA',
	},

	cardContent: {
		flex: 1,
		marginLeft: 12,
	},

	titleRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	notificationTitle: {
		flex: 1,
		fontSize: 14,
		fontWeight: '800',
		color: '#232466',
	},

	unreadDot: {
		width: 7,
		height: 7,
		marginLeft: 7,
		borderRadius: 4,
		backgroundColor: '#EF5622',
	},

	message: {
		marginTop: 5,
		fontSize: 12,
		lineHeight: 18,
		color: '#475569',
	},

	visitorTag: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		gap: 5,
		marginTop: 9,
		paddingHorizontal: 8,
		paddingVertical: 5,
		borderRadius: 8,
		backgroundColor: '#F4F4FA',
	},

	visitorText: {
		fontSize: 10,
		fontWeight: '600',
		color: '#232466',
	},

	date: {
		marginTop: 9,
		fontSize: 10,
		color: '#94A3B8',
	},

	empty: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 80,
	},

	emptyIcon: {
		width: 52,
		height: 52,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 16,
		backgroundColor: '#F4F4FA',
	},

	emptyTitle: {
		marginTop: 13,
		fontSize: 15,
		fontWeight: '700',
		color: '#232466',
	},

	emptyText: {
		marginTop: 4,
		fontSize: 12,
		color: '#64748B',
	},

	errorBox: {
		padding: 16,
		borderRadius: 14,
		backgroundColor: '#FFF1EC',
	},

	errorText: {
		fontSize: 12,
		lineHeight: 17,
		color: '#EF5622',
	},

	retryButton: {
		marginTop: 12,
		alignSelf: 'flex-start',
		paddingHorizontal: 15,
		paddingVertical: 9,
		borderRadius: 10,
		backgroundColor: '#232466',
	},

	retryText: {
		fontSize: 12,
		fontWeight: '700',
		color: '#FFFFFF',
	},

	center: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
	},

	loadingText: {
		marginTop: 10,
		fontSize: 13,
		color: '#64748B',
	},

	pressed: {
		opacity: 0.7,
	},
});