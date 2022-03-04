import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { Input } from "react-native-elements";
import { ActivityIndicator } from "react-native-paper";
import Header from "../../Components/Header";
import config from "../../Constants/config";
import { Colors, FontFamily } from "../../Constants/Constants";
import I18n from "../../Translations/i18";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

let togglearr = [
  { key: "1", switch: false, text:I18n.translate('view_home'), v: "view_home_permission" },
  { key: "2", switch: false, text: I18n.translate('manage_home'), v: "manage_home_permission" },
  { key: "3", switch: false, text: I18n.translate('view_my_add') , v: "view_add_permission" },
  { key: "4", switch: false, text: I18n.translate('manage_my_add'), v: "manage_add_permission" },
  { key: "5", switch: false, text: I18n.translate('chat'), v: "chat_permission" },
  {
    key: "6",
    switch: false,
    text: I18n.translate('view_unavailability'),
    v: "view_unavailability_permission",
  },
  {
    key: "7",
    switch: false,
    text: I18n.translate('manage_unavailability'),
    v: "manage_unavailability_permission",
  },
  {
    key: "8",
    switch: false,
    text:I18n.translate('view_my_wallet') ,
    v: "view_my_wallet_permission",
  },
  {
    key: "9 ",
    switch: false,
    text: I18n.translate('view_withdraw'),
    v: "view_withdrawl_permission",
  },
];

