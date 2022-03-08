import messaging from '@react-native-firebase/messaging';

export default checkPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken();
  }
};

getFcmToken = async () => {
  const fcmToken = await messaging().getToken();

  if (fcmToken) {
    console.log(fcmToken, 'fcm token');

    console.log('Your Firebase Token is:', fcmToken);
  } else {
    console.log('Failed', 'No token received');
  }
};
