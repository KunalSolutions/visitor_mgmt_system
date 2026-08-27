import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import api from '@/services/api';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

export default function PushNotificationSetup() {
	useEffect(() => {
		registerForPushNotifications();
	}, []);

	const registerForPushNotifications = async () => {
		try {
			if (!Device.isDevice) {
				console.log(
					'Push notifications require a physical device.'
				);
				return;
			}

			if (Platform.OS === 'android') {
				await Notifications.setNotificationChannelAsync(
					'default',
					{
						name: 'Default',
						importance:
							Notifications.AndroidImportance.MAX,
						vibrationPattern: [0, 250, 250, 250],
						lightColor: '#EF5622',
					}
				);
			}

			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();

			let finalStatus = existingStatus;

			if (existingStatus !== 'granted') {
				const { status } =
					await Notifications.requestPermissionsAsync();

				finalStatus = status;
			}

			if (finalStatus !== 'granted') {
				console.log(
					'Notification permission not granted.'
				);
				return;
			}

			const projectId =
				Constants.expoConfig?.extra?.eas
					?.projectId ||
				Constants.easConfig?.projectId;

			if (!projectId) {
				console.error(
					'EAS project ID not found.'
				);
				return;
			}

			const tokenResponse =
				await Notifications.getExpoPushTokenAsync({
					projectId,
				});

			const expoPushToken =
				tokenResponse.data;

			if (!expoPushToken) {
				console.error(
					'Expo push token not received.'
				);
				return;
			}

			await api.put('/users/push-token', {
				expoPushToken,
			});

			console.log(
				'Push token registered successfully.'
			);
		} catch (error) {
			console.error(
				'Push notification setup error:',
				error
			);
		}
	};

	return null;
}