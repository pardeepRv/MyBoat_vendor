import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  SafeAreaView,
  I18nManager,
  Modal,
  TextInput,
} from "react-native";
import I18n from "../../Translations/i18";
import { Icon, Input, Card } from "react-native-elements";
import AntDesign from "react-native-vector-icons/dist/AntDesign";
import DatePicker from "react-native-datepicker";
import { Colors, FontFamily, Sizes } from "../../Constants/Constants";
import { useNavigation } from "@react-navigation/core";
import Header from "../../Components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../Constants/config";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import SearchableDropdown from "react-native-searchable-dropdown";
import ImagePicker from "react-native-image-crop-picker";
import { connect, useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      First_Name: "",
      Last_Name: "",
      Email: "",
      Mobile: "",
      Business_Name: "",
      Business_Location: "",
      Choose_City: "",
      cityName: I18n.translate("select_city"),
      Birthday: "",
      Gender: null,
      About: "",
      userId: "",
      loader: false,
      data: [],
      showDate: "off",
      date: new Date(),
      modalVisible: false,
      imageUpload: null,
      image: "NA",
      genderTypes: [
        { name: I18n.translate("male"), id: 1 },
        { name: I18n.translate("female"), id: 0 },
      ],
      cityDropdown: [],
      cityDropdownCopy: [],
    };
  }
  async componentDidMount() {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    this.setState({ userId: parsedInfo.id });
    this.getProfile();
    this.addOnData();
  }
  sortCity = (arr) => {
    arr.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  };
  searchCity = (e) => {
    let text = e.toLowerCase();
    let cityArrCopy = this.state.cityDropdown;
    let filteredName = cityArrCopy.filter((item) => {
      return item.name.toLowerCase().match(text);
    });
    if (!text || !text.length || text === "") {
      this.setState({ cityDropdownCopy: this.state.cityDropdown });
    } else if (!filteredName.length) {
      this.setState({ cityArrCopyCopy: this.state.cityDropdown });
    } else if (Array.isArray(filteredName)) {
      this.setState({ cityDropdownCopy: filteredName });
    }
  };
  addOnData = () => {
    let url =
      config.apiUrl +
      "/boat_trip_type_for_add_advr.php?user_id_post=" +
      this.state.userId +
      "&country_code=965";
    axios
      .get(url)
      .then((res) => {
        if (res) {
          var cityArr = res.data.city_arr;
          var arr = [];
          cityArr.map((item) => {
            // console.log(item.city[0], item.city_id)
            var cityItem = {
              id: item.city_id,
              name: this.props.language_id == 0 ? item.city[0] : item.city[1],
            };
            arr.push(cityItem);
          });
          this.sortCity(arr);
          this.setState({
            cityDropdown: arr,
            cityDropdownCopy: arr,
          });
        } else {
          if (this.props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
          console.log(res.data.success);
        }
      })
      .catch((err) => console.log(err));
  };
  getProfile = () => {
    let url =
      config.apiUrl + "/getUserDetails.php?user_id_post=" + this.state.userId;
    axios
      .get(url)
      .then((res) => {
        if (res.data.success === "true") {
          this.setState({
            data: res.data.user_details,
            First_Name: res.data.user_details.f_name,
            Last_Name: res.data.user_details.l_name,
            Email: res.data.user_details.email,
            Mobile: res.data.user_details.mobile,
            Business_Name: res.data.user_details.bussness_name,
            image:
              res.data.user_details.image !== "NA"
                ? config.imageUrl + res.data.user_details.image
                : "https://media.istockphoto.com/vectors/no-image-available-sign-vector-id922962354?k=20&m=922962354&s=612x612&w=0&h=f-9tPXlFXtz9vg_-WonCXKCdBuPUevOBkp3DQ-i0xqo=",
            Choose_City: res.data.user_details.city,
            cityName:
              this.props.language_id == 0
                ? res.data.user_details.city_name[0]
                : res.data.user_details.city_name[1],
            Birthday: new Date(res.data.user_details.dob),
            Gender: res.data.user_details.gender,
            About: res.data.user_details.about,
          });
        } else {
          if (this.props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
  };
  _searchCity = (textToSearch) => {
    this.setState({
      cityDropdown: this.state.cityDropdown.filter((i) =>
        i.name.toLowerCase().includes(textToSearch.toLowerCase())
      ),
    });
  };
  _selectCity = (item) => {
    // let data = this.state.city_arr;
    // let len = this.state.city_arr.length;
    // for (let i = 0; i < len; i++) {
    //   data[i].status = false;
    // }
    // data[index].status = !data[index].status;
    this.setState({
      cityName: item.name,
      Choose_City: item.id,
      modalVisible: false,
    });
  };
  editprofile = () => {
    const {
      First_Name,
      Last_Name,
      Email,
      Mobile,
      Business_Name,
      Business_Location,
      Choose_City,
      Birthday,
      Gender,
      About,
      loader,
    } = this.state;
    let url = config.apiUrl + "/edit_profile.php";
    var data = new FormData();
    data.append("user_id_post", this.state.userId);
    data.append("user_type_post", "2");
    // data.append('user_name', 'Rohan123');
    data.append("f_name", this.state.First_Name);
    data.append("l_name", this.state.Last_Name);
    data.append("email", this.state.Email);
    data.append("phone_number", this.state.Mobile);
    data.append("business_name", this.state.Business_Name);
    data.append("gender", this.state.Gender);
    data.append("dob", moment(Birthday).format("YYYY-MM-DD"));
    data.append("city", this.state.Choose_City);
    data.append("profile_pic", this.state.imageUpload);
    data.append("address", "boat");
    data.append("About", "dsasfa");
    this.setState({ loader: true });
    axios
      .post(url, data)
      .then((res) => {
        console.log(res, "res in edit profile>>");
        this.setState({ loader: false });
        if (res.success === "true") {
          this.props.navigation.goBack();
        } else {
          if (this.props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
  };
  uploadImage = () => {
    ImagePicker.openPicker({
      // width: 300,
      // height: 400,
      // multiple: true,
      // maxFiles: 7,
      //   cropping: true,
    }).then((image) => {
      var imagefil = {
        uri: image.path,
        name: image.modificationDate + "." + image.mime.split("/")[1],
        size: image.size,
        filename: image.modificationDate + "." + image.mime.split("/")[1],
        type: image.mime,
      };
      this.setState({
        imageUpload: imagefil,
        image: image.path,
      });
    });
  };
  render() {
    const {
      First_Name,
      Last_Name,
      Email,
      Mobile,
      Business_Name,
      Business_Location,
      Choose_City,
      Birthday,
      Gender,
      About,
      showDate,
      loader,
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <Header
          imgBack={true}
          backBtn={true}
          name={I18n.translate("edit_profile")}
        />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <Modal
            animationType="slide"
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({ modalVisible: false });
            }}
          >
            {/* <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} /> */}
            {/* <View style={s.notification_header}>
            <TouchableOpacity style={{}} onPress={() => { this.setState({ modalVisible: false }) }}>
              <AntDesign name="left" size={25} style={{}} />
            </TouchableOpacity>
            <Text style={s.Notifications_title}>{'Select City'}</Text>
            <Text></Text>
          </View> */}
            {/* <View style={s.search_bar}>
            <TextInput placeholder={'Search'} style={{ height: 50 }} onChangeText={(text) => { this.searchCity(text) }}></TextInput>
          </View> */}
            <View style={{ flex: 1  , marginTop:30}}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AntDesign
                  name={"arrowleft"}
                  onPress={() => {
                    this.setState({ modalVisible: false });
                  }}
                  size={25}
                  style={{ padding: 5, marginHorizontal: 10 }}
                />

                <TextInput
                  textAlign={this.props.language_id == 0 ? "left" : "right"}
                  fontFamily={FontFamily.default}
                  placeholder={I18n.translate("search_city")}
                  value={this.state.placeholderText}
                  onChangeText={(text) => {
                    this.setState({ placeholderText: text }, () => {
                      this.searchCity(text);
                    });
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.orange,
                    width: "85%",
                    borderRadius: 10,
                    marginVertical: 10,
                    height:40
                  }}
                />
              </View>

              <FlatList
                data={this.state.cityDropdownCopy}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this._selectCity(item);

                        this.setState({
                          modalVisible: !this.state.modalVisible,
                        });
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 18,
                          marginVertical: 3,
                          marginHorizontal: 20,
                          // fontFamily:FontFamily.default
                        }}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </Modal>
          <View style={s.SEC2}>
            <ImageBackground
              style={{
                height: 108,
                width: 108,
                borderRadius: 7,
                alignSelf: "center",
              }}
              source={{
                uri: this.state.image,
              }}
              imageStyle={{ resizeMode: "cover", borderRadius: 7 }}
            >
              <TouchableOpacity
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 4,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  bottom: -7,
                  right: -10,
                  borderWidth: 0.7,
                  borderColor: "rgba(0, 0, 0, 0.75)",
                  elevation: 3,
                }}
                onPress={() => this.uploadImage()}
              >
                <Icon
                  name="edit"
                  type="feather"
                  size={24}
                  color={Colors.orange}
                />
              </TouchableOpacity>
            </ImageBackground>
            <ScrollView style={{}}>
              <View style={{ paddingHorizontal: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    width: "98%",
                    alignSelf: "center",
                  }}
                >
                  <Input
                    fontFamily={FontFamily.default}
                    textAlign={this.props.language_id == 0 ? "left" : "right"}
                    value={this.state.First_Name}
                    placeholder={I18n.translate("first_name")}
                    containerStyle={s.Input1}
                    inputContainerStyle={s.Input1}
                    placeholderTextColor={Colors.inputFieldEditProfile}
                    inputStyle={{ color: Colors.black }}
                    onChangeText={(First_Name) => this.setState({ First_Name })}
                  />
                  <Input
                    fontFamily={FontFamily.default}
                    textAlign={this.props.language_id == 0 ? "left" : "right"}
                    value={this.state.Last_Name}
                    placeholder={I18n.translate("last_name")}
                    containerStyle={s.Input1}
                    inputContainerStyle={s.Input1}
                    placeholderTextColor={Colors.inputFieldEditProfile}
                    inputStyle={{ color: Colors.black }}
                    onChangeText={(Last_Name) => this.setState({ Last_Name })}
                  />
                </View>
                <Input
                  fontFamily={FontFamily.default}
                  textAlign={this.props.language_id == 0 ? "left" : "right"}
                  value={this.state.Email}
                  placeholder={I18n.translate("email")}
                  containerStyle={s.Input}
                  inputContainerStyle={s.Input}
                  placeholderTextColor={Colors.inputFieldEditProfile}
                  inputStyle={{ color: Colors.black }}
                  onChangeText={(Email) => this.setState({ Email })}
                />
                <Input
                  fontFamily={FontFamily.default}
                  textAlign={this.props.language_id == 0 ? "left" : "right"}
                  value={this.state.Mobile}
                  placeholder={I18n.translate("mobile")}
                  containerStyle={s.Input}
                  inputContainerStyle={s.Input}
                  placeholderTextColor={Colors.inputFieldEditProfile}
                  inputStyle={{ color: Colors.black }}
                  onChangeText={(Mobile) => this.setState({ Mobile })}
                />
                <Input
                  fontFamily={FontFamily.default}
                  textAlign={this.props.language_id == 0 ? "left" : "right"}
                  value={this.state.Business_Name}
                  placeholder={I18n.translate("business_name")}
                  containerStyle={s.Input}
                  inputContainerStyle={s.Input}
                  placeholderTextColor={Colors.inputFieldEditProfile}
                  inputStyle={{ color: Colors.black }}
                  onChangeText={(Business_Name) =>
                    this.setState({ Business_Name })
                  }
                />
                {/* <Input
                placeholder="Business Location"
                containerStyle={s.Input}
                inputContainerStyle={s.Input}
                placeholderTextColor={Colors.inputFieldEditProfile}
                inputStyle={{ color: Colors.inputFieldEditProfile }}
                onChangeText={Business_Location => this.setState({ Business_Location })}
              /> */}
                {/* <Input
                value={this.state.Choose_City}
                placeholder="Choose City"
                containerStyle={s.Input}
                inputContainerStyle={s.Input}
                placeholderTextColor={Colors.inputFieldEditProfile}
                inputStyle={{ color: Colors.inputFieldEditProfile }}
                onChangeText={Choose_City => this.setState({ Choose_City })}
              /> */}
                <TouchableOpacity
                  onPress={() => this.setState({ modalVisible: true })}
                  style={{
                    ...s.Picker,
                    flexDirection: "row",
                    paddingBottom: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={s.PickerText}>{this.state.cityName}</Text>
                  <AntDesign
                    name="right"
                    size={15}
                    style={{ alignSelf: "center" }}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingBottom: 5,
                    marginVertical: 15,
                    marginHorizontal: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.gray,
                    alignSelf: "center",
                    width: "93%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      alignSelf: "center",
                      fontFamily: FontFamily.default,
                    }}
                  >
                    {I18n.translate("date_of_birth")}
                  </Text>
                  <DatePicker
                    style={{}}
                    style={{ textAlign: "right", height: 45, marginTop: 5 }}
                    date={this.state.Birthday}
                    confirmBtnText="Confirm"
                    placeholder={I18n.translate("date")}
                    androidMode={"spinner"}
                    maxDate={new Date()}
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        alignItems: "flex-end",
                      },
                      dateInput: {
                        borderColor: "#234456",
                        borderWidth: 0,
                        borderRadius: 4,
                        alignItems: "flex-end",
                      },
                    }}
                    onDateChange={(date) => {
                      this.setState({ Birthday: date });
                    }}
                  />
                </View>
                <View style={s.Picker}>
                  {/* <Text style={s.PickerText}>Select Gender</Text> */}
                  <Picker
                    //mode="dialog"
                    //iosHeader="Time Zone"
                    //value={this.state.Gender === 1? 'Male': 'Female'}

                    iosIcon={<AntDesign name="down" size={15} />}
                    style={{ width: "100%", fontFamily: FontFamily.default }}
                    selectedValue={this.state.Gender ? 1 : 0}
                    onValueChange={(modeValue, modeIndex) =>
                      this.setState({ Gender: modeValue })
                    }
                  >
                    {/* <Picker.Item label={this.state.Gender === 1? 'Male': 'Female'} value={ this.state.Gender === 1? 1: 0} /> */}
                    {this.state.genderTypes.map((item, key) => (
                      <Picker.Item
                        label={item.name}
                        value={item.id}
                        key={key}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </ScrollView>
          </View>
          <View>
            <TouchableOpacity style={s.btn1} onPress={() => this.editprofile()}>
              <Text style={s.btn1Text}>{I18n.translate("submit")}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
});

export default connect(mapStateToProps)(EditProfile);
const s = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
  },
  Text: {
    fontFamily: FontFamily.default,
  },
  Input1: {
    borderBottomColor: Colors.inputFieldEditProfile,
    width: Sizes.width * 0.42,
    marginLeft: -5,
    color: Colors.black,
  },
  Input: {
    borderBottomColor: Colors.inputFieldEditProfile,
    marginTop: -10,
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
  Picker: {
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
    width: "95%",
    alignSelf: "center",
    marginBottom: 5,
  },
  PickerText: {
    fontSize: 18,
    marginStart: 5,
  },
  main_view_flag: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: 'flex-end',
    paddingRight: 20,
    paddingLeft: 20,
    paddingVertical: 10,
    // marginTop: 20,
  },
  flag_text_detail: {
    color: "#333232",
    fontSize: 16,
    fontFamily: "Ubuntu-Regular",
  },
  Notifications_title: {
    fontFamily: "Ubuntu-Regular",
    fontSize: 20,
    color: "#000",
  },
  search_bar: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#000",
    borderTopWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  notification_header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: Colors.orange,
    paddingTop: 20,
    paddingBottom: 20,
  },
});
