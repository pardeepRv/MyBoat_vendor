import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "react-native-datepicker";
import { connect, useDispatch } from "react-redux";
import { colors, Input, Overlay } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import OtpInputs from "react-native-otp-inputs";
import AntDesign from "react-native-vector-icons/dist/AntDesign";
import Feather from "react-native-vector-icons/dist/Feather";
import config from "../../Constants/config";
import { back_img, Colors, FontFamily, Sizes } from "../../Constants/Constants";
import { addPermissions } from "../../Data_Service/actions";
import { firebaseprovider } from "../Provider/FirebaseProvider";

/*
email, 
login_type (0 for App, 1 for Facebook, 2 for Google, 3 for twitter, 4 for Instagram, 5 for apple), 
user_type_post (0=admin, 1=user, 2=Client), 
device_type (browser, Android, IOS), 
f_name , 
l_name, 
user_name, 
business_name , 
dob, 
city ( check city_master table for codes for each city), 
language_id (0=English, 1=Arabic), 
country_code (for mobile number), 
phone_number, 
password, 
gender (0 for none, 1 for male, 2 for female), 
player_id
*/

const SignUp = (props) => {
  console.log(props,'props in signup');
  const Navigation = useNavigation();
  const dispatch = useDispatch();

  const [cityArr, serCityArr] = useState([]);
  const [cityArrCopy, setCityArrCopy] = useState([]);
  const [isChecked, setChecked] = useState(false);
  const [isconfirm, setconfirm] = useState(false);
  const [notconfirm, setNotconfirm] = useState(false);

  const [loader, setloader] = useState(false);
  const [Boatfacality, setBoatfacality] = useState([
    { value: 1, isSelected: true },
    { value: 2, isSelected: false },
  ]);
  console.log("boatfacality :>> ", Boatfacality);
  // -------------------------------------------- //
  const [f_name, setF_name] = useState("");
  const [L_name, setL_name] = useState("");
  const [email, setemail] = useState("");
  const [m_number, setm_number] = useState("");
  const [b_name, setb_name] = useState("");
  //   const [b_location, setb_location] = useState('');
  const [dob, setdob] = useState("");
  const [city, setcity] = useState(0);
  const [cityName, setCityName] = useState("Select City");

  const [gender, setgender] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPass, setconfirmPass] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");
  //
  const [userId, setUserId] = useState(null);
  //
  const [visible, setVisible] = useState(false);
  const [visibleCity, setVisibleCity] = useState(false);
  const [otp, setOtp] = useState("");
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  // ----------- //
  const [AllData, setAllData] = useState(null);
  const [AllDataRe, setAllDataRe] = useState(null);
  //
  var raw = {
    f_name: f_name,
    l_name: L_name,
    business_name: b_name,
    country_code: config.country_code,
    language_id: config.language_id,
    login_type: config.login_type,
    device_type: config.device_type,
    dob: dob,
    city: city,
    phone_number: m_number,
    password: password,
    gender: gender === "" ? 0 : gender === "male" ? 1 : 2,
    player_id: config.player_id,
    user_type_post: config.user_type_post,
  };

  // console.log(signup_data);

  // -----------------------Api Urls--------------------- //
  var url_main = "https://myboatonline.com/app/webservice";
  var url = config.apiUrl;
  console.log(url);
  const apiUrl_signup = url + "/signup.php";
  const cityUrl = url + "/city_list.php?country_code=965";
  const mailSendUrl = url + "/mailFunctionsSend.php";
  const resendOtpUrl = url + "/resend_otp.php";
  const verifyOtpUrl = url + "/otp_verify.php";
  // ----------All Citys ----------- //
  const all_city_call = () => {
    axios
      .get(cityUrl)
      .then((res) => {
        sortCity(res.data.city_arr);
        serCityArr(res.data.city_arr);
        setCityArrCopy(res.data.city_arr);
      })
      .catch((err) => console.log(err));
  };

  // --------------Sign Up ----------- //
  let selectedFacilty = null;

  let updateArr = Boatfacality;
  if (updateArr && updateArr.length > 0) {
    updateArr.forEach((element) => {
      if (element.isSelected) {
        selectedFacilty = element.value;
      }
    });
  }

  var signup_data = new FormData();

  signup_data.append("f_name", f_name);
  signup_data.append("Boatfacality", selectedFacilty);
  signup_data.append("l_name", L_name);
  signup_data.append("email", email);
  signup_data.append("business_name", b_name);
  signup_data.append("country_code", config.country_code);
  signup_data.append("language_id", config.language_id);
  signup_data.append("login_type", config.login_type);
  signup_data.append("device_type", config.device_type);
  signup_data.append("dob", dob);
  signup_data.append("city", city);
  signup_data.append("phone_number", m_number);
  signup_data.append("password", password);
  signup_data.append("gender", gender === "" ? 0 : gender === "male" ? 1 : 2);
  signup_data.append("player_id", config.player_id);
  signup_data.append("user_type_post", config.user_type_post);
  // ------------------------------------//

  const sortCity = (arr) => {
    arr.sort(function (a, b) {
      if (a.city[0] < b.city[0]) {
        return -1;
      }
      if (a.city[0] > b.city[0]) {
        return 1;
      }
      return 0;
    });
    //console.log("ARR",arr)
    serCityArr(arr);
  };

  const signUp = () => {
    if (!password.length || !confirmPass.length) {
      return alert("Please provide password");
    }

    if (password !== confirmPass) {
      return alert("Password not matched .");
    }
    if (!isconfirm && Boatfacality[1].isSelected) {
      return alert("You need to enter right email-id");
    } else {
      console.log("signup_data :>> ", signup_data);
      axios
        .post(apiUrl_signup, signup_data)
        .then((res) => {
          console.log("res :>> ", res);
          setAllData(res.data),
            res.data.success === "true"
              ? toggleOverlay()
              : alert(res.data.msg);
        })
        .catch((err) => console.log("sign_up_error", err));
      // return  console.log('res :>> ', res);
    }
  };
  // ----------- Mail sent ---------- //
  var email_array = AllData === null ? null : AllData.email_arr;
  var user_details = AllData === null ? null : AllData.user_details;
  // console.log("email_array===>",email_array.length)
  useEffect(() => {
    if (AllData !== null) {
      if (AllData.success === "true") {
        setUserId(user_details.user_id);
        mailSend({ email_array: email_array });
      }
    }
  }, [AllData]);

  useEffect(() => {
    if (AllDataRe !== null) {
      if (AllDataRe.success === "true") {
        mailSend({ email_array: AllDataRe.email_arr });
      }
    }
  }, [AllDataRe]);

  console.log(userId);
  const mailSend = ({ email_array }) => {
    var email = email_array[0].email;
    var mailcontent = email_array[0].mailcontent;
    var mailsubject = email_array[0].mailsubject;
    var fromName = email_array[0].fromName;
    var mailData = new FormData();
    mailData.append("email", email);
    mailData.append("mailcontent", mailcontent);
    mailData.append("mailsubject", mailsubject);
    mailData.append("fromName", fromName);
    mailData.append("mail_file", "NA");
    // console.log('mailData==', mailData);
    axios
      .post(mailSendUrl, mailData)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };
  // ---------- Resend Otp ------ //
  const resendOtp = ({ user_id }) => {
    var resend_otp_data = new FormData();
    resend_otp_data.append("user_id_post", user_id);
    axios
      .post(resendOtpUrl, resend_otp_data)
      .then((res) => {
        setAllDataRe(res.data),
          setOtp(AllDataRe ? res.data.user_details.otp : null);
      })
      .catch((err) => console.log(err));
  };
  // ------------------------------Verify Otp----- //
  console.log("OTP", AllDataRe ? AllDataRe.user_details.otp : null);
  console.log("OTP", user_details ? user_details.otp : null);
  /**
   * New Parameters = user_id_post, user_otp, user_type (0=admin, 1=user, 2=Client), device_type (browser, Android, IOS), player_id
   */
  const verifyOtp = ({ user_id, user_otp }) => {
    let dataObj = {};
    let data_arr = {};
    let user_arr;
    console.log(parseInt(user_otp));
    var verify_otp_data = new FormData();
    verify_otp_data.append("user_id_post", user_id);
    verify_otp_data.append("user_type", config.user_type_post);
    verify_otp_data.append("device_type", config.device_type);
    verify_otp_data.append("player_id", config.player_id);
    verify_otp_data.append("user_otp", parseInt(user_otp));
    axios
      .post(verifyOtpUrl, verify_otp_data)
      .then((res) => {
        console.log(res);
        if (res.data.success === "true") {

          dataObj.associated_with_company = res.data.extra_details[0].associated_with_company;
          dataObj.boat_id = res.data.extra_details[0].boat_id;
          dataObj.registered = res.data.extra_details[0].registered;
          dataObj.role_id = res.data.extra_details[0].role_id;

          data_arr = JSON.stringify(dataObj);
          user_arr = JSON.stringify(res.data.user_details);
          console.log(data_arr, 'saving to local 1');
          console.log(user_arr, 'saving to local 2');

          let userInfo = JSON.stringify({
            id: res.data.user_details.user_id,
            email: res.data.user_details.email,
            phone: res.data.user_details.mobile,
            fname: res.data.user_details.f_name,
            lname: res.data.user_details.l_name,
            image: res.data.user_details.image,
          });
          let jsonUserDataMe = {
            name: res.data.user_details.name,
            email: res.data.user_details.email,
            image: res.data.user_details.image,
            onlineStatus: "true",
            player_id: null,
            user_id: res.data.user_details.user_id,
            user_type: res.data.user_details.user_type,
            notification_status: res.data.user_details.notification_status,
            chat_room_id: "no",
            login_type: res.data.user_details.login_type,
          };
          AsyncStorage.setItem("user_arr", user_arr);
          AsyncStorage.setItem("data_arr", data_arr);
          AsyncStorage.setItem("userInfo", userInfo);
          firebaseprovider.CreateUser(
            "u_" + res.data.user_details.user_id,
            jsonUserDataMe
          );
        } else {
          null;
        }
        console.log(user_arr, 'saving to local storage>>>>>>>>>>');
        if (res.data.extra_details[0].role_id === 2) {
          res.data.success === "true"
            ? (ToastAndroid.show(
              res.data.msg[0],
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            ),
              setVisible(false),
              gotoAddstaff())
            : ToastAndroid.show(
              res.data.msg[0],
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
        } else {
          res.data.success === "true"
            ? (ToastAndroid.show(
              res.data.msg[0],
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            ),
              setVisible(false),
              gotoAddBoatPage())
            : ToastAndroid.show(
              res.data.msg[0],
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
        }
      })
      .catch((err) => console.log(err));
  };
  //-----------//
  useEffect(() => {
    all_city_call();
  }, []);
  // --------Navigation --------- //
  const gotoAddBoatPage = () => {
    setloader(true);
    setTimeout(() => {
      setloader(false);
      Navigation.navigate("AddBoat");
    }, 3000);
  };
  // const gotoAddstaff = (data) => {
  //   setloader(true);
  //   setTimeout(() => {
  //     setloader(false);
  //     Navigation.navigate("Home");
  //   }, 3000);
  // };
  const gotoAddstaff = async () => {
    setloader(true);
    let userInfo = await AsyncStorage.getItem('user_arr');
    console.log('userInfo :>> ', userInfo);
    let parsedInfo = JSON.parse(userInfo);
    console.log('parsedInfo', parsedInfo.user_id);

    let dataArr = await AsyncStorage.getItem('data_arr');
    console.log('dataArr :>> ', dataArr);
    let parsedInfoData = JSON.parse(dataArr);

    let url =
      config.apiUrl +
      '/view_staff_member.php';
    let data = new FormData();
    data.append('staff_id', parsedInfo.user_id);
    data.append('boat_owner_id', parsedInfoData.boat_id);
    axios
      .post(url, data)
      .then(res => {
        console.log('view_staff_member >>>>>>>>>>>1', res);
        setloader(false);
        if (res && res.data && res.data.data) {
          dispatch(props.addPermissions(res.data.data[0]));
          Navigation.navigate('Home');
        } else {
          setloader(false);
          alert('Something went wrong!');
          console.log(res.data.msg);
        }
      })
      .catch(err => console.log(err));
  };


  const searchCity = (e) => {
    let text = e.toLowerCase();
    let cityArrCopy = cityArr;
    let filteredName = cityArrCopy.filter((item) => {
      return item.city[0].toLowerCase().match(text);
    });
    if (!text || !text.length || text === "") {
      setCityArrCopy(cityArr);
    } else if (!filteredName.length) {
      setCityArrCopy(cityArr);
    } else if (Array.isArray(filteredName)) {
      setCityArrCopy(filteredName);
    }
  };
  ////////////////////////////////////Boatfacality renderview

  const toggleCml = (index) => {
    const array = Boatfacality.map((v) => {
      const newItem = Object.assign({}, v);
      console.log(newItem, "..........");
      newItem.isSelected = false;
      return newItem;
    });
    array[index].isSelected = !array[index].isSelected;
    setBoatfacality(array);
    console.log(array);
  };
  // ////////////////////////////////////////////  api of email for staff

  const onBlurInput = async () => {
    // setLoader(true);

    if (!email.length) {
      return alert("enter something");
    }
    let url = config.apiUrl + "/check_valid_staff_member.php";
    var formData = new FormData();
    formData.append("staff_email_id", email);

    console.log(formData);

    axios
      .post(url, formData)
      .then((res) => {
        console.log("boat_edit", res);
        // setLoader(false);
        if (res.data.success === "true") {
          setconfirm(true);
          setNotconfirm(false);
        } else {
          // alert(res.data.msg);
          setconfirm(false);
          setNotconfirm(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const _renderView = ({ item, index }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: 200,
      }}
      onPress={() => toggleCml(index)}
      activeOpacity={0.8}
    >
      {item.isSelected ? (
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <AntDesign
            name={"checksquare"}
            size={25}
            color={"#fff"}
            style={{ marginHorizontal: 5 }}
          />
        </View>
      ) : (
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Feather
            name={"square"}
            size={25}
            color={"#fff"}
            style={{ marginHorizontal: 5 }}
          />
        </View>
      )}

      {/* <Text style={styles.textStyle}>{item.value}</Text> */}
    </TouchableOpacity>
  );
  console.log("city", cityArr);
  return (
    <View style={{ flex: 1, paddingTop: StatusBar.currentHeight + 10 }}>
      <StatusBar
        barStyle={"light-content"}
        translucent
        backgroundColor={"transparent"}
      />
      <ImageBackground
        style={s.ImageBackground}
        source={back_img}
        imageStyle={s.ImageBackground_Img}
      />
      <Modal
        visible={visibleCity}
        animationType={"slide"}
        animationInTiming={500}
        animationOutTiming={500}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign
              name={"arrowleft"}
              onPress={() => {
                setVisibleCity(!visibleCity);
              }}
              size={25}
              style={{ padding: 5, marginHorizontal: 10 }}
            />

            <TextInput
              placeholder={"search city"}
              value={placeholderText}
              onChangeText={(text) => {
                setPlaceholderText(text);
                searchCity(text);
              }}
              style={{
                borderWidth: 1,
                borderColor: Colors.orange,
                width: "85%",
                borderRadius: 10,
                marginVertical: 10,
              }}
            />
          </View>
          <FlatList
            data={cityArrCopy}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setcity(item.city_id);
                    setCityName(item.city[0]);
                    setVisibleCity(!visibleCity);
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 18,
                      marginVertical: 3,
                      marginHorizontal: 20,
                    }}
                  >
                    {item.city[0]}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>

      {loader ? (
        <ActivityIndicator
          animating={loader}
          color={Colors.white}
          size={50}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: 70,
          }}
        />
      ) : (
        <KeyboardAwareScrollView>
          <Image source={require("../../Images/orange.png")} style={s.Logo} />
          {Boatfacality[0].value == 1 && Boatfacality[0].isSelected ? (
            <Text style={s.Text1}>Boat Owner</Text>
          ) : (
            <Text style={s.Text1}>Boat Staff</Text>
          )}
          <View style={{ marginTop: 15 }}>
            <FlatList
              extraData={Boatfacality}
              data={Boatfacality}
              style={{
                marginTop: 5,
                paddingHorizontal: 10,
                marginBottom: 10,
              }}
              renderItem={_renderView}
              keyExtractor={(item, index) => "key" + index}
              horizontal
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: 16,
                  paddingHorizontal: 10,
                  marginTop: -33,
                }}
              >
                Boat Owner
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: 16,
                  paddingHorizontal: 10,
                  marginTop: -33,
                }}
              >
                Boat Staff
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "98%",
                alignSelf: "center",
              }}
            >
              <Input
                placeholder="First Name"
                containerStyle={s.Input1}
                inputContainerStyle={s.Input1}
                placeholderTextColor={Colors.white}
                inputStyle={{ color: Colors.white }}
                onChangeText={(t) => setF_name(t)}
                value={f_name}
              />
              <Input
                placeholder="Last Name"
                containerStyle={s.Input1}
                inputContainerStyle={s.Input1}
                placeholderTextColor={Colors.white}
                inputStyle={{ color: Colors.white }}
                onChangeText={(t) => setL_name(t)}
                value={L_name}
              />
            </View>

            {Boatfacality[0].value == 1 && Boatfacality[0].isSelected ? (
              <Input
                placeholder="Email"
                containerStyle={s.Input}
                inputContainerStyle={s.Input}
                placeholderTextColor={Colors.white}
                inputStyle={{ color: Colors.white }}
                keyboardType="email-address"
                onChangeText={(t) => setemail(t)}
                value={email}
              />
            ) : (
              <View>
                {isconfirm ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "center",
                      marginHorizontal: 20,
                      marginTop: 10,
                      alignItems: "center",
                    }}
                  >
                    <Input
                      placeholder="Email"
                      containerStyle={s.Input}
                      inputContainerStyle={s.Input}
                      placeholderTextColor={Colors.white}
                      inputStyle={{ color: Colors.white }}
                      keyboardType="email-address"
                      onChangeText={(t) => setemail(t)}
                      value={email}
                      // onBlur={}
                      onBlur={() => onBlurInput()}
                    />

                    <Feather
                      onPress={() => setconfirm(!isconfirm)}
                      name={"check-circle"}
                      size={25}
                      color={"#00FF00"}
                      style={{
                        marginHorizontal: 5,
                        borderBottomColor: Colors.white,
                        marginTop: -35,
                      }}
                    />
                  </View>
                ) : (
                  <View>
                    {notconfirm ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignSelf: "center",
                          marginHorizontal: 20,
                          marginTop: 10,
                          alignItems: "center",
                        }}
                      >
                        <Input
                          placeholder="Email"
                          containerStyle={s.Input}
                          inputContainerStyle={s.Input}
                          placeholderTextColor={Colors.white}
                          inputStyle={{ color: Colors.white }}
                          keyboardType="email-address"
                          onChangeText={(t) => setemail(t)}
                          value={email}
                          // onBlur={}
                          onBlur={() => onBlurInput()}
                        />
                        <Feather
                          onPress={() => setconfirm(!isconfirm)}
                          name={"x-circle"}
                          size={25}
                          color={"#FF0000"}
                          style={{
                            marginHorizontal: 5,
                            borderBottomColor: Colors.white,
                            marginTop: -35,
                          }}
                        />
                      </View>
                    ) : (
                      <Input
                        placeholder="Email"
                        containerStyle={s.Input}
                        inputContainerStyle={s.Input}
                        placeholderTextColor={Colors.white}
                        inputStyle={{ color: Colors.white }}
                        keyboardType="email-address"
                        onChangeText={(t) => setemail(t)}
                        value={email}
                        // onBlur={}
                        onBlur={() => onBlurInput()}
                      />
                    )}
                  </View>
                )}
              </View>
            )}
            <Input
              placeholder="Mobile"
              containerStyle={s.Input}
              inputContainerStyle={s.Input}
              placeholderTextColor={Colors.white}
              inputStyle={{ color: Colors.white }}
              keyboardType="number-pad"
              sss
              onChangeText={(t) => setm_number(t)}
              value={m_number}
            />

            {Boatfacality[0].value == 1 && Boatfacality[0].isSelected ? (
              <Input
                placeholder="Business Name"
                containerStyle={s.Input}
                inputContainerStyle={s.Input}
                placeholderTextColor={Colors.white}
                inputStyle={{ color: Colors.white }}
                keyboardType="default"
                onChangeText={(t) => setb_name(t)}
                value={b_name}
              />
            ) : null}

            {/* <Input
              placeholder="Business Location"
              containerStyle={s.Input}
              inputContainerStyle={s.Input}
              placeholderTextColor={Colors.white}
              inputStyle={{color: Colors.white}}
              onChangeText={t => setb_location(t)}
              value={b_location}
            /> */}
            <TouchableOpacity
              onPress={() => {
                // StatusBar.setBackgroundColor('white')
                // StatusBar.setBarStyle('dark-content')
                setVisibleCity(!visibleCity);
              }}
              style={{
                flexDirection: "row",
                paddingBottom: 15,
                paddingHorizontal: 15,
                marginTop: -12,
              }}
            >
              <Text
                style={{ fontSize: 18, color: "#fff" }}
              >{`${cityName}`}</Text>
            </TouchableOpacity>
            <View
              style={{
                borderColor: "#fff",
                borderBottomWidth: 1,
                width: "95%",
                alignSelf: "center",
                marginBottom: 23,
                marginTop: -7,
              }}
            />
            <DatePicker
              style={{
                width: "95%",
                alignSelf: "center",
                height: 60,
                color: "#fff",
              }}
              date={dob}
              mode="date"
              placeholder="Date of Birth"
              format="YYYY-MM-DD"
              // minDate="2016-05-01"
              // maxDate="2016-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  alignItems: "flex-end",
                },
                dateInput: {
                  borderColor: "#234456",
                  borderWidth: 0,
                  // borderRadius: 4,
                  alignItems: "flex-start",
                  paddingRight: 10,
                  borderBottomColor: "#fff",
                  borderBottomWidth: 1,
                },
                dateText: {
                  color: "#fff",
                  fontFamily: FontFamily.semi_bold,
                  // fontSize:30
                },
              }}
              onDateChange={(date) => setdob(date)}
            />
            <Picker
              selectedValue={gender}
              style={[
                {
                  color: colors.white,
                  marginTop: -20,
                  borderBottomColor: Colors.white,
                },
              ]}
              itemStyle={{
                fontFamily: FontFamily.default,
                fontWeight: "bold",
                color: colors.white,
              }}
              dropdownIconColor="#fff"
              mode="dialog"
              onValueChange={(itemValue, itemIndex) => setgender(itemValue)}
            >
              <Picker.Item label="Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
            <Input
              placeholder="Password"
              secureTextEntry
              containerStyle={s.Input}
              inputContainerStyle={s.Input}
              placeholderTextColor={Colors.white}
              inputStyle={{ color: Colors.white }}
              onChangeText={(t) => setpassword(t)}
              value={password}
            />
            <Input
              placeholder="Confirm Password"
              containerStyle={s.Input}
              secureTextEntry
              inputContainerStyle={s.Input}
              placeholderTextColor={Colors.white}
              inputStyle={{ color: Colors.white }}
              onChangeText={(t) => setconfirmPass(t)}
              value={confirmPass}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginHorizontal: 20,
              marginTop: 10,
              alignItems: "center",
            }}
          >
            {isChecked ? (
              <AntDesign
                onPress={() => setChecked(!isChecked)}
                name={"checksquare"}
                size={25}
                color={"#fff"}
                style={{ marginHorizontal: 5 }}
              />
            ) : (
              <Feather
                onPress={() => setChecked(!isChecked)}
                name={"square"}
                size={25}
                color={"#fff"}
                style={{ marginHorizontal: 5 }}
              />
            )}

            <Text style={s.Text1}>{"By sign up, you agree to our "}</Text>
            <TouchableOpacity
              onPress={() => {
                Navigation.navigate("Terms_Conditions");
              }}
              style={{ borderBottomWidth: 1, borderColor: "#fff" }}
            >
              <Text style={[s.Text1]}>{"terms of service"}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginHorizontal: 10,
              marginBottom: 15,
            }}
          >
            <Text style={s.Text1}>{" and "}</Text>
            <TouchableOpacity
              onPress={() => {
                Navigation.navigate("privacyPolicy");
              }}
              style={{ borderBottomWidth: 1, borderColor: "#fff" }}
            >
              <Text style={s.Text1}>{"privacy policy"}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ elevation: 5 }}>
            <TouchableOpacity
              style={s.btn1}
              onPress={() => {
                signUp();
              }}
            >
              <Text style={s.btn1Text}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={[s.Text1, { marginBottom: 10 }]}>
              I have already account ?{" "}
              <Text
                style={{
                  fontFamily: FontFamily.semi_bold,
                  color: Colors.white,
                  alignSelf: "center",
                  textDecorationLine: "underline",
                }}
                suppressHighlighting={true}
                onPress={() => Navigation.navigate("Login")}
              >
                Login
              </Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>
      )}
      {/* </ImageBackground> */}
      <Overlay visible={visible}>
        <View style={{ width: "90%", alignSelf: "center" }}>
          <Text
            style={{
              textAlign: "center",
              marginVertical: 10,
              fontFamily: FontFamily.semi_bold,
            }}
          >
            Verify Otp
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginBottom: 10,
              fontFamily: FontFamily.default,
            }}
          >
            Otp is sent to {email}
          </Text>
          <OtpInputs
            handleChange={(code) => setOtp(code)}
            numberOfInputs={6}
            value={parseInt(otp)}
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              width: "100%",
              alignSelf: "center",
              fontFamily: FontFamily.semi_bold,
            }}
            inputStyles={{
              color: Colors.orange,
              textAlign: "center",
              fontFamily: FontFamily.semi_bold,
              fontSize: 20,
            }}
            inputContainerStyles={{
              backgroundColor: Colors.gray1,
              borderColor: "#000",
              height: 50,
              width: 50,
              borderRadius: 10,
              borderWidth: 0,
              elevation: 5,
              justifyContent: "space-around",
            }}
            focusStyles={{
              // borderWidth:1,
              borderColor: Colors.orange,
              backgroundColor: Colors.white,
              elevation: 5,
            }}
          />
          <View
            style={{ flexDirection: "row", marginTop: 30, alignSelf: "center" }}
          >
            <Text
              style={{ textAlign: "center", fontFamily: FontFamily.default }}
            >
              {" "}
              Didn't recived code ?{" "}
            </Text>
            <TouchableOpacity
              style={{}}
              onPress={() => resendOtp({ user_id: userId })}
            >
              <Text
                style={{
                  alignSelf: "center",
                  fontFamily: FontFamily.semi_bold,
                }}
              >
                Resend Code
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ elevation: 5, marginBottom: 10 }}>
            <TouchableOpacity
              style={s.btn1}
              onPress={() => {
                verifyOtp({ user_id: userId, user_otp: otp });
              }}
            >
              <Text style={s.btn1Text}>Verify & Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    </View>
  );
};
const s = StyleSheet.create({
  ImageBackground: {
    //height: '100%',
    // width: Sizes.width,
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.black,
  },
  ImageBackground_Img: {
    opacity: 0.5,
  },
  Logo: {
    height: 70,
    width: 70,
    borderRadius: 20,
    // backgroundColor: Colors.orange,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  Text1: {
    textAlign: "center",
    fontFamily: FontFamily.default,
    color: Colors.white,
    fontSize: 14,
  },
  Input1: {
    borderBottomColor: Colors.white,
    width: Sizes.width * 0.46,
    marginLeft: -5,
  },
  Input: {
    borderBottomColor: Colors.white,
    marginTop: -15,
  },
  Input11: {
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    marginTop: -25,
    // marginBottom:20,
    borderColor: "#fff",
  },
  btn1: {
    height: 48,
    width: "95%",
    backgroundColor: Colors.orange,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginVertical: 10,
    elevation: 5,
  },
  btn1Text: {
    fontSize: 20,
    fontFamily: FontFamily.semi_bold,
    color: Colors.white,
  },
});


const mapDispatchToProps = {
  addPermissions: addPermissions,
};

export default connect(null, mapDispatchToProps)(SignUp);

