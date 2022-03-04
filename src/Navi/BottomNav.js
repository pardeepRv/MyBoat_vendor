import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import Home from "../Screens/Main/Home";
import React from "react";
import I18n from "../Translations/i18";
import { Colors, FontFamily } from "../Constants/Constants";
import { Icon } from "react-native-elements";
const Tab = createBottomTabNavigator();
import ManageAdd from "../Screens/Main/ManageAdd";
import Inbox from "../Screens/Main/Inbox";
import CalenderView from "../Screens/Main/Calender";
import Profile from "../Screens/Main/Profile";

import AllChats from "../Screens/Main/AllChats";

function TabNav() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: Colors.orange,
        inactiveTintColor: "#757575",
        labelStyle: {
          fontSize: 12,
          fontFamily: FontFamily.default,
        },
        tabStyle: {
          height: 50,
          alignItems: "center",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: I18n.translate("explore"),
          tabBarIcon: ({ focused, color }) =>
            // <Icon name="sait-boat" color={color} size={20} type="fontisto" />
            focused ? (
              <Image
                style={{ height: 30, width: 30, resizeMode: "contain" }}
                source={require("../../assets/icons/active_home.png")}
              />
            ) : (
              <Image
                style={{ height: 25, width: 30, resizeMode: "contain" }}
                source={require("../../assets/icons/home.png")}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Ad"
        component={ManageAdd}
        options={{
          tabBarLabel: I18n.translate("my_add"),
          tabBarIcon: ({ focused, color }) =>
            // <Icon name="sait-boat" color={color} size={20} type="fontisto" />
            focused ? (
              <Image
                style={{ height: 25, width: 30, resizeMode: "contain" }}
                source={require("../../assets/icons/active_boat.png")}
              />
            ) : (
              <Image
                style={{ height: 20, width: 30, resizeMode: "contain" }}
                source={require("../../assets/icons/boat.png")}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={AllChats}
        options={{
          tabBarLabel: I18n.translate("inbox"),
          tabBarIcon: ({ focused, color }) =>
            // <Icon name="sait-boat" color={color} size={20} type="fontisto" />
            focused ? (
              <Image
                style={{ height: 25, width: 30, resizeMode: "contain" }}
                source={require("../../assets/icons/active_inbox.png")}
              />
            ) : (
              <Image
                style={{ height: 20, width: 30, resizeMode: "contain" }}
                source={require("../../assets/icons/inbox.png")}
              />
            ),
          //   tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Calender"
        component={CalenderView}
        options={{
          tabBarLabel: I18n.translate("calender"),
          tabBarIcon: ({ focused, color }) =>
            // <Icon name="sait-boat" color={color} size={20} type="fontisto" />
            focused ? (
              <Image
                style={{ height: 25, width: 30, resizeMode: "contain" }}
                source={require("../../assets/icons/active_calender.png")}
              />
            ) : (
              <Image
                style={{ height: 20, width: 30, resizeMode: "contain" }}
                source={require("../../assets/icons/calender.png")}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: I18n.translate("profile"),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                style={{ height: 25, width: 30, resizeMode: "contain" }}
                source={require("../../assets/icons/active_profile.png")}
              />
            ) : (
              <Image
                style={{ height: 20, width: 30, resizeMode: "contain" }}
                source={require("../../assets/icons/profile.png")}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNav;
