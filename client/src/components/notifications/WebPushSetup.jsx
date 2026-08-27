import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useUpdateWebPushSubscriptionMutation } from '@slices/userApiSlice';

const VAPID_PUBLIC_KEY =
	import.meta.env.VITE_VAPID_PUBLIC_KEY;

const urlBase64ToUint8Array = (base64String) => {
	const padding = '='.repeat(
		(4 - (base64String.length % 4)) % 4
	);

	const base64 = (base64String + padding)
		.replace(/-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);

	return Uint8Array.from(
		[...rawData],
		(char) => char.charCodeAt(0)
	);
};

export default function WebPushSetup() {
	const { userInfo } = useSelector(
		(state) => state.auth
	);

	const [
		updateWebPushSubscription,
	] = useUpdateWebPushSubscriptionMutation();

	useEffect(() => {
		if (!userInfo) return;

		registerPush();
	}, [userInfo]);

	const registerPush = async () => {
		try {
			if (!VAPID_PUBLIC_KEY) {
				console.error(
					'VITE_VAPID_PUBLIC_KEY is missing.'
				);
				return;
			}

			if (!('Notification' in window)) {
				return;
			}

			if (!('serviceWorker' in navigator)) {
				return;
			}

			if (!('PushManager' in window)) {
				return;
			}

			const registration =
				await navigator.serviceWorker.register('/sw.js');

			let permission = Notification.permission;

			if (permission === 'default') {
				permission =
					await Notification.requestPermission();
			}

			if (permission !== 'granted') {
				console.log(
					'Notification permission not granted.'
				);
				return;
			}

			let subscription =
				await registration.pushManager.getSubscription();

			if (!subscription) {
				subscription =
					await registration.pushManager.subscribe({
						userVisibleOnly: true,
						applicationServerKey:
							urlBase64ToUint8Array(
								VAPID_PUBLIC_KEY
							),
					});
			}

			await updateWebPushSubscription(
				subscription.toJSON()
			).unwrap();

			console.log(
				'Web push subscription registered successfully.'
			);
		} catch (error) {
			console.error(
				'Web push registration error:',
				error
			);
		}
	};

	return null;
}