const AddStaff = (props) => {
  console.log(props, "props in bait>>>>>>>>>>");
  console.log("props.route.params.item :>> ", props.route.params.item);
  // const [isContact, setisContact] = useState([
  //   { key: 'Basketball', switch: false },
  //   { key: 'Football', switch: false },
  //   { key: 'Baseball', switch: false },
  //   { key: 'Soccer', switch: false },
  //   { key: 'Running', switch: false },
  //   { key: 'Cross Training', switch: false },
  //   { key: 'Gym Workout', switch: false },
  //   { key: 'Swimming', },
  // ]);

  const Navigation = useNavigation();

  const [state, setState] = useState({
    view_home_permission: 0,
    manage_home_permission: 0,
    view_add_permission: 0,
    manage_add_permission: 0,
    chat_permission: 0,
    view_unavailability_permission: 0,
    manage_unavailability_permission: 0,
    view_my_wallet_permission: 0,
    view_withdrawl_permission: 0,
  });
  const {
    view_home_permission,
    manage_home_permission,
    view_add_permission,
    manage_add_permission,
    chat_permission,
    view_unavailability_permission,
    manage_unavailability_permission,
    view_my_wallet_permission,
    view_withdrawl_permission,
  } = state;

  const [Items, setItems] = useState(props.route.params.item);
  const [loader, setLoader] = useState(false);
  const [user_id_post, setUser_id_post] = useState("");
  const [staffEmail, setstaffEmail] = useState(
    Items && Items.email ? Items && Items.email : ""
  );
  const [boat_brand, setBoat_brand] = useState("");
  const [boat_number, setBoat_number] = useState("");
  const [permissionList, setpermissionList] = useState([
    { key: "1", switch: Items && Items.view_home_permission == 1 ? true : false, text: I18n.translate('view_home'), v: "view_home_permission" },
    {
      key: "2",
      switch: Items && Items.manage_home_permission == 1 ? true : false,
      text: I18n.translate('manage_home'),
      v: "manage_home_permission",
    },
    {
      key: "3",
      switch: Items && Items.view_add_permission == 1 ? true : false,
      text: I18n.translate('view_my_add') ,
      v: "view_add_permission",
    },
    {
      key: "4",
      switch: Items && Items.manage_add_permission == 1 ? true : false,
      text: I18n.translate('manage_my_add'),
      v: "manage_add_permission",
    },
    {
      key: "5",
      switch: Items && Items.chat_permission == 1 ? true : false,
      text: I18n.translate('chat'),
      v: "chat_permission",
    },
    {
      key: "6",
      switch: Items && Items.view_unavailability_permission == 1 ? true : false,
      text: I18n.translate('view_unavailability'),
      v: "view_unavailability_permission",
    },
    {
      key: "7",
      switch:
        Items && Items.manage_unavailability_permission == 1 ? true : false,
      text: I18n.translate('manage_unavailability'),
      v: "manage_unavailability_permission",
    },
    {
      key: "8",
      switch: Items && Items.view_my_wallet_permission == 1 ? true : false,
      text:I18n.translate('view_my_wallet') ,
      v: "view_my_wallet_permission",
    },
    {
      key: "9 ",
      switch: Items && Items.view_withdrawl_permission == 1 ? true : false,
      text: I18n.translate('view_withdraw'),
      v: "view_withdrawl_permission",
    },
  ]);
  const [fishTypeId, setfishTypeId] = useState(null);
  const [LifeIcon, setLifeIcon] = useState(false);
  const [registration_no, setRegistration_no] = useState("");
  const [boat_year, setBoat_year] = useState(new Date());
  const [boat_length, setBoat_length] = useState("");
  const [boat_capacity, setBoat_capacity] = useState("");
  const [cabins, setCabins] = useState("");
  const [toilets, setToilets] = useState("");
  const [showDate, setShowDate] = useState("off");
  const [date, setDate] = useState(new Date());
  const [pageType, setPageType] = useState("Add");

  useEffect(async () => {
    
    if (props.route.params) {
      if (props.route.params.type === "Edit") {
        setPageType("Edit");
        setItems();
        setState({
          view_home_permission: props.route.params.item.view_home_permission,
          manage_home_permission:
            props.route.params.item.manage_home_permission,
          view_add_permission: props.route.params.item.view_add_permission,
          manage_add_permission: props.route.params.item.manage_add_permission,
          chat_permission: props.route.params.item.chat_permission,
          view_unavailability_permission:
            props.route.params.item.view_unavailability_permission,
          manage_unavailability_permission:
            props.route.params.item.manage_unavailability_permission,
          view_my_wallet_permission:
            props.route.params.item.view_my_wallet_permission,
          view_withdrawl_permission:
            props.route.params.item.view_withdrawl_permission,
        });
      }
    }
  }, []);

  const getBoatNumber = async () => {
    setLoader(true);
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl + "/getLastBoatNumber.php?user_id_post=" + parsedInfo.id;
    axios
      .get(url)
      .then((res) => {
        setLoader(false);
        console.log("getLastBoatNumber", res.data);
        if (res.data.boat_number) {
          setBoat_number(parseInt(res.data.boat_number) + 1);
        } else {
          setBoat_number(1);
          // alert(res.data.msg[0]);
          // console.log(res.data.success);
        }
      })
      .catch((err) => console.log(err));
  };

  // const setItems = async () => {
  //   const { item } = props.route.params;
  //   console.log('item????????', item);

  // };

  //adding staff
  const AddBoat = async () => {
    if (staffEmail == "") {
      return alert("Please provide your email!");
    }
    setLoader(true);

    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);

    let url = config.apiUrl + "/add_staff_member.php";
    let formData = new FormData();

    formData.append("boat_owner_id", parsedInfo.id);
    formData.append("staff_email_id", staffEmail);
    formData.append("view_home_permission", view_home_permission);
    formData.append("manage_home_permission", manage_home_permission);
    formData.append("view_add_permission", view_add_permission);
    formData.append("manage_add_permission", manage_add_permission);
    formData.append("chat_permission", chat_permission);
    formData.append(
      "view_unavailability_permission",
      view_unavailability_permission
    );
    formData.append(
      "manage_unavailability_permission",
      manage_unavailability_permission
    );
    formData.append("view_my_wallet_permission", view_my_wallet_permission);
    formData.append("view_withdrawl_permission", view_withdrawl_permission);

    console.log(formData);

    axios
      .post(url, formData)
      .then((res) => {
        console.log("staff added ", res);
        if (res && res.data && res.data.length > 0 && res.data[0].success) {
          setLoader(false);

          alert(res.data[0].message);

          if (props.route.params) {
            Navigation.goBack();
          } else {
            Navigation.replace("Home");
          }
        } else {
          setLoader(false);
          alert(res.data.msg);
          console.log(res.data.success);
        }
      })
      .catch((err) => console.log(err));
  };

  const editBoat = async () => {
    setLoader(true);
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);

    let url = config.apiUrl + "/update_staff_member.php";
    var formData = new FormData();
    formData.append("boat_id", parsedInfo.id);
    formData.append("staff_id", props.route.params.item.user_id);
    formData.append("staff_email_id", staffEmail);
    formData.append("view_home_permission", view_home_permission);
    formData.append("manage_home_permission", manage_home_permission);
    formData.append("view_add_permission", view_add_permission);
    formData.append("manage_add_permission", manage_add_permission);
    formData.append("chat_permission", chat_permission);
    formData.append(
      "view_unavailability_permission",
      view_unavailability_permission
    );
    formData.append(
      "manage_unavailability_permission",
      manage_unavailability_permission
    );
    formData.append("view_my_wallet_permission", view_my_wallet_permission);
    formData.append("view_withdrawl_permission", view_withdrawl_permission);

    console.log(formData);

    axios
      .post(url, formData)
      .then((res) => {
        console.log("boat_edit", res);
        setLoader(false);
        if (res.data.success === "true") {
          Navigation.goBack();
        } else {
          alert(res.data.msg[0]);
          console.log(res.data.success);
        }
      })
      .catch((err) => console.log(err));
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate("off");
    setBoat_year(currentDate);
    // console.log(currentDate)
  };
  console.log("date", showDate, boat_year);

  //flatlist data .........
  const updateSwitch = (val, ind, key) => {
    const array = permissionList.map((v) => {
      const newItem = Object.assign({}, v);
      console.log(newItem, "..........");
      return newItem;
    });
    array[ind].switch = val;
    setpermissionList(array);
    console.log(array);

    if (key == 1) {
      setState((prevState) => ({
        ...prevState,
        view_home_permission: val ? 1 : 0,
      }));
    } else if (key == 2) {
      setState((prevState) => ({
        ...prevState,
        manage_home_permission: val ? 1 : 0,
      }));
    } else if (key == 3) {
      setState((prevState) => ({
        ...prevState,
        view_add_permission: val ? 1 : 0,
      }));
    } else if (key == 4) {
      setState((prevState) => ({
        ...prevState,
        manage_add_permission: val ? 1 : 0,
      }));
    } else if (key == 5) {
      setState((prevState) => ({
        ...prevState,
        chat_permission: val ? 1 : 0,
      }));
    } else if (key == 6) {
      setState((prevState) => ({
        ...prevState,
        view_unavailability_permission: val ? 1 : 0,
      }));
    } else if (key == 7) {
      setState((prevState) => ({
        ...prevState,
        manage_unavailability_permission: val ? 1 : 0,
      }));
    } else if (key == 8) {
      setState((prevState) => ({
        ...prevState,
        view_my_wallet_permission: val ? 1 : 0,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        view_withdrawl_permission: val ? 1 : 0,
      }));
    }
  };

  //view of flatlist
  const _renderDateView = ({ item, index }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#fafafa",
        marginVertical: 10,
        marginHorizontal: 10,
        width: windowWidth,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.text}</Text>

        <Switch
          value={item.switch}
          onValueChange={(value) => updateSwitch(value, index, item.key)}
          trackColor={{
            true: Colors.orange,
            false: Platform.OS == "android" ? "#d3d3d3" : Colors.orange,
          }}
          style={{
            top: 2,
            alignSelf: "center",
            right: 20,
            borderColor: Colors.orange,
            borderWidth: 2,
            borderRadius: 16,
          }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <Header imgBack={true} name= {pageType + " Staff"} backBtn={true} />
        <View style={s.SEC2}>
          {pageType === "Edit" ? (
            <View style={{ marginTop: 15 }}>
              <Input
                value={staffEmail}
                placeholder="enter your email address"
                containerStyle={s.Input}
                inputContainerStyle={s.Input}
                placeholderTextColor={Colors.gray1}
                onChangeText={(txt) => setstaffEmail(txt)}
                editable={false}
              />
            </View>
          ) : (
            <View style={{ marginTop: 15 }}>
              <Input
                value={staffEmail}
                placeholder="enter your email address"
                containerStyle={s.Input}
                inputContainerStyle={s.Input}
                placeholderTextColor={Colors.gray1}
                onChangeText={(txt) => setstaffEmail(txt)}
              />
            </View>
          )}
          <View style={{ marginbottom: 5, marginHorizontal: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {I18n.translate('permission')} :
            </Text>
          </View>
          <View style={{ marginTop: 5, flex: 1 }}>
            <FlatList
              extraData={fishTypeId}
              data={permissionList}
              contentInset={{ bottom: 20 }}
              renderItem={_renderDateView}
              keyExtractor={(item, index) => "key" + index}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={() =>
                !permissionList.length ? (
                  <Text
                    style={{
                      alignSelf: "center",
                      marginTop: 20,
                      fontFamily: fonts.regular,
                    }}
                  >
                    No Match found
                  </Text>
                ) : null
              }
            />
            <View
              style={{
                marginBottom: 10,
                top: -5,
              }}
            >
              <TouchableOpacity
                onPress={pageType === "Edit" ? editBoat : AddBoat}
                style={s.btn1}
              >
                {loader ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text style={s.btn1Text}>
                    {pageType === "Edit" ? I18n.translate('save') : "Submit"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
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
export default AddStaff;
