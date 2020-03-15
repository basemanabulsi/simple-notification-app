import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

class NotificationManager {
	configure = (onRegister, onNotification, onOpenNotification) => {
		PushNotification.configure({
			// (optional) Called when Token is generated (iOS and Android)
			onRegister: function(token) {
				onRegister(token);
				console.log('[NotificationManager] TOKEN:', token);
			},

			// (required) Called when a remote or local notification is opened or received
			onNotification: function(notification) {
				console.log('[NotificationManager] NOTIFICATION:', notification);

				if (Platform.OS === 'ios') {
					if (notification.data.openedInForeground) {
						notification.userInteraction = true;
					} else {
						notification.userInteraction = true;
					}
				}

				if (notification.userInteraction) {
					onOpenNotification(notification);
				} else {
					onNotification(notification);
				}

				// Only call callback if not from foreground
				if (Platform.OS === 'ios') {
					if (!notification.data.openedInForeground) {
						notification.finish('backgroundFetchResultNoData');
					}
				} else {
					notification.finish('backgroundFetchResultNoData');
				}
			}
		});
	};

	_buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
		return {
			id: id,
			autoCancel: true,
			largeIcon: options.largeIcon || 'ic_launcher',
			smallIcon: options.smallIcon || 'ic_launcher',
			bigText: message || '',
			subText: title || '',
			vibrate: options.vibrate || false,
			vibration: options.vibration || 300,
			priority: options.priority || 'high',
			importance: options.importance || 'high',
			data: data
		};
	};

	_buildIOSNotification = (id, title, message, data = {}, options = {}) => {
		return {
			alertAction: options.alertAction || 'view',
			category: options.category || '',
			userInfo: {
				id: id,
				item: data
			}
		};
	};

	showNotification = (id, title, message, data = {}, options = {}) => {
		PushNotification.localNotification({
			/* Android Only Properties */
			...this._buildAndroidNotification(id, title, message, data, options),
			/* IOS Only Properties */
			...this._buildIOSNotification(id, title, message, data, options),
			/* IOS and Android  Properties */
			title: title || '',
			message: message || '',
			playSound: options.playSound,
			soundName: options.soundName || 'default',
			userInteraction: false
		});
	};

	scheduleNotification = (id, title, message, date, data = {}, options = {}) => {
		PushNotification.localNotificationSchedule({
			/* Android Only Properties */
			...this._buildAndroidNotification(id, title, message, data, options),
			/* IOS Only Properties */
			...this._buildIOSNotification(id, title, message, data, options),
			/* IOS and Android  Properties */
			title: title || '',
			message: message || '',
			playSound: options.playSound,
			soundName: options.soundName || 'default',
			userInteraction: false,
			date: date
		});
	};

	cancelAllNotifications = () => {
		if (Platform.OS === 'ios') {
			PushNotificationIOS.removeAllDeliveredNotifications();
		} else {
			PushNotification.cancelAllLocalNotifications();
		}
	};

	unregister = () => {
		PushNotification.unregister();
	};
}

export const notificationManager = new NotificationManager();
