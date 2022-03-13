import PushNotification from 'react-native-push-notification';

export function popPushNotification(title, message) {
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: 'jenzi.fundi.com', // (required) channelId, if the channel doesn't exist, notification will not trigger.
    title,
    message,
  });
}
