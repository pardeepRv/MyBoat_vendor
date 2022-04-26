import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  I18nManager,
  TextInput,
} from "react-native";
import I18n from "../../Translations/i18";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon, Input, Card } from "react-native-elements";
import { Colors, FontFamily, Sizes } from "../../Constants/Constants";
import { useNavigation } from "@react-navigation/core";
import Header from "../../Components/Header";
import config from "../../Constants/config";
import WebView from "react-native-webview";
import { connect } from "react-redux";

const aboutUs = [
  "Myboat: The Kuwait App for boat booking",
  "MyBoat is an app for tour, fishing, diving and anniversary trips.",
  "Want boat trip! Yes we delivered easy direct way for boat booking. customer or boat owner we are happy to present our apps to suit your desire from fishing to island tour to special anniversary that will saved ever in your mind, for boat owners will give the easiest professional app to upload and organize your trips and of course keep you very near to your customer with great communication features.",
];
const about = (props) => {
  console.log('props', props)
  const [content, setContent] = useState([]);

  useEffect(async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");

    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl +
      "/get_all_content.php?user_id=" +
      parsedInfo.id +
      "&user_type=2";
    axios
      .get(url)
      .then((res) => {
        console.log(res, "res getting permission");
        console.log(res.data.content_arr[0].content[0],'');
        if (res?.data?.success == "true") {
          {props.language_id == 1 ? setContent(res.data.content_arr[0].content[1]) : setContent(res.data.content_arr[0].content[0])}
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log("content", content);
  }, []);

  function webViewTextSize(data) {
    return `
       <!DOCTYPE html>
       <html>
       <head>
         <style type="text/css">
           body {
             font-family: Helvetica;
             font-size: 3rem;
             color: black;
             padding: 20px 20px 20px 20px;
           } 
           p {
             text-align: center;
           }
         </style>
       </head>
       <meta name="viewport" content="initial-scale=0.1, maximum-scale=0.1">
       <body>
         ${data}
       </body>
       </html>
       `;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header backBtn={true} imgBack={true} name={I18n.translate("about")} isarbic={props.language_id == 1 ? 1 : 0} />
      <View style={subrata.SEC2}>
      
          <WebView
            startInLoadingState={true}
            originWhitelist={["*"]}
            source={{ html: webViewTextSize(content) }}
            javaScriptEnabled={true}
            // source={{ html: '<h1>Hellogdfgdfgfdgdgdgdgggdggdgdfggdgdggdfgdfgdfgdfgdgdg </h1>' }}
            style={{
              marginTop: 15,
              textAlign: "center",
            }}
            height={750}
          />
      </View>
    </View>
  );
};

const subrata = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    marginTop: -40,
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
  permissions: state.data_Reducer.permissions,
});

export default connect(mapStateToProps)(about);
