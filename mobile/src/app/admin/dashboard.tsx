import { ScrollView, StyleSheet } from 'react-native';

import AdminHeader from '@/components/admin/AdminHeader';
import AdminStats from '@/components/admin/AdminStats';
import AdminQuickActions from '@/components/admin/AdminQuickActions';
import CreateUserButton from '@/components/admin/CreateUserButton';
import AdminLogout from '@/components/admin/AdminLogout';

export default function AdminDashboardScreen() {
	return (
		<ScrollView
			contentContainerStyle={styles.container}
			showsVerticalScrollIndicator={false}
		>
			<AdminHeader />

			<CreateUserButton />

			<AdminStats />

			<AdminQuickActions />

            <AdminLogout />
            
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 20,
		paddingBottom: 40,
		backgroundColor: '#FFFFFF',
	},
});