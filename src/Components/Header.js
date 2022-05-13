import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Icon } from "react-native-elements";
import { back_img, Colors, FontFamily } from "../Constants/Constants";
import { useNavigation } from "@react-navigation/core";
import { connect } from "react-redux";
import * as NavigationService from "../../NavigationService";

const Header = ({
  backBtn,
  notiBtn,
  searchBtn,
  name,
  imgBack,
  backColor,
  headerHeight,
  backImgSource,
  chatModule,
  isarbic,
}) => {
  console.log(isarbic);
  const navigation = useNavigation();
  const [state, setState] = useState({
    backBtn: false || backBtn,
    notiBtn: false || notiBtn,
    searchBtn: false || searchBtn,
    imgBack: false || imgBack,
    name: " " || name,
    backColor: Colors.orange || backColor,
    headerHeight: headerHeight || 200,
    back_img_source: back_img || backImgSource,
    isarbic: 0,
  });
  const gotoBack = () => {
    navigation.goBack();
  };
  const gotoNotification = () => {
    navigation.navigate("Notifications");
  };
  return state.imgBack ? (
    <ImageBackground
      style={[s.ImageBackground, { height: state.headerHeight }]}
      source={state.back_img_source}
      imageStyle={s.ImageBackground_Img}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "90%",
          alignSelf: "center",
          alignItems: "center",
        }}
      >
        {state.backBtn ? (
          <TouchableOpacity
            onPress={() => gotoBack()}
            style={isarbic == 1 ? s.backbutton : { marginTop: 35 }}
          >
            <Icon
              name="arrow-back"
              type="ionicons"
              size={24}
              color={Colors.white}
            />
          </TouchableOpacity>
        ) : state.notiBtn ? (
          <TouchableOpacity
            onPress={() => gotoNotification()}
            style={{ marginTop: 35 }}
          >
            <Icon
              name="bell"
              type="simple-line-icon"
              size={24}
              color={Colors.white}
            />
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 12 / 2,
                backgroundColor: Colors.orange,
                position: "absolute",
                bottom: 20,
              }}
            ></View>
          </TouchableOpacity>
        ) : (
          <View style={{ height: 25, width: 25 }} />
        )}
        <Text
          style={{
            fontFamily: FontFamily.semi_bold,
            color: Colors.white,
            textAlign: "center",
            marginTop: 40,
          }}
        >
          {name}
        </Text>
        {state.searchBtn == false ? (
          <TouchableOpacity style={{ marginTop: 35 }}>
            <Icon
              name="search1"
              type="antdesign"
              size={25}
              color={Colors.white}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ height: 25, width: 25 }} />
        )}
      </View>
    </ImageBackground>
  ) : (
    <View
      style={[
        s.ImageBackground,
        { backgroundColor: state.backColor, height: state.headerHeight },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "90%",
          alignSelf: "center",
          backgroundColor: "transparent",
          alignItems: "center",
        }}
      >
        {state.backBtn ? (
          <TouchableOpacity
            onPress={() => gotoBack()}
            style={isarbic == 1 ? s.backbutton : { marginTop: 35 }}
          >
            <Icon
              name="arrow-back"
              type="ionicons"
              size={24}
              color={Colors.white}
            />
          </TouchableOpacity>
        ) : state.notiBtn ? (
          <TouchableOpacity
            onPress={() => gotoNotification()}
            style={{ marginTop: 35 }}
          >
            <Icon
              name="bell"
              type="simple-line-icon"
              size={24}
              color={Colors.white}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ height: 25, width: 25 }} />
        )}
        <Text
          style={{
            fontFamily: FontFamily.semi_bold,
            color: Colors.white,
            textAlign: "center",
            marginTop: 30,
          }}
        >
          {name}
        </Text>
        {state.searchBtn ? (
          <TouchableOpacity>
            <Icon
              name="search1"
              type="antdesign"
              size={25}
              color={Colors.white}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ height: 25, width: 25 }} />
        )}
      </View>
    </View>
  );
};
export const s = StyleSheet.create({
  ImageBackground: {
    backgroundColor: Colors.black,
  },
  ImageBackground_Img: {
    resizeMode: "cover",
    opacity: 0.5,
  },
  backbutton: {
    transform: [{ rotate: "-180deg" }],
    marginTop: 45,
  },
});
const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
});
export default connect(mapStateToProps)(Header);
// export default Header;
