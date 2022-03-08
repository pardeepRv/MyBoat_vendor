import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import I18n from "./src/Translations/i18";
import store from "./rootReducer";
import { Provider } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Root } from "native-base";
import Stacks from "./src/Navi/Stack";
import { firebaseprovider } from "./src/Screens/Provider/FirebaseProvider";
import { SafeAreaView, StatusBar } from "react-native";
import { Colors } from "./src/Constants/Constants";
import { requestUserPermission } from "./src/Screens/service/FcmService";
import { createNotificationListener } from "./src/Screens/service/notificationListener";
import checkPermission from "./src/Screens/service/notificationServices";

class App extends React.Component {
  async componentDidMount() {
    
    checkPermission();
    requestUserPermission();
    createNotificationListener();

    console.disableYellowBox = true; // hide warings from simulator
    let appLang = await AsyncStorage.getItem("locale");

    if (appLang === null) {
      AsyncStorage.setItem("locale", "en");
      AsyncStorage.setItem("language", "0");
    } else if (appLang === "ar") {
      AsyncStorage.setItem("language", "1");
      AsyncStorage.setItem("locale", "ar");
    } else {
      AsyncStorage.setItem("language", "0");
      AsyncStorage.setItem("locale", "en");
    }
    I18n.locale = appLang;
    firebaseprovider.getMyInboxAllData();
    firebaseprovider.getAllUsers();
  }
  render() {
    // console.disableYellowBox = true;
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Root>
            <SafeAreaView
              style={{
                backgroundColor: Colors.black,
              }}
            />
            {/* <StatusBar hidden /> */}

            <StatusBar backgroundColor={"transparent"} translucent />

            <Stacks />
            {/* <TabNav /> */}
          </Root>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
