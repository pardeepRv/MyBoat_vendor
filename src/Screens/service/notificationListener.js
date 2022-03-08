import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';

export const createNotificationListener = async () => {
  const {navigation} = useNavigation;
  console.log('coming in noification');

  // messaging().onNotificationOpenedApp(async (remoteMessage) => {
  //     console.log('Notification caused app to open from background state bla bla:', remoteMessage);
  //     alert(remoteMessage)
  //     // navigation.navigate('Haulage')
  // });

  messaging().onNotificationOpenedApp(async remoteMessage => {
    // setTimeout(() => {
    //   console.log(
    //     NavigationService,
    //     'hte +++++++++++++++++++++++++++++++++++++++++++',
    //   );
    //   remoteMessage.data?.type == '1'
    //     ? NavigationService.navigate('FriendRequests')
    //     : remoteMessage.data?.type == '2'
    //     ? NavigationService.navigate('Like')
    //     : NavigationService.navigate('Home');
    // }, 3000);
  });

  messaging().onMessage(async remoteMessage => {
    console.log('recived in foreground', remoteMessage);
    alert(remoteMessage?.notification?.body)
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('remote message', remoteMessage);
      }
    });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
};

// messaging().onTokenRefresh(fcmToken => {
//     console.log("New token refresh: ", fcmToken)

// })
