import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Input } from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
import { connect } from "react-redux";
import Header from "../../Components/Header";
import config from "../../Constants/config";
import { Colors, FontFamily } from "../../Constants/Constants";
import I18n from "../../Translations/i18";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AddBoat = (props) => {
  const Navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [user_id_post, setUser_id_post] = useState("");
  const [boat_name, setBoat_name] = useState("");
  const [boat_brand, setBoat_brand] = useState("");
  const [boat_number, setBoat_number] = useState("1");
  const [registration_no, setRegistration_no] = useState("");
  const [boat_year, setBoat_year] = useState(new Date());
  const [boat_length, setBoat_length] = useState("");
  const [boat_capacity, setBoat_capacity] = useState("");
  const [cabins, setCabins] = useState("");
  const [toilets, setToilets] = useState("");
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [pageType, setPageType] = useState(I18n.translate("add"));

  useEffect(async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    setUser_id_post(parsedInfo.id);

    if (props.route.params) {
      if (props.route.params.type === "Edit") {
        setPageType(I18n.translate("edit"));
        setItems();
      } else {
        getBoatNumber();
      }
    }
    // setItems()
  }, []);
  const getBoatNumber = async () => {
    //setLoader(true)
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl + "/getLastBoatNumber.php?user_id_post=" + parsedInfo.id;
    axios
      .get(url)
      .then((res) => {
        setLoader(false);
        if (res.data.boat_number) {
          setBoat_number(parseInt(res.data.boat_number) + 1);
        } else {
          setBoat_number(1);
        }
      })
      .catch((err) => console.log(err));
  };
  const setItems = async () => {
    const { item } = props.route.params;
    setBoat_name(item.name);
    // setBoat_brand(item.name)
    setBoat_number(item.boat_number);
    setRegistration_no(item.registration_no);
    setBoat_year(new Date(item.manufacturing_year));
    setBoat_length(item.boat_length);
    setBoat_capacity(item.boat_capacity);
    setCabins(item.cabins);
    setToilets(item.toilets);
    setBoat_brand(item.brand);
  };
  const AddBoat = async () => {
    setLoader(true);
    let url = config.apiUrl + "/boat_create.php";
    var data = new FormData();
    data.append("user_id_post", user_id_post);
    data.append("boat_name", boat_name);
    data.append("boat_brand", boat_brand);
    data.append("boat_number", boat_number);
    data.append("registration_no", registration_no);
    data.append("boat_year", moment(boat_year).format("YYYY-MM-DD"));
    data.append("boat_length", boat_length);
    data.append("boat_capacity", boat_capacity);
    data.append("cabins", cabins);
    data.append("toilets", toilets);
    console.log(data);
    axios
      .post(url, data)
      .then((res) => {
        console.log(res,'res on Add');
        if (res.data.success === "true") {
          setLoader(false);
          if (props.route.params) {
            Navigation.goBack();
          } else {
            Navigation.replace("Home");
          }
        } else {
          if (props.language_id == 0) {
            alert(res.data.msg[0]);
          } else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
  };
  const editBoat = async () => {
    setLoader(true);
    let url = config.apiUrl + "/boat_edit.php";
    var data = new FormData();
    data.append("user_id_post", user_id_post);
    data.append("boat_id_post", props.route.params.item.boat_id);
    data.append("boat_name", boat_name);
    data.append("boat_brand", boat_brand);
    data.append("boat_number", boat_number);
    data.append("registration_no", registration_no);
    data.append("boat_year", moment(boat_year).format("YYYY-MM-DD"));
    data.append("boat_length", boat_length);
    data.append("boat_capacity", boat_capacity);
    data.append("cabins", cabins);
    data.append("toilets", toilets);
    console.log(data);
    axios
      .post(url, data)
      .then((res) => {
        setLoader(false);
        if (res.data.success === "true") {
          Navigation.goBack();
        } else {
          if (props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
  };
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(false);
    setBoat_year(currentDate);
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header
        imgBack={true}
        name={pageType + ` ${I18n.translate("boat")}`}
        backBtn={true}
        isarbic={props.language_id == 1 ? 1 : 0}
      />
      <View style={s.SEC2}>
        <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        >
          <View style={{ marginTop: 5 }}>
            <Input
              fontFamily={FontFamily.default}
              textAlign={props.language_id == 0 ? "left" : "right"}
              value={boat_name}
              placeholder={I18n.translate("boat_name")}
              containerStyle={s.Input}
              inputContainerStyle={s.Input}
              placeholderTextColor={Colors.gray1}
              onChangeText={(txt) => setBoat_name(txt)}
            />
            <Input
              fontFamily={FontFamily.default}
              textAlign={props.language_id == 0 ? "left" : "right"}
              value={boat_number.toString()}
              placeholder={I18n.translate("boat_num")}
              disabled
              containerStyle={s.Input1}
              inputContainerStyle={s.Input1}
              placeholderTextColor={Colors.gray1}
              onChangeText={(txt) => setBoat_number(txt)}
            />
            <Input
              fontFamily={FontFamily.default}
              textAlign={props.language_id == 0 ? "left" : "right"}
              value={boat_brand}
              placeholder={I18n.translate("boat_brand")}
              containerStyle={s.Input1}
              inputContainerStyle={s.Input1}
              placeholderTextColor={Colors.gray1}
              onChangeText={(txt) => setBoat_brand(txt)}
            />
            <Input
              fontFamily={FontFamily.default}
              textAlign={props.language_id == 0 ? "left" : "right"}
              value={registration_no}
              placeholder={I18n.translate("registration_num")}
              containerStyle={s.Input1}
              inputContainerStyle={s.Input1}
              placeholderTextColor={Colors.gray1}
              onChangeText={(txt) => setRegistration_no(txt)}
            />

            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingBottom: 10,
                marginBottom: 20,
                marginHorizontal: 15,
                borderBottomWidth: 1,
                alignSelf: "center",
                width: "93%",
              }}
              onPress={() => setShowDate(!showDate)}
            >
              <Text
                style={{
                  fontSize: 18,
                  alignSelf: "center",
                  color: Colors.gray,
                  fontFamily: FontFamily.default,
                }}
              >
                {I18n.translate("boat_year")}
              </Text>

              {/* {showDate !== "off" ? (
                <View
                  style={{
                    backgroundColor: "red",
                  }}
                >
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={boat_year}
                    mode={"date"}
                    // is24Hour={true}
                    display="spinner"
                    onChange={() => onDateChange}
                  />
                </View>
              ) : ( */}
              <View
                style={{ alignSelf: "center", fontSize: 18 }}
                // onPress={() => setShowDate(true)}
              >
                <Text style={{ fontFamily: FontFamily.default }}>
                  {moment(boat_year).format("YYYY-MM-DD")}
                </Text>
              </View>
              {/* )} */}
            </TouchableOpacity>

            {showDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={boat_year}
                mode={"date"}
                display='spinner'
                onChange={onDateChange}
              />
            )}

            {/* <Input
                            placeholder="Boat Year"
                            containerStyle={s.Input1}
                            inputContainerStyle={s.Input1}
                            placeholderTextColor={Colors.gray1}
                            onChangeText={txt => setBoat_year(txt)}
                        /> */}
            <Input
              fontFamily={FontFamily.default}
              textAlign={props.language_id == 0 ? "left" : "right"}
              value={boat_length}
              placeholder={I18n.translate("boat_size")}
              containerStyle={s.Input1}
              inputContainerStyle={s.Input1}
              placeholderTextColor={Colors.gray1}
              onChangeText={(txt) => setBoat_length(txt)}
              keyboardType={"number-pad"}
            />
            <Input
              fontFamily={FontFamily.default}
              textAlign={props.language_id == 0 ? "left" : "right"}
              value={boat_capacity}
              placeholder={I18n.translate("boat_cap")}
              containerStyle={s.Input1}
              inputContainerStyle={s.Input1}
              placeholderTextColor={Colors.gray1}
              onChangeText={(txt) => setBoat_capacity(txt)}
              keyboardType={"number-pad"}
            />
            <Input
              fontFamily={FontFamily.default}
              textAlign={props.language_id == 0 ? "left" : "right"}
              value={cabins}
              placeholder={I18n.translate("cabin")}
              containerStyle={s.Input1}
              inputContainerStyle={s.Input1}
              placeholderTextColor={Colors.gray1}
              onChangeText={(txt) => setCabins(txt)}
              keyboardType={"number-pad"}
            />
            <Input
              fontFamily={FontFamily.default}
              textAlign={props.language_id == 0 ? "left" : "right"}
              value={toilets}
              placeholder={I18n.translate("toilet")}
              containerStyle={s.Input1}
              inputContainerStyle={s.Input1}
              placeholderTextColor={Colors.gray1}
              onChangeText={(txt) => setToilets(txt)}
              keyboardType={"number-pad"}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <TouchableOpacity
              onPress={pageType === I18n.translate("edit") ? editBoat : AddBoat}
              style={s.btn1}
            >
              {loader ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={s.btn1Text}>{I18n.translate("submit")}</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};
const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
});

export default connect(mapStateToProps)(AddBoat);
const s = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    marginTop: -80,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
  },
  Input1: {
    borderBottomColor: Colors.black,
    marginTop: -7,
  },
  Input: {
    borderBottomColor: Colors.black,
    marginTop: -0,
  },
  btn1: {
    height: 48,
    width: "95%",
    backgroundColor: Colors.orange,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginBottom: 20,
    elevation: 5,
  },
  btn1Text: {
    fontSize: 20,
    fontFamily: FontFamily.semi_bold,
    color: Colors.white,
  },
});
