import { Stack } from 'expo-router';

import PushNotificationSetup from '@/components/notifications/PushNotificationSetup';

export default function RootLayout() {
	return (
		<>
			<PushNotificationSetup />

			<Stack
				screenOptions={{
					headerShown: false,
				}}
			/>
		</>
	);
}