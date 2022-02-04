import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AirbnbRating } from "react-native-elements";
import { connect } from "react-redux";
import config from "../../Constants/config";
import { Colors, FontFamily } from "../../Constants/Constants";
import I18n from "../../Translations/i18";
import MyCarousel from "./carousel";
class ViewAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.route.params.item.advertisement_id,
      boatDetails: null,
      item: null,
      tripTypeDropdown: [],
      img_arr: [],
      foodCount: 0,
      equipmentsCount: 0,
      entertainmentCount: 0,
      cabinsCount: 0,
      toiletCount: 0,
      numberOfPeople: 0,
      destinationPrices: 0,
      destinations: "",
      loader: true,
      tripHours: 0,
      endTime: new Date(),
      startTime: new Date(),
      boat_brand: "",
    };
    this.addOnData();
    this.getAdvertismentDetails();
  }
  componentDidMount() {
    StatusBar.setTranslucent(true);
    StatusBar.setBarStyle("light-content");
    StatusBar.setBackgroundColor("transparent");
    setTimeout(() => {
      this.setState({ loader: !this.state.loader });
    }, 1000);
    this.getBoatDetails(this.state.item?.boat_id);
  }
  getAdvertismentDetails = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl +
      "/advertisement_details.php?user_id_post=" +
      parsedInfo.id +
      "&advertisement_id=" +
      this.state.id;
    axios
      .get(url)
      .then((res) => {
        console.log(res, "view ad");
        if (res) {
          this.setState(
            {
              item: res.data.adver_arr,
              img_arr: res.data.adver_arr?.img_arr,
              cabinsCount: res.data.adver_arr?.boat_cabins,
              toiletCount: res.data.adver_arr?.boat_toilets,
              numberOfPeople: res.data.adver_arr?.no_of_people,
              boat_brand: this.props.route.params.item?.boat_brand,
              // boatDropdown: res.data.boat_arr,
              // cityDropdown: res.data.city_arr,
            },
            () => {
              if (this.state.item?.trip_time_end !== "NA") {
                this.getTimeDifferenceInHours(
                  new Date(JSON.parse(this.state.item?.trip_time_end)),
                  new Date(JSON.parse(this.state.item?.trip_time_start))
                );
              } else {
                // let startTime = moment(
                //   new Date(JSON.parse(this.state.item?.trip_time_start)),
                // ).format('hh:mm a');

                let startTime = this.state.item?.trip_time_start;

                this.setState({
                  startTime: startTime,
                });
              }

              this.getDestinationDetails();
              this.getPreferencesDetails();
            }
          );
        } else {
          if (this.props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
          console.log(res.data.success);
        }
      })
      .catch((err) => console.log(err));
  };
  getDestinationDetails() {
    let destinations = "";
    let destinationPrices = "";
    if (
      this.state.item.destination_arr &&
      this.state.item.destination_arr.length &&
      this.state.item.destination_arr !== "NA"
    ) {
      this.state.item?.destination_arr.map((item, index) => {
        if (index === this.state.item?.destination_arr.length - 1) {
          destinations +=
            this.props.language_id == 0
              ? item?.destination[0]
              : item?.destination[1];
          destinationPrices += Math.trunc(item?.price);
        } else {
          destinations =
            this.props.language_id == 0
              ? item?.destination[0]
              : item?.destination[1] + ",";
          destinationPrices += Math.trunc(item?.price) + ",";
        }
      });
    }
    let destinationPricesArr = destinationPrices.split(",");
    //console.log('des====', destinationArr);
    //let destinationArr = destinations.split(',');
    destinationPricesArr = destinationPricesArr.map((item) => parseInt(item));

    let price = destinationPricesArr[0];
    destinationPricesArr.filter((item) => {
      if (item < price) price = item;
    });

    let lowestIndex = 0;
    destinationPricesArr.map((item, index) => {
      if (item == price) lowestIndex = index;
    });
    let lowestPrice = destinationPricesArr[lowestIndex];

    this.setState({
      destinationPrices: lowestPrice,
      destinations,
    });
  }
  getPreferencesDetails() {
    let foodDetails =
      (this.state.item?.addon_arr !== "NA" &&
        this.state.item?.addon_arr?.length &&
        this.state.item?.addon_arr.filter(
          (item) => item.addon_product_name[0] === "Food"
        )) ||
      [];
    let entertainmentDetails =
      (this.state.item?.addon_arr !== "NA" &&
        this.state.item?.addon_arr?.length &&
        this.state.item?.addon_arr.filter(
          (item) => item.addon_product_name[0] === "entertainment"
        )) ||
      [];
    let equipmentDetails =
      (this.state.item?.addon_arr !== "NA" &&
        this.state.item?.addon_arr?.length &&
        this.state.item?.addon_arr.filter(
          (item) => item.addon_product_name[0] === "Equipment "
        )) ||
      [];
    this.setState({
      foodCount: foodDetails[0]?.count || 0,
      entertainmentCount: entertainmentDetails[0]?.count || 0,
      equipmentsCount: equipmentDetails[0]?.count || 0,
    });
  }

  addOnData = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl +
      "/boat_trip_type_for_add_advr.php?user_id_post=" +
      parsedInfo.id +
      "&country_code=965";
    axios
      .get(url)
      .then((res) => {
        if (res) {
          this.setState({
            tripTypeDropdown: res.data.trip_type_arr,
            // boatDropdown: res.data.boat_arr,
            // cityDropdown: res.data.city_arr,
          });
        } else {
          if (this.props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
          console.log(res.data.success);
        }
      })
      .catch((err) => console.log(err));
  };
  getTripTypeValue(id) {
    let tripTypeData =
      this.state.tripTypeDropdown?.length &&
      this.state.tripTypeDropdown.filter((item) => item.trip_type_id === id);
    if (this.props.language_id == 0) {
      return (
        (tripTypeData?.length &&
          tripTypeData[0]?.name[0] &&
          tripTypeData[0]?.name[0]) ||
        ""
      );
    }
    return (
      (tripTypeData?.length &&
        tripTypeData[0]?.name[1] &&
        tripTypeData[0]?.name[1]) ||
      ""
    );
  }

  async getBoatDetails(id) {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl +
      "/boat_details.php?user_id_post=" +
      parsedInfo.id +
      "&&boat_id_post=" +
      id;
    axios
      .get(url)
      .then((res) => {
        if (res.data.success === "true") {
          this.setState({ boatDetails: res.data?.boat_arr });
        } else {
          if (this.props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
  }
  getIcon(item) {
    switch (item?.item) {
      case 1:
        return (
          <Image
            source={require("../../Images/boatBrand.png")}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
        );

      case 2:
        return (
          <Image
            source={require("../../Images/boatBrand.png")}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
        );

      case 3:
        return (
          <Image
            source={require("../../Images/tripTime.png")}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
        );
      case 4:
        return (
          <Image
            source={require("../../Images/equipments.png")}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
        );
      case 5:
        return (
          <Image
            source={require("../../Images/entertainments.png")}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
        );
      case 6:
        return (
          <Image
            source={require("../../Images/food.png")}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
        );
      case 7:
        return (
          <Image
            source={require("../../Images/cabins.png")}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
        );
      case 8:
        return (
          <Image
            source={require("../../Images/guestQuantity.png")}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
        );
      case 9:
        return (
          <Image
            source={require("../../Images/toilet.png")}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
        );
      default:
        return (
          <Image
            source={require("../../Images/cabins.png")}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
        );
    }
  }

  getIconValues(item) {
    switch (item?.item) {
      case 1:
        return (
          <View>
            <Text style={styles.text}>{I18n.translate("boat_size")}</Text>
            <Text style={styles.text}>
              {`${this.state.item?.boat_length} ft` || 0}
            </Text>
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={styles.text}>{I18n.translate("boat_brand")}</Text>
            <Text style={styles.text}>{this.state.boat_brand}</Text>
          </View>
        );

      case 3:
        return (
          <View>
            <Text style={styles.text}>{I18n.translate("trip_hours")}</Text>
            <Text style={styles.text}>
              {this.state.item?.minimum_hours || 0}
            </Text>
          </View>
        );

      case 4:
        return (
          <View>
            <Text style={styles.text}>{I18n.translate("equipments")}</Text>
            <Text style={styles.text}>{this.state.equipmentsCount}</Text>
          </View>
        );
      case 5:
        return (
          <View>
            <Text style={styles.text}>{I18n.translate("entertainment")}</Text>
            <Text style={styles.text}>{this.state.entertainmentCount}</Text>
          </View>
        );
      case 6:
        return (
          <View>
            <Text style={styles.text}>{I18n.translate("food")}</Text>
            <Text style={styles.text}>{this.state.foodCount}</Text>
          </View>
        );
      case 7:
        return (
          <View>
            <Text style={styles.text}>{I18n.translate("cabin")}</Text>
            <Text style={styles.text}>{this.state.cabinsCount}</Text>
          </View>
        );
      case 8:
        return (
          <View>
            <Text style={styles.text}>{I18n.translate("guests")}</Text>
            <Text style={styles.text}>{this.state.numberOfPeople}</Text>
          </View>
        );
      case 9:
        return (
          <View>
            <Text style={styles.text}>{I18n.translate("toilet")}</Text>
            <Text style={styles.text}>{this.state.toiletCount}</Text>
          </View>
        );
      default:
        return (
          <View>
            <Text style={styles.text}>{I18n.translate("toilet")}</Text>
            <Text style={styles.text}>{this.state.toiletCount}</Text>
          </View>
        );
    }
  }
  goBack = () => {
    this.props.navigation.goBack();
  };
  getTimeDifferenceInHours = (endTime, startTime) => {
    // let endTimeCopy = endTime
    // let startTimeCopy = startTime
    let endTimeUpdated = "";
    if (endTime !== "NA") {
      endTimeUpdated = moment(endTime).format("hh:mm a");
    }

    let startTimeUpdated = moment(startTime).format("hh:mm a");
    // endTime = moment(endTime).format('hh:mm:a');
    // startTime = moment(startTime).format('hh:mm:a');
    // let isEndTimePm = endTime.split(':')[2] === 'pm' ? true : false;
    // let endTimeHour = parseInt(endTime.split(':')[0]);
    // let startTimeHour = parseInt(startTime.split(':')[0]);
    // if (isEndTimePm) {
    //   endTimeHour += 12;
    // }

    // let hourDiff = endTimeHour - startTimeHour || 0;
    this.setState({ endTime: endTimeUpdated, startTime: startTimeUpdated });
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        /> */}
        {/* <ImageBackground
          style={styles.ImageBackground}
          source={back_img}
          imageStyle={styles.ImageBackground_Img}
        /> */}

        <MyCarousel
          data={
            (this.props.route?.params?.item?.img_arr !== "NA" &&
              this.props.route?.params?.item?.img_arr) ||
            []
          }
          goBack={this.goBack}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.loader ? (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size={30} color={Colors.orange} />
            </View>
          ) : (
            <View>
              <View style={styles.adressbox}>
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#FFF4E4",
                    borderRadius: 5,
                    padding: 15,
                  }}
                >
                  <View
                    style={{ marginHorizontal: 15, justifyContent: "center" }}
                  >
                    <Image
                      style={{
                        height: 60,
                        width: 60,
                        borderRadius: 30,
                        resizeMode: "cover",
                        borderWidth: 1,
                        borderColor: "green",
                      }}
                      source={{
                        uri: config.imageUrl + this.state.item?.user_image,
                      }}
                      PlaceholderContent={
                        <ActivityIndicator
                          size={30}
                          color={Colors.orange}
                          style={{ alignSelf: "center" }}
                        />
                      }
                    />
                  </View>
                  <View style={{ marginStart: 15 }}>
                    <Text
                      style={{
                        // fontWeight: 'bold',
                        color: Colors.orange,
                        fontSize: 18,
                        fontFamily: FontFamily.semi_bold,
                      }}
                    >
                      {this.state.item?.boat_name}
                    </Text>

                    <AirbnbRating
                      showRating={false}
                      size={12}
                      isDisabled
                      defaultRating={this.state.item?.rating}
                      starContainerStyle={{ alignSelf: "flex-start" }}
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: FontFamily.semi_bold,
                        textAlign: "left",
                      }}
                    >
                      {this.props.language_id == 0
                        ? this.state.item?.captain_name[0] &&
                          this.state.item?.captain_name[0]
                        : (this.state.item?.captain_name[1] &&
                            this.state.item?.captain_name[1]) ||
                          ""}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  padding: 10,
                  margin: 15,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <View style={{ alignItems: "center", flex: 1 }}>
                  <View
                    style={{
                      backgroundColor: Colors.orange,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 35,
                      padding: 15,
                      height: 70,
                      width: 70,
                      paddingHorizontal: 20,
                      elevation: 4,
                    }}
                  >
                    <Image
                      source={require("../../Images/sail.png")}
                      style={{ height: 40, width: 25, resizeMode: "contain" }}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: FontFamily.default,
                      marginVertical: 3,
                    }}
                  >
                    {this.props.language_id == 0
                      ? this.state.item?.trip_type_name[0]
                      : this.state.item?.trip_type_name[1]}
                  </Text>
                </View>
                <View style={{ alignItems: "center", flex: 1 }}>
                  <View
                    style={{
                      backgroundColor: Colors.orange,
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 15,
                      borderRadius: 35,
                      elevation: 4,
                    }}
                  >
                    <Image
                      source={require("../../Images/locationViewAd.png")}
                      style={{ height: 40, width: 40, resizeMode: "contain" }}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: FontFamily.default,
                      marginVertical: 3,
                    }}
                  >
                    {this.props.language_id == 0
                      ? this.state.item?.city_name[0]
                      : this.state.item?.city_name[1]}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#FFF4E4",
                  padding: 10,
                  margin: 15,
                  borderRadius: 5,
                }}
              >
                <FlatList
                  style={{ width: "100%" }}
                  numColumns={3}
                  data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                  renderItem={(item, index) => {
                    return (
                      <View
                        style={{
                          width: Dimensions.get("window").width * 0.33,
                        }}
                      >
                        <View
                          style={{
                            marginHorizontal:
                              Dimensions.get("window").width * 0.07,
                            marginVertical: 5,
                            elevation: 4,
                            backgroundColor: "white",
                            //padding: 20,
                            width: 45,
                            height: 45,
                            borderRadius: 30,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {this.getIcon(item)}
                        </View>
                        <View
                          style={{
                            marginHorizontal: 5,
                            //backgroundColor: 'white',
                            padding: 5,
                            maxWidth: 120,
                            width: 100,
                            height: 35,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {this.getIconValues(item)}
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
              <View
                style={{
                  marginHorizontal: 15,
                  alignSelf: "flex-start",
                  borderRadius: 5,
                  padding: 10,
                }}
              >
                <Text
                  style={[
                    styles.text,
                    { marginBottom: 3, alignSelf: "flex-start", fontSize: 15 },
                  ]}
                >
                  {I18n.translate("description")}
                </Text>
                <Text
                  style={[
                    { fontFamily: FontFamily.default },
                    { textAlign: "left" },
                  ]}
                >
                  {this.props.language_id == 0
                    ? this.state.item?.discription_arr[0]
                    : this.state.item?.discription_arr[1]}
                </Text>
                <View
                  style={{
                    height: 0,
                    width: Dimensions.get("window").width * 0.9,
                    flexDirection: "row",
                    borderWidth: 1,
                    marginVertical: 15,
                    borderBottomWidth: 0,
                  }}
                ></View>
                <Text
                  style={[
                    styles.text,
                    { marginBottom: 3, alignSelf: "flex-start", fontSize: 15 },
                  ]}
                >
                  {I18n.translate("booking_details")}
                </Text>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <Text style={styles.adDetailsTextHeader}>
                    {I18n.translate("ad_type")}
                  </Text>
                  <Text style={styles.adDetailsTextHeader1}>
                    {this.state.item?.boat_type === 1
                      ? I18n.translate("private")
                      : I18n.translate("public")}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <Text style={styles.adDetailsTextHeader}>
                    {I18n.translate("trip_type")}
                  </Text>
                  <Text style={styles.adDetailsTextHeader1}>
                    {this.getTripTypeValue(this.state.item?.trip_type_id)}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <Text style={styles.adDetailsTextHeader}>
                    {I18n.translate("destination")}
                  </Text>
                  <Text style={styles.adDetailsTextHeader1}>
                    {this.state.destinations}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <Text style={styles.adDetailsTextHeader}>
                    {I18n.translate("boat_place")}
                  </Text>
                  <Text style={styles.adDetailsTextHeader1}>
                    {this.props.language_id == 0
                      ? this.state.item?.city_name[0]
                      : this.state.item?.city_name[1]}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <Text style={styles.adDetailsTextHeader}>
                    {I18n.translate("trip_price")}
                  </Text>
                  <Text
                    style={[styles.adDetailsTextHeader1, { textAlign: "left" }]}
                  >
                    {this.state.destinationPrices}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <Text style={styles.adDetailsTextHeader}>
                    {I18n.translate("extra_per_hour_view_ad")}
                  </Text>
                  <Text style={styles.adDetailsTextHeader1}>
                    {this.state.item?.extra_price}
                    {`${I18n.translate("kwd")}`}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <Text style={styles.adDetailsTextHeader}>
                    {I18n.translate("trip_time")}
                  </Text>
                  <Text
                    style={[styles.adDetailsTextHeader1, { textAlign: "left" }]}
                  >
                    {this.state.item?.trip_time_type === 1
                      ? this.state.startTime + " to " + this.state.endTime
                      : `${I18n.translate("fixed")}` + this.state.startTime}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <Text style={styles.adDetailsTextHeader}>
                    {I18n.translate("max_guests")}
                  </Text>
                  <Text
                    style={[styles.adDetailsTextHeader1, { textAlign: "left" }]}
                  >
                    {this.state.item?.no_of_people}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <Text style={styles.adDetailsTextHeader}>
                    {I18n.translate("trip_hours")}
                  </Text>
                  <Text style={styles.adDetailsTextHeader1}>
                    {`${this.state.item?.minimum_hours}` +
                      `${I18n.translate("hours")}`}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <Text style={styles.adDetailsTextHeader}>
                    {I18n.translate("extra_hours_view_add")}
                  </Text>
                  <Text style={styles.adDetailsTextHeader1}>
                    {I18n.translate("not_available")}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <Text style={styles.adDetailsTextHeader}>
                    {I18n.translate("equipments")}
                  </Text>
                  <Text style={styles.adDetailsTextHeader1}>
                    {this.state.equipmentsCount
                      ? I18n.translate("available")
                      : I18n.translate("not_available")}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <Text style={styles.adDetailsTextHeader}>
                    {I18n.translate("entertainment")}
                  </Text>
                  <Text style={styles.adDetailsTextHeader1}>
                    {!this.state.entertainmentCount
                      ? I18n.translate("available")
                      : I18n.translate("not_available")}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <Text style={styles.adDetailsTextHeader}>
                    {I18n.translate("food")}
                  </Text>
                  <Text style={styles.adDetailsTextHeader1}>
                    {this.state.foodCount
                      ? I18n.translate("available")
                      : I18n.translate("not_available")}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: Colors.orange,
                  height: 75,
                  marginHorizontal: 15,
                  borderRadius: 5,
                  marginVertical: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {}}
                      style={{
                        backgroundColor: "#fff",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 10,
                        paddingHorizontal: 25,
                        borderRadius: 20,
                        elevation: 3,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.orange,
                          fontSize: 16,
                          fontFamily: FontFamily.bold,
                        }}
                      >
                        {I18n.translate("book_now")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "flex-end",
                      justifyContent: "center",
                      paddingRight: 15,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontFamily: FontFamily.semi_bold,
                      }}
                    >
                      {I18n.translate("rental_price")}
                    </Text>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontFamily: FontFamily.semi_bold,
                      }}
                    >
                      {`${this.state.destinationPrices}` +
                        `${I18n.translate("kwd")}`}
                    </Text>
                  </View>
                </View>
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

export default connect(mapStateToProps)(ViewAdd);

const styles = StyleSheet.create({
  icontop: {
    marginTop: 20,
    marginStart: 10,
    flexDirection: "row",
    flexDirection: "row",
  },
  adDetailsTextHeader: {
    flex: 1,
    fontFamily: FontFamily.semi_bold,
  },
  adDetailsTextHeader1: {
    flex: 1,
    marginLeft: 20,
    fontFamily: FontFamily.default,
  },
  ImageBackground: {
    //height: '100%',
    //width: Sizes.width,
    backgroundColor: Colors.black,
    zIndex: -1,
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  ImageBackground_Img: {
    opacity: 0.5,
    // height:Sizes.height+100
  },
  text: {
    alignSelf: "center",
    color: "black",
    fontFamily: FontFamily.bold,
    fontSize: 10,
  },
  adressbox: {
    //height: 80,
    padding: 15,
    width: "100%",
    //marginHorizontal: 20,
    //width: '100%',
    backgroundColor: "#fff",
    //marginTop: 20,
    justifyContent: "center",
    alignSelf: "center",
  },
  addressimage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "green",
    borderWidth: 1,
  },
  thirdiconbox: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "orange",
  },
  border: {
    height: 40,
    width: 160,
    backgroundColor: "orange",
    elevation: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "orange",
    justifyContent: "center",
    alignItems: "center",
  },
});
