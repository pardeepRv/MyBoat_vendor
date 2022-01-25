import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import email from "react-native-email";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import RNRestart from "react-native-restart";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect, useDispatch } from "react-redux";
import config from "../../Constants/config";
import { back_img, Colors, FontFamily, Sizes } from "../../Constants/Constants";
import { toggleLanguage } from "../../Data_Service/actions";
import I18n from "../../Translations/i18";
const WelComeNote = () => {
  return (
    <View style={styles.WelComeNote}>
      <Text style={[styles.myboat, { textAlign: "left" }]}>
        {I18n.translate("myBoat")}
      </Text>
      <Text style={styles.Wlcome}>{I18n.translate("welcome")}</Text>
    </View>
  );
};

const handleEmail = () => {
  const to = ["Myboat667@gmail.com"]; // string or array of email addresses
  email(to, {
    // Optional additional arguments
    subject: "Admin Contact",
  }).catch(console.error);
};
const Login = (props) => {
  let passRef = null;
  const nav = useNavigation();
  const [email, setemail] = useState(""); // boat1@yopmail.com
  const [password, setpassword] = useState(""); // 123456
  const [isLogin, setIsLogin] = useState(false);
  const [language_id, setLanguageId] = useState(0);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  useEffect(async () => {
    let language_id = await AsyncStorage.getItem("language");
    if (language_id === null) {
      dispatch(props.toggleLanguage(0));
    } else {
      dispatch(props.toggleLanguage(Number(language_id)));
    }
  }, []);
  // ------------------------------------------ //
  let url = config.apiUrl + "/login.php";
  var data = new FormData();
  data.append("email", email);
  data.append("password", password);
  data.append("device_type", config.device_type);
  data.append("player_id", config.player_id);
  data.append("user_login_type", config.login_type);
  data.append("action_type", "normal_login");
  data.append("language_id", props.language_id);
  data.append("country_code", config.country_code);
  data.append("user_type", config.user_type_post);
  const logIn = async () => {
    setLoader(true);
    // nav.navigate("Home");
    axios
      .post(url, data)
      .then((res) => {
        setLoader(false);
        if (res.data.success == "true") {
          let user_arr = JSON.stringify(res.data);
          let userInfo = JSON.stringify({
            id: res.data.user_id,
            email: res.data.user_details.email,
            phone: res.data.user_details.mobile,
            fname: res.data.user_details.f_name,
            lname: res.data.user_details.l_name,
            image: res.data.user_details.image,
          });
          AsyncStorage.setItem("user_arr", user_arr);
          AsyncStorage.setItem("userInfo", userInfo);
          nav.replace("Home");
        } else {
          setLoader(false);
          if (props.language_id == 0) {
            alert(res.data.msg[0]);
          } else {
            alert(res.data.msg[1]);
          }
        }
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };
  const changeLanguage = (cb) => {
    if (props.language_id == 0) {
      AsyncStorage.setItem("language", "1");
      AsyncStorage.setItem("locale", "ar");
      I18nManager.forceRTL(true);
      dispatch(props.toggleLanguage(1));
      // I18n.locale = 'ar'
      // setLanguageId(1);
    } else {
      AsyncStorage.setItem("locale", "en");
      dispatch(props.toggleLanguage(0));
      I18nManager.forceRTL(false);
      //setLanguageId(0);
      // I18n.locale = 'en'
      AsyncStorage.setItem("language", "0");
    }
    if (cb) {
      cb();
    }
  };
  const restartApp = async () => {
    Alert.alert(
      "Restart app?",
      "You have changed the app language. You need to restart the app for it to be effective.",
      [
        {
          text: "Restart now",
          onPress: () => {
            RNRestart.Restart();
          },
        },
      ],
      { cancelable: false }
    );
  };
  // --------------------------------------- //

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={{ flex: 1 }}>
        <StatusBar
          translucent
          barStyle={"light-content"}
          backgroundColor={"transparent"}
        />
        <ImageBackground
          style={styles.ImageBackground}
          source={back_img}
          imageStyle={styles.ImageBackground_Img}
        >
          <KeyboardAwareScrollView>
            <View style={styles.SEC2}>
              {loader ? (
                <Modal
                  transparent={true}
                  //translucent={true}
                  visible={loader}
                  animationType={"slide"}
                  animationInTiming={500}
                  animationOutTiming={500}
                >
                  <View
                    style={{
                      height: 150,
                      width: 150,
                      alignSelf: "center",
                      backgroundColor: "white",
                      justifyContent: "center",
                      backgroundColor: "#000",
                      opacity: 0.8,
                      borderRadius: 10,
                    }}
                  >
                    <ActivityIndicator size={60} color={Colors.orange} />
                  </View>
                </Modal>
              ) : null}
              <TouchableOpacity
                onPress={() => {
                  changeLanguage(restartApp);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignSelf: "flex-end",
                  marginTop: 15,
                }}
              >
                <MaterialCommunityIcons
                  name="web"
                  style={{ fontSize: 15, color: Colors.white }}
                />
                <Text style={{ color: Colors.white, marginHorizontal: 5 }}>
                  {props.language_id == 0 ? "Eng" : "Ar"}
                </Text>
                <AntDesign
                  name="caretdown"
                  style={{ fontSize: 10, color: Colors.white }}
                />
              </TouchableOpacity>
              <Image
                style={{
                  resizeMode: "contain",
                  height: 120,
                  width: 120,
                  alignSelf: "center",
                  marginVertical: 50,
                }}
                source={require("../../Images/orange.png")}
              />
              <WelComeNote />
              <View style={{ marginVertical: 5, marginBottom: 20 }}>
                <Text style={styles.Login}>{I18n.translate("login")}</Text>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#fff",
                    marginVertical: 10,
                  }}
                >
                  <TextInput
                    placeholder={I18n.translate("username")}
                    value={email}
                    placeholderTextColor={"#fff"}
                    textAlign={props.language_id == 0 ? "left" : "right"}
                    fontSize={16}
                    opacity={email && email.length >= 1 ? 1 : 0.6}
                    //fontFamily={FontFamily.semi_bold}
                    //   style={{borderBottomWidth:1,borderColor:'#fff',marginVertical:10}}
                    color={"#fff"}
                    // inputStyle={{color: Colors.white,fontSiz}}
                    keyboardType="email-address"
                    onChangeText={(txt) => setemail(txt)}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderColor: "#fff",
                    justifyContent: "space-between",
                  }}
                >
                  <TextInput
                    placeholder={I18n.translate("password")}
                    value={password}
                    opacity={password && password.length >= 1 ? 1 : 0.6}
                    fontSize={16}
                    placeholderTextColor={"#fff"}
                    alignSelf="flex-start"
                    textAlign={props.language_id == 0 ? "left" : "right"}
                    // ref={(ref)=>{
                    //   passRef = ref
                    // }}
                    fontFamily={FontFamily.semi_bold}
                    // containerStyle={styles.Input}
                    // inputContainerStyle={styles.Input}
                    color={"#fff"}
                    style={{ width: "70%" }}
                    inputStyle={{ color: "#fff" }}
                    secureTextEntry
                    selectTextOnFocus
                    onChangeText={(pass) => setpassword(pass)}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      nav.navigate("forgot");
                    }}
                    style={{ marginRight: 200, marginTop: 15 }}
                  >
                    <Text style={styles.FGPASS}>
                      {I18n.translate("forgotPassword")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity style={styles.Btn1} onPress={() => logIn()}>
                    <Text style={styles.Btn1Text}>
                      {I18n.translate("login")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.Btn1}
                    onPress={() => nav.navigate("SignUp")}
                  >
                    <Text style={styles.Btn1Text}>
                      {I18n.translate("signUp")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleEmail()}
                    style={{ marginTop: 25 }}
                  >
                    <Text style={styles.contact_admin}>
                      {I18n.translate("contact_admin")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
});

