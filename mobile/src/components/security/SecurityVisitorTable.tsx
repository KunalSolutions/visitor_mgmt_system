import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {
	Phone,
	UserRound,
	UsersRound,
} from 'lucide-react-native';

import api from '@/services/api';

type Visitor = {
	_id: string;
	visitorName?: string;
	mobile?: string;
	purpose?: string;
	remark?: string;
	status?: string;
	createdAt?: string;
	meetWith?: {
		name?: string;
		flatNumber?: string | null;
		floorNumber?: string | number | null;
	};
};

export default function SecurityVisitorTable() {
	const [visitors, setVisitors] = useState<Visitor[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchVisitors = useCallback(async () => {
		try {
			const response = await api.get('/visitors');

			const data = response.data;

			   setVisitors(
				Array.isArray(data)
					? data
					: data?.visitors || []
			);
		} catch (error) {
			console.error(
				'Securty visitor table error:',
				error
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchVisitors();
	}, [fetchVisitors]);

	const getStatusStyle = (status?: string) => {
		switch (status) {
			case 'Approved':
				return styles.approvedBadge;

			case 'Rejected':
				return styles.rejectedBadge;

			default:
				return styles.pendingBadge;
		}
	};

	const getStatusTextStyle = (status?: string) => {
		switch (status) {
			case 'Approved':
				return styles.approvedText;

			case 'Rejected':
				return styles.rejectedText;

			default:
				return styles.pendingText;
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
					Loading visitor records...
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Text style={styles.title}>
						Visitor Records
					</Text>

					<Text style={styles.subtitle}>
						Visitor information and approval status
					</Text>
				</View>

				<View style={styles.countBadge}>
					<Text style={styles.countText}>
						{visitors.length}
					</Text>
				</View>
			</View>

			{visitors.length === 0 ? (
				<View style={styles.empty}>
					<View style={styles.emptyIcon}>
						<UsersRound
							size={25}
							color="#232466"
						/>
					</View>

					<Text style={styles.emptyTitle}>
						No visitor records
					</Text>

					<Text style={styles.emptyText}>
						Registered visitors will appear here.
					</Text>
				</View>
			) : (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					<View style={styles.table}>
						<View style={styles.tableHeader}>
							<Text
								style={[
									styles.headerCell,
									styles.visitorColumn,
								]}
							>
								Visitor
							</Text>

							<Text
								style={[
									styles.headerCell,
									styles.mobileColumn,
								]}
							>
								Mobile
							</Text>

							<Text
								style={[
									styles.headerCell,
									styles.meetColumn,
								]}
							>
								Meet With
							</Text>

							<Text
								style={[
									styles.headerCell,
									styles.flatColumn,
								]}
							>
								Flat
							</Text>

							<Text
								style={[
									styles.headerCell,
									styles.purposeColumn,
								]}
							>
								Purpose
							</Text>

							<Text
								style={[
									styles.headerCell,
									styles.statusColumn,
								]}
							>
								Status
							</Text>

							<Text
								style={[
									styles.headerCell,
									styles.remarkColumn,
								]}
							>
								Reason
							</Text>
						</View>

						{visitors.map((visitor) => (
							<View
								key={visitor._id}
								style={styles.tableRow}
							>
								<View
									style={[
										styles.cell,
										styles.visitorColumn,
									]}
								>
									<View style={styles.visitorCell}>
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

										<Text
											style={
												styles.visitorName
											}
											numberOfLines={1}
										>
											{visitor.visitorName ||
												'Unknown'}
										</Text>
									</View>
								</View>

								<View
									style={[
										styles.cell,
										styles.mobileColumn,
									]}
								>
									<View
										style={
											styles.mobileCell
										}
									>
										<Phone
											size={13}
											color="#64748B"
										/>

										<Text
											style={
												styles.cellText
											}
										>
											{visitor.mobile ||
												'—'}
										</Text>
									</View>
								</View>

								<View
									style={[
										styles.cell,
										styles.meetColumn,
									]}
								>
									<Text
										style={
											styles.primaryCellText
										}
									>
										{visitor.meetWith
											?.name || '—'}
									</Text>

									{visitor.meetWith
										?.floorNumber ? (
										<Text
											style={
												styles.secondaryText
											}
										>
											Floor{' '}
											{
												visitor
													.meetWith
													.floorNumber
											}
										</Text>
									) : null}
								</View>

								<View
									style={[
										styles.cell,
										styles.flatColumn,
									]}
								>
									<Text
										style={
											styles.primaryCellText
										}
									>
										{visitor.meetWith
											?.flatNumber
											? `Flat ${visitor.meetWith.flatNumber}`
											: '—'}
									</Text>
								</View>

								<View
									style={[
										styles.cell,
										styles.purposeColumn,
									]}
								>
									<Text
										style={
											styles.cellText
										}
										numberOfLines={2}
									>
										{visitor.purpose ||
											'—'}
									</Text>
								</View>

								<View
									style={[
										styles.cell,
										styles.statusColumn,
									]}
								>
									<View
										style={[
											styles.statusBadge,
											getStatusStyle(
												visitor.status
											),
										]}
									>
										<Text
											style={[
												styles.statusText,
												getStatusTextStyle(
													visitor.status
												),
											]}
										>
											{visitor.status ||
												'Pending'}
										</Text>
									</View>
								</View>

								<View
									style={[
										styles.cell,
										styles.remarkColumn,
									]}
								>
									<Text
										style={
											styles.cellText
										}
										numberOfLines={2}
									>
										{visitor.remark ||
											'—'}
									</Text>
								</View>
							</View>
						))}
					</View>
				</ScrollView>
			)}
		</View>
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
		marginTop: 4,
		fontSize: 11,
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

	table: {
		width: 920,
	},

	tableHeader: {
		height: 44,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#232466',
	},

	headerCell: {
		paddingHorizontal: 12,
		fontSize: 10,
		fontWeight: '800',
		color: '#FFFFFF',
		textTransform: 'uppercase',
		letterSpacing: 0.3,
	},

	tableRow: {
		minHeight: 78,
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5EC',
		backgroundColor: '#FFFFFF',
	},

	cell: {
		paddingHorizontal: 12,
		justifyContent: 'center',
	},

	visitorColumn: {
		width: 170,
	},

	mobileColumn: {
		width: 145,
	},

	meetColumn: {
		width: 160,
	},

	flatColumn: {
		width: 100,
	},

	purposeColumn: {
		width: 140,
	},

	statusColumn: {
		width: 115,
	},

	remarkColumn: {
		width: 140,
	},

	visitorCell: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	avatar: {
		width: 36,
		height: 36,
		marginRight: 9,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 18,
		backgroundColor: '#232466',
		borderWidth: 1,
		borderColor: '#EF5622',
	},

	avatarText: {
		fontSize: 13,
		fontWeight: '800',
		color: '#FFFFFF',
	},

	visitorName: {
		flex: 1,
		fontSize: 12,
		fontWeight: '700',
		color: '#232466',
	},

	mobileCell: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	cellText: {
		fontSize: 11,
		lineHeight: 16,
		color: '#475569',
	},

	primaryCellText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#334155',
	},

	secondaryText: {
		marginTop: 3,
		fontSize: 10,
		color: '#64748B',
	},

	statusBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: 9,
		paddingVertical: 5,
		borderRadius: 20,
	},

	pendingBadge: {
		backgroundColor: '#FFF8F4',
	},

	approvedBadge: {
		backgroundColor: '#F1F1F8',
	},

	rejectedBadge: {
		backgroundColor: '#FFF1EC',
	},

	statusText: {
		fontSize: 10,
		fontWeight: '700',
	},

	pendingText: {
		color: '#232466',
	},

	approvedText: {
		color: '#232466',
	},

	rejectedText: {
		color: '#EF5622',
	},

	loading: {
		minHeight: 180,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 28,
		borderRadius: 18,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EC',
	},

	loadingText: {
		marginTop: 8,
		fontSize: 12,
		color: '#64748B',
	},

	empty: {
		alignItems: 'center',
		paddingVertical: 40,
		paddingHorizontal: 20,
	},

	emptyIcon: {
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15,
		backgroundColor: '#F4F4FA',
	},

	emptyTitle: {
		marginTop: 12,
		fontSize: 14,
		fontWeight: '700',
		color: '#232466',
	},

	emptyText: {
		marginTop: 5,
		fontSize: 11,
		color: '#64748B',
	},
});