import webpush from 'web-push';

webpush.setVapidDetails(
	process.env.VAPID_EMAIL,
	process.env.VAPID_PUBLIC_KEY,
	process.env.VAPID_PRIVATE_KEY
);

const sendWebPushNotification = async (
	subscription,
	payload
) => {
	if (!subscription?.endpoint) {
		return false;
	}

	try {
		await webpush.sendNotification(
			subscription,
			JSON.stringify(payload)
		);

		return true;
	} catch (error) {
		console.error(
			'Web push notification error:',
			error
		);

		return false;
	}
};

export default sendWebPushNotification;