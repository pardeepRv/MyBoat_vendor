//import liraries
import React from "react";
import { StyleSheet } from "react-native";
import { Bubble } from "react-native-gifted-chat";
import { Colors, FontFamily } from "../../Constants/Constants";

// create a component
const ChatBubble = (props) => {
  return (
    <Bubble
      {...props}
      textStyle={{
        right: {
          color: Colors.white,
          fontSize: 12,
          fontFamily: FontFamily.default,
        },
        left: {
          fontFamily: FontFamily.default,
          fontSize: 12,
          color: Colors.white,
        },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: "lightgrey",
          marginBottom: 5,
        },
        right: {
          backgroundColor: Colors.orange,
          marginBottom: 5,
        },
      }}
      timeTextStyle={{
        left: {
          fontFamily: FontFamily.default,
          fontSize: 10,
          color: Colors.white,
        },
        right: {
          color: Colors.white,
          fontFamily: FontFamily.regular,
          fontSize: 10,
        },
      }}
    />
  );
};

// define your styles
const styles = StyleSheet.create({});

//make this component available to the app
export default ChatBubble;
