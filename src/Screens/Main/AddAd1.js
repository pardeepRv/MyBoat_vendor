import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { connect, useDispatch } from "react-redux";
import I18n from "../../Translations/i18";
import DatePicker from "react-native-datepicker";
import { Icon, Input } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../Components/Header";
import { back_img, Colors, FontFamily, Sizes } from "../../Constants/Constants";
import { useNavigation } from "@react-navigation/core";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import axios from "axios";
import config from "../../Constants/config";
import { TextInput } from "react-native-gesture-handler";
import { CallApi } from "../../config/callApi";
import moment from "moment";
const width = Dimensions.get("window").width;
class AddAd1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      equibments: [],
      equibmentsCheck: [],
      food: [],
      foodCheck: [],
      entainment: [],
      entainmentCheck: [],
      destination: [],
      destinationCheck: [],
      openTime: props?.route?.params?.data?.trip_time_start
        ? new Date(JSON.parse(props?.route?.params?.data?.trip_time_start))
        : new Date(),
      showOpenTime: false,
      closeTime: props?.route?.params?.data?.trip_time_end
        ? new Date(JSON.parse(props?.route?.params?.data?.trip_time_end))
        : new Date(),
      showCloseTime: false,
      fixedTime:
        props?.route?.params?.data?.trip_time_type === 2 &&
        props?.route?.params?.data?.trip_time_start !== null
          ? new Date(JSON.parse(props?.route?.params?.data?.trip_time_start))
          : new Date(),
      showFixedTime: false,
      date: new Date(),
      equibTextInput: [],
      equibIds: [],
      entainmentTextInput: [],
      entainmentIds: [],
      foodTextInput: [],
      foodIds: [],
      destinationTextInput: [],
      destinationIds: [],
      Free_Cancel_Days:
        JSON.stringify(props?.route?.params?.data?.free_cancel_days) || "",
      userId: "",
      tripTimeType:
        JSON.stringify(props?.route?.params?.data?.trip_time_type) === "1"
          ? "open"
          : "fixed", // fixed open : 2, fixed :1
      addType:
        props?.route?.params?.data?.adver_boat_type == 2 ? "public" : "private",
      addon_arr: props?.route?.params?.data?.addon_arr || [],
      destination_arr: props?.route?.params?.data?.destination_arr || [],
      mainLoader: true,
    };
    this.equipmentsRefArray = [];
    this.destinationRefArray = [];
    this.entertainmentRefArray = [];
    this.foodRefArray = [];
  }

  async componentDidMount() {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);

    this.setState({ userId: parsedInfo.id });
    this.addOnData();
  }
  getPreferenceDetails() {
    const langId = parseInt(this.props.language_id);
    let foodDetails =
      this.state.addon_arr !== "NA" &&
      this.state.addon_arr?.length &&
      this.state.addon_arr.filter((item) => item.addon_name[0] === "Food");

    let entertainmentDetails =
      this.state.addon_arr !== "NA" &&
      this.state.addon_arr?.length &&
      this.state.addon_arr.filter(
        (item) => item.addon_name[0] === "entertainment"
      );
    let equipmentDetails =
      this.state.addon_arr !== "NA" &&
      this.state.addon_arr?.length &&
      this.state.addon_arr.filter((item) => {
        if (item.addon_name[0] === "Equipment ") return item;
      });

    if (
      equipmentDetails[0]?.addon_products?.length &&
      equipmentDetails[0]?.addon_products !== "NA"
    ) {
      equipmentDetails[0]?.addon_products.map((item) => {
        this.state.equibments?.length &&
          this.state.equibments.map((innerItem, index) => {
            if (innerItem.addon_product_id == item.addon_product_id) {
              innerItem.onCheck = 1;
              this.state.equibTextInput[index] = JSON.stringify(
                item.addon_product_price
              );
              this.state.equibIds[index] = JSON.stringify(
                item.addon_product_id
              );
            }
          });
      });
    }
    if (
      foodDetails[0]?.addon_products?.length &&
      foodDetails[0]?.addon_products !== "NA"
    ) {
      foodDetails[0]?.addon_products.map((item) => {
        this.state.food?.length &&
          this.state.food.map((innerItem, index) => {
            if (innerItem.addon_product_id == item.addon_product_id) {
              innerItem.onCheck = 1;
              this.state.foodTextInput[index] = JSON.stringify(
                item.addon_product_price
              );
              this.state.foodIds[index] = JSON.stringify(item.addon_product_id);
            }
          });
      });
    }
    if (
      entertainmentDetails[0]?.addon_products?.length &&
      entertainmentDetails[0]?.addon_products !== "NA"
    ) {
      entertainmentDetails[0]?.addon_products.map((item) => {
        this.state.entainment?.length &&
          this.state.entainment.map((innerItem, index) => {
            if (innerItem.addon_product_id == item.addon_product_id) {
              innerItem.onCheck = 1;
              this.state.entainmentTextInput[index] = JSON.stringify(
                item.addon_product_price,
                (this.state.entainmentIds[index] = JSON.stringify(
                  item.addon_product_id
                ))
              );
            }
          });
      });
    }
    this.state.destination_arr !== "NA" &&
      this.state.destination_arr?.length &&
      this.state.destination_arr.map((item) => {
        this.state.destination?.length &&
          this.state.destination.map((innerItem, index) => {
            if (item.destination_id === innerItem.destination_id) {
              innerItem.onCheck = 1;
              this.state.destinationIds[index] = innerItem.destination_id;
              this.state.destinationTextInput[index] = JSON.stringify(
                Math.trunc(item.price)
              );
            }
          });
      });

    this.setState({
      equibments: this.state.equibments,
      equibTextInput: this.state.equibTextInput,
      equibIds: this.state.equibIds,
      food: this.state.food,
      foodIds: this.state.foodIds,
      foodTextInput: this.state.foodTextInput,
      entainment: this.state.entainment,
      entainmentIds: this.state.entainmentIds,
      entainmentTextInput: this.state.entainmentTextInput,
      destination: this.state.destination,
      destinationIds: this.state.destinationIds,
      destinationTextInput: this.state.destinationTextInput,
    });
  }
  equibselectCheckBox = (index) => {
    const { equibments, equibTextInput } = this.state;
    if (this.state.equibments[index].onCheck) {
      this.state.equibIds[index] = "";
      this.state.equibTextInput[index] = "";
      this.state.equibments[index].onCheck = 0;
    } else {
      setTimeout(() => {
        this.equipmentsRefArray[index].focus();
      });
      this.state.equibments[index].onCheck = 1;
    }
    this.setState({
      equibments,
      equibTextInput,
      equibIds: this.state.equibIds,
    });
  };
  foodselectCheckBox = (index) => {
    const { food, foodTextInput, foodIds } = this.state;
    if (this.state.food[index].onCheck) {
      this.state.foodIds[index] = "";
      this.state.foodTextInput[index] = "";
      this.state.food[index].onCheck = 0;
    } else {
      setTimeout(() => {
        this.foodRefArray[index].focus();
      });
      this.state.food[index].onCheck = 1;
    }
    this.setState({ food, foodTextInput, foodIds });
  };
  entertainmentselectCheckBox = (index) => {
    const { entainment, entainmentTextInput, entainmentIds } = this.state;
    if (this.state.entainment[index].onCheck) {
      this.state.entainmentTextInput[index] = "";
      this.state.entainment[index].onCheck = 0;
      this.state.entainmentIds[index] = "";
    } else {
      setTimeout(() => {
        this.entertainmentRefArray[index].focus();
      });
      this.state.entainment[index].onCheck = 1;
    }

    this.setState({ entainment, entainmentTextInput, entainmentIds });
  };
  destinationselectCheckBox = (index) => {
    const { destination, destinationTextInput, destinationIds } = this.state;
    if (this.state.destination[index].onCheck) {
      this.state.destinationIds[index] = "";
      this.state.destinationTextInput[index] = "";
      this.state.destination[index].onCheck = 0;
    } else {
      setTimeout(() => {
        this.destinationRefArray[index].focus();
      });
      this.state.destination[index].onCheck = 1;
    }

    this.setState({ destination, destinationTextInput, destinationIds });
  };
  uncheckEquipmentsField = (index) => {
    this.state.equibments[index].onCheck = 0;
    this.setState({ equibments: this.state.equibments });
  };
  uncheckFoodField = (index) => {
    this.state.food[index].onCheck = 0;
    this.setState({ food: this.state.food });
  };
  uncheckEntertainmentField = (index) => {
    this.state.entainment[index].onCheck = 0;
    this.setState({ entainment: this.state.entainment });
  };
  uncheckDestinationField = (index) => {
    this.state.destination[index].onCheck = 0;
    this.setState({ destination: this.state.destination });
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
          this.setState(
            {
              food: res.data.addon_arr[0].addon_products,
              entainment: res.data.addon_arr[1].addon_products,
              equibments: res.data.addon_arr[2].addon_products,
              destination: res.data.destination_arr,
              mainLoader: false,
            },
            () => {
              if (this.props?.route?.params?.data?.addon_arr) {
                this.getPreferenceDetails();
              }
              this.state.food?.length &&
                this.state.food.forEach(() => {
                  this.foodRefArray.push(null);
                  this.state.foodTextInput.push("");
                  this.state.foodIds.push("");
                });
              this.state.entainment?.length &&
                this.state.entainment.forEach(() => {
                  this.entertainmentRefArray.push(null);
                  this.state.entainmentTextInput.push("");
                  this.state.entainmentIds.push("");
                });
              this.state.equibments?.length &&
                this.state.equibments.forEach(() => {
                  this.equipmentsRefArray.push(null);
                  this.state.equibTextInput.push("");
                  this.state.equibIds.push("");
                });
              this.state.destination?.length &&
                this.state.destination.forEach(() => {
                  this.destinationRefArray.push(null);
                  this.state.destinationTextInput.push("");
                  this.state.destinationIds.push("");
                });
            }
          );
        } else {
          if (this.props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
  };
  Addad = async () => {
    const props = this.props.route.params.data;
    const { openTime, tripTimeType, closeTime, fixedTime, addType } =
      this.state;
    var foodItems = this.state.foodTextInput;
    var entainmentItems = this.state.entainmentTextInput;
    var equibItems = this.state.equibTextInput;
    let equibIds = this.state.equibIds;
    let entainmentIds = this.state.entainmentIds;
    let destinationIds = this.state.destinationIds;
    let foodIds = this.state.foodIds;
    var destinationItems = this.state.destinationTextInput;

    foodItems = foodItems.filter(function (element) {
      return element?.length;
    });
    entainmentItems = entainmentItems.filter(function (element) {
      return element?.length;
    });
    equibItems = equibItems.filter(function (element) {
      return element?.length;
    });

    equibIds = equibIds?.length && equibIds.filter((item) => item && item);
    entainmentIds =
      entainmentIds?.length && entainmentIds.filter((item) => item && item);
    destinationIds =
      destinationIds?.length && destinationIds.filter((item) => item && item);
    foodIds = foodIds?.length && foodIds.filter((item) => item && item);
    destinationItems = destinationItems.filter(function (element) {
      return element?.length;
    });

    var idsArr = [];
    var priceArr = [];

    idsArr = foodIds.concat(entainmentIds, equibIds);
    priceArr = foodItems.concat(entainmentItems, equibItems);
    var images = props.images;
    images = images.filter(function (element) {
      return element !== null;
    });

    let url = config.apiUrl + "/advertisement_create.php";
    if (this.props.route?.params?.data?.advertisement_id) {
      url = config.apiUrl + "/advertisement_edit.php";
    }
    var data = new FormData();

    if (this.props?.route?.params?.data?.advertisement_id) {
      data.append(
        "advertisement_id_post",
        this.props?.route?.params?.data.advertisement_id
      );
    }
    data.append("user_id_post", this.state.userId);
    data.append("captain_eng", props.English_captain);
    data.append("captain_ar", props.Arbic_captain);
    data.append("mobile", props.Contact_number);
    data.append("trip_type_id", props.Trip_type);
    data.append("boat_id", props.Boat);
    data.append("no_of_people", props.Max_number_of_people);
    data.append("location_address", "Arabs");
    // data.append('location_lat', props.BoatLat);
    // data.append('location_lng', props.BoatLang);
    data.append("location_lat", 30.7046);
    data.append("location_lng", 76.7179);
    data.append("city", props.cityOfBoat);
    data.append("discription_ar", props.Description_arbic);
    data.append("discription_en", props.Description_engilsh);
    //data.append('rental_price', 25);
    data.append("extra_price", props.Extra_per_hour_price);
    data.append("minimum_hours", props.Minimum_hour);
    data.append("idle_hours", props.idle_hours);
    data.append("discount", props.Discount);
    data.append("coupon_code", props.Coupon_discount);
    data.append("coupon_discount", props.Coupon_discount_perct);
    if (tripTimeType === "open") {
      data.append("trip_time_type", "1");
      data.append("trip_time_start", JSON.stringify(openTime));
      data.append("trip_time_end", JSON.stringify(closeTime));
    } else {
      data.append("trip_time_type", "2");
      // data.append("trip_time_start", JSON.stringify(fixedTime));
      data.append("trip_time_start", "10:00:00");
    }
    data.append("adver_boat_type", addType === "public" ? 2 : 1);
    data.append("freeCancel_days", this.state.Free_Cancel_Days);
    // data.append('image', JSON.stringify(props.images));
    idsArr.forEach((item, index) => {
      data.append("addons[" + index + "]", item);
    });
    priceArr.forEach((item, index) => {
      data.append("prices[" + index + "]", item);
    });
    destinationIds.forEach((item, index) => {
      data.append("destinations[" + index + "]", item);
    });
    destinationItems.forEach((item, index) => {
      data.append("dest_prices[" + index + "]", item);
    });

    images.forEach((item, index) => {
      // data.append("image[" + index + "]", {
      //   uri: item,
      //   type: 'image/jpeg', // or photo.type
      //   name: 'imageName',
      // });
      data.append("image[" + index + "]", item);
    });
    data.append("manage_add_permission", 1);

    this.setState({ loader: true }, () => {
      if (this.state.tripTimeType === "open") {
        if (!this.timeValidation()) {
          this.setState({ loader: false });
          return;
        }
      }
      console.log(data, "data while creatin Ad");

      axios
        .post(url, data)
        .then((res) => {
          console.log(res, "res while creatin Ad");

          this.setState({ loader: false });
          if (res.data.success === "true") {
            this.props.navigation.navigate("Ad");
          } else {
            if (this.props.language_id == 0) alert(res.data.msg[0]);
            else alert(res.data.msg);
          }
        })
        .catch((err) => console.log(err));
    });
  };

  timeValidation = () => {
    const props = this.props.route.params.data;
    if (this.state.openTime > this.state.closeTime) {
      alert(I18n.translate("invalid_time_alert"));
      return false;
    }
    let hoursEnd = parseInt(
      moment(new Date(this.state.closeTime)).format("hh:mm:a").split(":")[0]
    );
    let isEndHoursPM =
      moment(new Date(this.state.closeTime)).format("hh:mm:a").split(":")[2] ===
      "pm"
        ? true
        : false;
    let isStartHoursPM =
      moment(new Date(this.state.openTime)).format("hh:mm:a").split(":")[2] ===
      "pm"
        ? true
        : false;
    if (isEndHoursPM !== isStartHoursPM) {
      hoursEnd += 12;
    }
    let hoursStart = parseInt(
      moment(new Date(this.state.openTime)).format("hh:mm:a").split(":")[0]
    );

    if (
      hoursEnd - hoursStart <
      parseInt(props.Minimum_hour) + parseInt(props.idle_hours)
    ) {
      alert(I18n.translate("invalid_duration"));
      return false;
    }
    return true;
  };

  render() {
    const {
      showCloseTime,
      showFixedTime,
      showOpenTime,
      closeTime,
      openTime,
      fixedTime,
      date,
      tripTimeType,
      addType,
    } = this.state;
    console.log(this.state, "consoling");
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <Header imgBack={true} name={I18n.translate("add_ad")} backBtn={true} />
        <ScrollView
          style={{
            marginVertical: -30,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 30,
            backgroundColor: "#fff",
          }}
        >
          {this.state.mainLoader ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: Dimensions.get("window").height * 0.8,
              }}
            >
              <ActivityIndicator color={Colors.orange} size={60} />
              <Text style={{ fontSize: 20, fontFamily: FontFamily.bold }}>
                {I18n.translate("loading_addons")}
              </Text>
            </View>
          ) : (
            <View>
              <View style={{ marginHorizontal: 15 }}>
                <View style={{ marginVertical: 15 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                    {I18n.translate("trip_time")}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      {tripTimeType === "open" ? (
                        <Fontisto
                          // onPress={() => this.setState({tripTimeType: 'open'})}
                          name="radio-btn-active"
                          size={25}
                          color={Colors.orange}
                          style={{
                            alignSelf: "center",
                            marginEnd: 5,
                          }}
                        />
                      ) : (
                        <Fontisto
                          onPress={() => {
                            if (this.state.addType === "public") {
                              alert(
                                "Open time not available for Public trips!"
                              );
                            } else {
                              this.setState({ tripTimeType: "open" });
                            }
                          }}
                          name="radio-btn-passive"
                          size={25}
                          color={Colors.orange}
                          style={{
                            alignSelf: "center",
                            marginEnd: 5,
                          }}
                        />
                      )}
                      <Text>{I18n.translate("open_time")}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ showOpenTime: !showOpenTime })
                      }
                    >
                      <Text>{moment(openTime).format("hh:mm a")}</Text>
                    </TouchableOpacity>
                    {showOpenTime && tripTimeType === "open" && (
                      <DateTimePicker
                        value={openTime}
                        mode={"time"}
                        is24Hour={true}
                        display="spinner"
                        onChange={(event, selectedDate) => {
                          var currentDate = selectedDate || date;
                          this.setState({
                            showOpenTime: false,
                            openTime: currentDate,
                          });
                        }}
                      />
                    )}
                    <Text>{I18n.translate("to")}</Text>
                    <TouchableOpacity
                      onPress={() => this.setState({ showCloseTime: true })}
                    >
                      <Text>{moment(closeTime).format("hh:mm a")}</Text>
                    </TouchableOpacity>
                    {showCloseTime && tripTimeType === "open" && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={closeTime}
                        mode={"time"}
                        is24Hour={true}
                        display="spinner"
                        onChange={(event, selectedDate) => {
                          var currentDate = selectedDate || date;
                          this.setState({
                            showCloseTime: false,
                            closeTime: currentDate,
                          });
                        }}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      {tripTimeType === "fixed" ? (
                        <Fontisto
                          onPress={() =>
                            this.setState({ tripTimeType: "fixed" })
                          }
                          name="radio-btn-active"
                          size={25}
                          color={Colors.orange}
                          style={{
                            alignSelf: "center",
                            marginEnd: 5,
                          }}
                        />
                      ) : (
                        <Fontisto
                          onPress={() =>
                            this.setState({ tripTimeType: "fixed" })
                          }
                          name="radio-btn-passive"
                          size={25}
                          color={Colors.orange}
                          style={{
                            alignSelf: "center",
                            marginEnd: 5,
                          }}
                        />
                      )}
                      <Text>{I18n.translate("fixed_time")}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ showFixedTime: !showFixedTime })
                      }
                    >
                      <Text>{moment(fixedTime).format("hh:mm a")}</Text>
                    </TouchableOpacity>
                    {showFixedTime && tripTimeType === "fixed" && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={fixedTime}
                        mode={"time"}
                        // is24Hour={true}
                        display="spinner"
                        onChange={(event, selectedDate) => {
                          var currentDate = selectedDate || date;
                          this.setState({
                            showFixedTime: false,
                            fixedTime: currentDate,
                          });
                        }}
                      />
                    )}
                  </View>
                </View>
                <View style={{ marginTop: 5 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                    {I18n.translate("equipments")}
                  </Text>
                  <FlatList
                    data={this.state.equibments}
                    numColumns={2}
                    columnWrapperStyle={{
                      justifyContent: "space-around",
                      marginVertical: 5,
                    }}
                    renderItem={({ item, index }) => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            width: "48%",
                            justifyContent: "space-around",
                          }}
                        >
                          <Text style={{ width: "32%", alignSelf: "center" }}>
                            {this.props.language_id == 0
                              ? item.addon_product_name[0]
                              : item.addon_product_name[1]}
                          </Text>
                          <TextInput
                            style={{
                              borderWidth: 0.5,
                              width: "22%",
                              height: 40,
                              alignSelf: "center",
                            }}
                            ref={(ref) => {
                              this.equipmentsRefArray[index] = ref;
                            }}
                            value={this.state.equibTextInput[index]}
                            keyboardType={"number-pad"}
                            editable={item.onCheck === 1 ? true : false}
                            onChangeText={(text) => {
                              let { equibTextInput } = this.state;
                              equibTextInput[index] = text;
                              this.setState({
                                equibTextInput,
                              });
                            }}
                            onEndEditing={(text) => {
                              if (!this.state.equibTextInput[index].length) {
                                alert("Invalid Input");
                                this.uncheckEquipmentsField(index);
                              } else {
                                this.state.equibIds[index] = JSON.stringify(
                                  this.state.equibments[index]?.addon_product_id
                                );
                                this.setState({
                                  equibIds: this.state.equibIds,
                                });
                              }
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              this.equibselectCheckBox(index);
                            }}
                          >
                            {item.onCheck === 1 ? (
                              <Ionicons
                                name="checkbox" //checkbox
                                style={{ fontSize: 30, color: Colors.orange }}
                              />
                            ) : (
                              <Ionicons
                                name="square-outline"
                                style={{ fontSize: 30, color: Colors.orange }}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                    keyExtractor={(i, ind) => ind}
                    style={{
                      marginTop: 30,
                    }}
                    contentInsetAdjustmentBehavior="automatic"
                  />
                </View>
                <View style={{ marginTop: 5 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                    {I18n.translate("food")}
                  </Text>
                  <FlatList
                    data={this.state.food}
                    numColumns={2}
                    columnWrapperStyle={{
                      justifyContent: "space-around",
                      marginVertical: 5,
                    }}
                    renderItem={({ item, index }) => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            width: "48%",
                            justifyContent: "space-around",
                          }}
                        >
                          <Text style={{ width: "32%", alignSelf: "center" }}>
                            {this.props.language_id == 0
                              ? item.addon_product_name[0]
                              : item.addon_product_name[1]}
                          </Text>
                          <TextInput
                            style={{
                              borderWidth: 0.5,
                              width: "22%",
                              height: 40,
                              alignSelf: "center",
                            }}
                            ref={(ref) => {
                              this.foodRefArray[index] = ref;
                            }}
                            value={this.state.foodTextInput[index]}
                            keyboardType={"number-pad"}
                            editable={item.onCheck === 1 ? true : false}
                            onChangeText={(text) => {
                              let { foodTextInput } = this.state;
                              foodTextInput[index] = text;
                              this.setState({
                                foodTextInput,
                              });
                            }}
                            onEndEditing={(text) => {
                              if (!this.state.foodTextInput[index].length) {
                                alert("Invalid Input");
                                this.uncheckFoodField(index);
                              } else {
                                this.state.foodIds[index] = JSON.stringify(
                                  this.state.food[index]?.addon_product_id
                                );
                                this.setState({ foodIds: this.state.foodIds });
                              }
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              this.foodselectCheckBox(index);
                            }}
                          >
                            {item.onCheck === 1 ? (
                              <Ionicons
                                name="checkbox" //checkbox
                                style={{ fontSize: 30, color: Colors.orange }}
                              />
                            ) : (
                              <Ionicons
                                name="square-outline"
                                style={{ fontSize: 30, color: Colors.orange }}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                    keyExtractor={(i, ind) => ind}
                    style={{
                      marginTop: 30,
                    }}
                    contentInsetAdjustmentBehavior="automatic"
                  />
                </View>
                <View style={{ marginTop: 5 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                    {I18n.translate("entertainment")}
                  </Text>
                  <FlatList
                    data={this.state.entainment}
                    numColumns={2}
                    columnWrapperStyle={{
                      justifyContent: "space-around",
                      marginVertical: 5,
                    }}
                    renderItem={({ item, index }) => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            width: "48%",
                            justifyContent: "space-around",
                          }}
                        >
                          <Text style={{ width: "32%", alignSelf: "center" }}>
                            {this.props.language_id == 0
                              ? item.addon_product_name[0]
                              : item.addon_product_name[1]}
                          </Text>
                          <TextInput
                            style={{
                              borderWidth: 0.5,
                              width: "22%",
                              height: 40,
                              alignSelf: "center",
                            }}
                            ref={(ref) => {
                              this.entertainmentRefArray[index] = ref;
                            }}
                            value={this.state.entainmentTextInput[index]}
                            keyboardType={"number-pad"}
                            editable={item.onCheck === 1 ? true : false}
                            onChangeText={(text) => {
                              let { entainmentTextInput } = this.state;
                              entainmentTextInput[index] = text;
                              this.setState({
                                entainmentTextInput,
                              });
                            }}
                            onEndEditing={(text) => {
                              if (
                                !this.state.entainmentTextInput[index].length
                              ) {
                                alert("Invalid Input");
                                this.uncheckEntertainmentField(index);
                              } else {
                                this.state.entainmentIds[index] =
                                  JSON.stringify(
                                    this.state.entainment[index]
                                      ?.addon_product_id
                                  );
                                this.setState({
                                  entainmentIds: this.state.entainmentIds,
                                });
                              }
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              this.entertainmentselectCheckBox(index);
                            }}
                          >
                            {item.onCheck === 1 ? (
                              <Ionicons
                                name="checkbox" //checkbox
                                style={{ fontSize: 30, color: Colors.orange }}
                              />
                            ) : (
                              <Ionicons
                                name="square-outline"
                                style={{ fontSize: 30, color: Colors.orange }}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                    keyExtractor={(i, ind) => ind}
                    style={{
                      marginTop: 30,
                    }}
                    contentInsetAdjustmentBehavior="automatic"
                  />
                </View>
                <View style={{ marginTop: 5 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                    {I18n.translate("destination")}
                  </Text>
                  <FlatList
                    data={this.state.destination}
                    numColumns={2}
                    columnWrapperStyle={{
                      justifyContent: "space-around",
                      marginVertical: 5,
                    }}
                    renderItem={({ item, index }) => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            width: "48%",
                            justifyContent: "space-around",
                          }}
                        >
                          <Text
                            style={{
                              width: "32%",
                              alignSelf: "center",
                              alignSelf: "center",
                            }}
                          >
                            {this.props.language_id == 0
                              ? item.destination[0]
                              : item.destination[1]}
                          </Text>
                          <TextInput
                            ref={(ref) => {
                              this.destinationRefArray[index] = ref;
                            }}
                            style={{
                              borderWidth: 0.5,
                              width: "22%",
                              height: 40,
                              alignSelf: "center",
                            }}
                            keyboardType={"number-pad"}
                            value={this.state.destinationTextInput[index]}
                            editable={item.onCheck ? true : false}
                            onChangeText={(text) => {
                              let { destinationTextInput } = this.state;
                              destinationTextInput[index] = text;
                              this.setState({
                                destinationTextInput,
                              });
                            }}
                            onEndEditing={(text) => {
                              if (
                                !this.state.destinationTextInput[index].length
                              ) {
                                alert(I18n.translate("invalid_input"));
                                this.uncheckDestinationField(index);
                              } else {
                                this.state.destinationIds[index] =
                                  JSON.stringify(
                                    this.state.destination[index]
                                      ?.destination_id
                                  );
                                this.setState({
                                  destinationIds: this.state.destinationIds,
                                });
                              }
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              this.destinationselectCheckBox(index);
                            }}
                          >
                            {item.onCheck === 1 ? (
                              <Ionicons
                                name="checkbox"
                                style={{ fontSize: 30, color: Colors.orange }}
                              />
                            ) : (
                              <Ionicons
                                name="square-outline"
                                style={{ fontSize: 30, color: Colors.orange }}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                    keyExtractor={(i, ind) => ind}
                    style={{
                      marginTop: 30,
                    }}
                    contentInsetAdjustmentBehavior="automatic"
                  />
                </View>
                <View style={{ marginTop: 5 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                    {I18n.translate("ad_type")}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        width: "48%",
                        justifyContent: "space-around",
                      }}
                    >
                      <Text
                        style={{
                          width: "32%",
                          alignSelf: "center",
                          alignSelf: "center",
                        }}
                      >
                        {I18n.translate("public")}
                      </Text>
                      {addType === "public" ? (
                        <Fontisto
                          //onPress={() => this.setState({addType: 'public'})}
                          name="radio-btn-active"
                          size={25}
                          color={Colors.orange}
                          style={{
                            alignSelf: "center",
                          }}
                        />
                      ) : (
                        <Fontisto
                          onPress={() => {
                            if (tripTimeType === "open") {
                              alert(I18n.translate("open_time_not_available"));
                            } else {
                              this.setState({ addType: "public" });
                            }
                          }}
                          name="radio-btn-passive"
                          size={25}
                          color={Colors.orange}
                          style={{
                            alignSelf: "center",
                          }}
                        />
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "48%",
                        justifyContent: "space-around",
                      }}
                    >
                      <Text
                        style={{
                          width: "32%",
                          alignSelf: "center",
                          alignSelf: "center",
                        }}
                      >
                        {I18n.translate("private")}
                      </Text>
                      {addType === "private" ? (
                        <Fontisto
                          //onPress={() => this.setState({addType: 'private'})}
                          name="radio-btn-active"
                          size={25}
                          color={Colors.orange}
                          style={{
                            alignSelf: "center",
                          }}
                        />
                      ) : (
                        <Fontisto
                          onPress={() => this.setState({ addType: "private" })}
                          name="radio-btn-passive"
                          size={25}
                          color={Colors.orange}
                          style={{
                            alignSelf: "center",
                          }}
                        />
                      )}
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    marginTop: 15,
                    marginBottom: 10,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Text>{I18n.translate("free_cancel")}</Text>
                  <TextInput
                    value={this.state.Free_Cancel_Days}
                    style={{
                      borderWidth: 1,
                      height: 40,
                      width: 60,
                      marginHorizontal: 10,
                    }}
                    keyboardType={"number-pad"}
                    onChangeText={(Free_Cancel_Days) =>
                      this.setState({ Free_Cancel_Days })
                    }
                  />
                  <Text>{I18n.translate("days")}</Text>
                </View>
              </View>
              <View style={{ marginBottom: 30 }}>
                <TouchableOpacity onPress={() => this.Addad()} style={s.btn1}>
                  <Text style={s.btn1Text}>
                    {this.props?.route?.params?.data?.advertisement_id
                      ? I18n.translate("update")
                      : I18n.translate("submit")}
                  </Text>
                  {this.state.loader ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : null}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
});

export default connect(mapStateToProps)(AddAd1);
const s = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    marginTop: -120,
    borderRadius: 10,
    height: 150,
    width: "90%",
    alignSelf: "center",
    overflow: "hidden",
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
    flexDirection: "row",
  },
  btn1Text: {
    fontSize: 20,
    fontFamily: FontFamily.semi_bold,
    color: Colors.white,
  },
});
