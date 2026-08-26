import { ScrollView, StyleSheet } from 'react-native';

import ResidentHeader from '@/components/resident/ResidentHeader';
import ResidentInfo from '@/components/resident/ResidentInfo';
import ResidentStats from '@/components/resident/ResidentStats';
import ResidentPendingVisitors from '@/components/resident/ResidentPendingVisitors';
import ResidentRecentVisitors from '@/components/resident/ResidentRecentVisitors';
import ResidentLogout from '@/components/resident/ResidentLogout';

export default function ResidentDashboardScreen() {
	return (
		<ScrollView
			style={styles.screen}
			contentContainerStyle={styles.container}
			showsVerticalScrollIndicator={false}
		>
			<ResidentHeader />

			<ResidentInfo />

			<ResidentStats />

			<ResidentPendingVisitors />

			<ResidentRecentVisitors />

			<ResidentLogout />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},

	container: {
		flexGrow: 1,
		padding: 20,
		paddingTop: 28,
		paddingBottom: 40,
		backgroundColor: '#FFFFFF',
	},
});