import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import Change_Password from "../Screens/Auth/Change_Password";
import Login from "../Screens/Auth/LogIn";
import SignUp from "../Screens/Auth/SignUp";
import Chat from "../Screens/ChatModule/chat";
import about from "../Screens/Main/about";
import AddAd from "../Screens/Main/AddAd";
import AddAd1 from "../Screens/Main/AddAd1";
import AddBoat from "../Screens/Main/AddBoat";
import AddStaff from "../Screens/Main/AddStaff";
import Change_Language from "../Screens/Main/Change_Language";
import EditProfile from "../Screens/Main/EditProfile";
import ForgotPassword from "../Screens/Main/Forgot";
import History from "../Screens/Main/History";
import manageBoats from "../Screens/Main/manageBoats";
import ManageStaff from "../Screens/Main/ManageStaff";
import MyWallet from "../Screens/Main/MyWallet";
import MyWithdraw from "../Screens/Main/MyWithdraw";
import NotificationsPage from "../Screens/Main/Notifications";
import Noti_Setting from "../Screens/Main/Notification_Settings";
import Notifications_Details from "../Screens/Main/Noti_Details";
import privacyPolicy from "../Screens/Main/privacyPolicy";
import Ratings from "../Screens/Main/Ratings";
import DetailsRatings from "../Screens/Main/Ratings_des";
import SelectedDate from "../Screens/Main/SelectedDate";
import Settings from "../Screens/Main/Settings";
import Splash from "../Screens/Main/Splash";
import Terms_Conditions from "../Screens/Main/Terms_Conditions";
import viewAdd from "../Screens/Main/viewAdd";
import viewBoat from "../Screens/Main/viewBoat";
import viewBooking from "../Screens/Main/viewBooking";
import ViewStaff from "../Screens/Main/ViewStaff";
import MapView from "../Screens/MapView";
import TabNav from "./BottomNav";
// import MyTabs from './BottomNav';

const Stack = createStackNavigator();

const Stacks = () => {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    console.log("parsedInfo", parsedInfo);
    if (parsedInfo === null) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, []);

  return (
    <Stack.Navigator initialRouteName={"Splash"} headerMode="none">
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Home" component={TabNav} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="AddBoat" component={AddBoat} />
      <Stack.Screen name="MyWallet" component={MyWallet} />
      <Stack.Screen name="MyWithdraw" component={MyWithdraw} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Ratings" component={Ratings} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="DetailsRating" component={DetailsRatings} />
      <Stack.Screen name="Noti_Setting" component={Noti_Setting} />
      <Stack.Screen name="Change_Language" component={Change_Language} />
      <Stack.Screen name="Change_Password" component={Change_Password} />
      <Stack.Screen name="Notifications" component={NotificationsPage} />
      <Stack.Screen
        name="Notifications_Details"
        component={Notifications_Details}
      />
      <Stack.Screen name="Terms_Conditions" component={Terms_Conditions} />
      <Stack.Screen name="Edit_Profile" component={EditProfile} />
      <Stack.Screen name="SelectedDate" component={SelectedDate} />
      <Stack.Screen name="manageBoats" component={manageBoats} />
      <Stack.Screen name="manageStaff" component={ManageStaff} />
      <Stack.Screen name="AddStaff" component={AddStaff} />
      <Stack.Screen name="ViewStaff" component={ViewStaff} />
      <Stack.Screen name="AddAd" component={AddAd} />
      <Stack.Screen name="AddAd1" component={AddAd1} />
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="viewAdd" component={viewAdd} />
      <Stack.Screen name="viewBoat" component={viewBoat} />
      <Stack.Screen name="viewBooking" component={viewBooking} />
      <Stack.Screen name="MapView" component={MapView} />
      <Stack.Screen name="about" component={about} />
      <Stack.Screen name="privacyPolicy" component={privacyPolicy} />
      <Stack.Screen name="forgot" component={ForgotPassword} />
    </Stack.Navigator>
  );
};

export default Stacks;
