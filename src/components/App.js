import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
// Services
import { notificationManager } from '../services/NotificationManager';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			scheduledNotifications: [
				{
					title: 'Title 1',
					message: 'Notification 1',
					time: new Date(Date.now() + 60 * 1000)
				},
				{
					title: 'Title 2',
					message: 'Notification 2',
					time: new Date(Date.now() + 70 * 1000)
				}
			]
		};
		this.localNotify = null;
		this.onPressSendNotification = this.onPressSendNotification.bind(this);
		this.onPressCancelNotification = this.onPressCancelNotification.bind(this);
		this.setNotifications = this.setNotifications.bind(this);
	}

	componentDidMount() {
		this.localNotify = notificationManager;
		this.localNotify.configure(this.onRegister, this.onNotification, this.onOpenNotification);
		this.setNotifications();
	}

	onRegister(token) {
		console.log('[Notification] Registered', token);
	}

	onNotification(notification) {
		console.log('[Notification] onNotification', notification);
	}

	onOpenNotification(notification) {
		console.log('[Notification] onOpenNotification', notification);
		alert('Open notification');
	}

	setNotifications() {
		const options = {
			soundName: 'default',
			playSound: true,
			vibrate: true
		};

		this.state.scheduledNotifications.map((notification) => {
			this.localNotify.scheduleNotification(
				1,
				notification.title,
				notification.message,
				notification.time,
				{}, // data
				options // options
			);
		});
	}

	onPressSendNotification() {
		const options = {
			soundName: 'default',
			playSound: true,
			vibrate: true
		};
		this.localNotify.showNotification(
			1,
			'App Notification',
			'Local notification',
			{}, // data
			options // options
		);
	}

	onPressCancelNotification() {
		this.localNotify.cancelAllNotifications();
	}
	render() {
		return (
			<View style={styles.button}>
				<TouchableOpacity onPress={this.onPressSendNotification} style={styles.button}>
					<Text>Show Notification</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={this.onPressCancelNotification} style={styles.button}>
					<Text>Cancel all Notification</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	button: {
		alignItems: 'center',
		backgroundColor: '#DDDDDD',
		padding: 10,
		width: 200,
		marginTop: 10
	}
});

export default App;
