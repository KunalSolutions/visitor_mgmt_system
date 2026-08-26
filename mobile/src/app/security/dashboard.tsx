import { ScrollView, StyleSheet, View } from 'react-native';

import SecurityHeader from '@/components/security/SecurityHeader';
import SecurityStats from '@/components/security/SecurityStats';
import RegisterVisitor from '@/components/security/RegisterVisitorButton';
import SecurityLogout from '@/components/security/SecurityLogout';
import SecurityVisitorTable from '@/components/security/SecurityVisitorTable';

export default function SecurityDashboardScreen() {
	return (
		<ScrollView
			style={styles.screen}
			contentContainerStyle={styles.container}
			showsVerticalScrollIndicator={false}
		>
			<SecurityHeader />

			<View style={styles.section}>
				<SecurityStats />
			</View>

			<SecurityVisitorTable />

			<View style={styles.section}>
				<RegisterVisitor />
			</View>

			<View style={styles.logoutSection}>
				<SecurityLogout />
			</View>
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
		paddingBottom: 35,
	},

	section: {
		marginTop: 30,
	},

	logoutSection: {
		marginTop: 30,
	},
});