const mapDispatchToProps = {
  toggleLanguage: toggleLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  ImageBackground: {
    height: "100%",
    width: Sizes.width,
    backgroundColor: Colors.black,
  },
  ImageBackground_Img: {
    opacity: 0.5,
    // height:Sizes.height+100
  },
  myboat: {
    fontFamily: FontFamily.default,
    color: Colors.white,
  },
  Wlcome: {
    fontFamily: FontFamily.bold,
    fontSize: 42,
    color: Colors.white,
  },
  SEC2: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 20,
  },
  Login: {
    fontFamily: FontFamily.semi_bold,
    fontSize: 28,
    color: Colors.white,
  },
  Input: {
    borderBottomColor: Colors.white,
    // width: Sizes.width * 0.70,
    color: Colors.white,
  },
  FGPASS: {
    fontFamily: FontFamily.semi_bold,
    color: Colors.white,
    fontSize: 12,
    lineHeight: 15,
  },
  Btn1: {
    height: 48,
    width: "95%",
    backgroundColor: Colors.orange,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    elevation: 3,
    overflow: "hidden",
    shadowColor: "#fff",
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  Btn1Text: {
    fontSize: 20,
    fontFamily: FontFamily.semi_bold,
    color: Colors.white,
  },
  contact_admin: {
    fontFamily: FontFamily.default,
    textDecorationStyle: "solid",
    color: Colors.white,
    textDecorationColor: Colors.white,
    textDecorationLine: "underline",
  },
  SEC3: {
    flexDirection: "row",
    // justifyContent:"space-aroun",
    alignItems: "center",
  },
  OR: {
    height: 30,
    width: 30,
    borderRadius: 30,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  Text1: {
    fontSize: 16,
    fontFamily: FontFamily.semi_bold,
    color: Colors.white,
  },
  LoginIcon: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: Colors.white,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
  },
});
