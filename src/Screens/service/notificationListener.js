import messaging from "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";
import { Platform } from "react-native";
import { showMessage } from "react-native-flash-message";
import { FontFamily } from "../../Constants/Constants";
import * as NavigationService from "../../../NavigationService";

export const createNotificationListener = async () => {
  const { navigation } = useNavigation;
  console.log("coming in noification", navigation);

  // messaging().onNotificationOpenedApp(async (remoteMessage) => {
  //     console.log('Notification caused app to open from background state bla bla:', remoteMessage);
  //     alert(remoteMessage)
  //     // navigation.navigate('Haulage')
  // });

  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log("coming in noification", navigation);
    // alert(JSON.stringify(remoteMessage))
    console.log(remoteMessage, "remoteMessage");
    setTimeout(() => {
      if (remoteMessage.data?.type == "chat_message") {
        NavigationService.navigate("AllChats", { notificationParam: 1 });
      }
      if (remoteMessage.notification?.body == "A new booking request") {
        NavigationService.navigate("Notifications" );
      }
      // else {
      //   NavigationService.navigate("Home");
      // }
    }, 1500);
  });

  messaging().onMessage(async (remoteMessage) => {
    console.log("recived in foreground", remoteMessage);
    // alert(remoteMessage?.notification?.body);
    showMessage({
      message: "info",
      description: remoteMessage?.notification?.body,
      type: "info",
      floating: true,
      duration: 4000,
      style: { marginTop: Platform.OS == "ios" ? 0 : 20 },
      textStyle: { fontFamily: FontFamily.default },
      titleStyle: { fontFamily: FontFamily.default },
    });
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log("remote message", remoteMessage);
      }
    });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
  });
};

// messaging().onTokenRefresh(fcmToken => {
//     console.log("New token refresh: ", fcmToken)

// })
