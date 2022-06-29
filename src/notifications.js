import PushNotification from 'react-native-push-notification';
export function popPushNotification(title, message) {
  PushNotification.createChannel(
    {
      channelId: 'jenzi.fundi.com', // (required)
      channelName: 'Jenzi smart fundi', // (required)
      channelDescription: 'Default', // (optional) default: undefined.
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: 'jenzi.fundi.com', // (required) channelId, if the channel doesn't exist, notification will not trigger.
    title,
    message,
  });
}
