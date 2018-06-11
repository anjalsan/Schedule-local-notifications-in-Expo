import React from 'react';
import { StyleSheet, Text, View, Platform, Alert } from 'react-native';
import { Constants, Notifications, Permissions } from 'expo';

export default class App extends React.Component {

  async componentWillMount() {
    let result = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (result.status === 'granted') {
     console.log('Notification permissions granted.');
     this.setNotifications();
    } else {
        console.log('No Permission', Constants.lisDevice);
    }

    this.listenForNotifications();
  }

  getNotification(date) {
    const localNotification = {
        title: `Notification at ${date.toLocaleTimeString()}`,
        body: 'Next Notification is after 15 minutes', // (string) — body text of the notification.
        ios: { // (optional) (object) — notification configuration specific to iOS.
          sound: true // (optional) (boolean) — if true, play a sound. Default: false.
        },
        android: // (optional) (object) — notification configuration specific to Android.
        {
          sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
          priority: 'high', // (optional) (min | low | high | max) — android may present notifications according to the priority, for example a high priority notification will likely to be shown as a heads-up notification.
          sticky: false, // (optional) (boolean) — if true, the notification will be sticky and not dismissable by user. The notification must be programmatically dismissed. Default: false.
          vibrate: true // (optional) (boolean or array) — if true, vibrate the device. An array can be supplied to specify the vibration pattern, e.g. - [ 0, 500 ].
        }
    };
    return localNotification;
  }

  setNotifications() {
    Notifications.cancelAllScheduledNotificationsAsync();

    for (let i = 0; i< 64; i++) { //Maximum schedule notification is 64 on ios.
        let t = new Date();
        if (i === 0){
            t.setSeconds(t.getSeconds() + 1);
        } else {
            t.setMinutes(t.getMinutes() + 1 + (i * 15)); // 15 Minutes
        }
        const schedulingOptions = {
            time: t, // (date or number) — A Date object representing when to fire the notification or a number in Unix epoch time. Example: (new Date()).getTime() + 1000 is one second from now.
        };
        Notifications.scheduleLocalNotificationAsync(this.getNotification(t), schedulingOptions);
    }
  }

  listenForNotifications = () => {
    Notifications.addListener(notification => {
      console.log('received notification', notification);
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text 
         style={{textAlign: 'center', padding: 30}}>
            App for experimenting Local Notifications. You will get Notifications in every 15 Minutes!
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
