import React,{useEffect} from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import Header from "../../Components/Header";
import { Colors, FontFamily } from "../../Constants/Constants";
import config from "../../Constants/config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Notifications_Details = ({ route, navigation }) => {
  console.log(route, "props in noti details");
  let obj = route?.params?.data?.item;
  console.log(obj, "obj");

  useEffect(() => {
    if (obj?.advertisement_id && obj?.booking_id) {
      getAdvertismentDetails();
    }
  }, [obj]);

  const getAdvertismentDetails = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl +
      "/advertisement_details.php?user_id_post=" +
      parsedInfo.id +
      "&advertisement_id=" +
      obj.advertisement_id +
      "&booking_id=" +
      obj.booking_id;

    console.log(url, "url on api calling");
    axios
      .get(url)
      .then((res) => {
        console.log(res, "view ad on notificaton");
        if (res) {
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header backBtn={true} name="Notifications" />
      <View style={sb.SEC2}>
        <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
          <ScrollView>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{ height: 50, width: 50, borderRadius: 10 }}
                  source={{ uri: config.imageUrl + obj?.user_image }}
                />
                <Text
                  style={{
                    fontFamily: FontFamily.semi_bold,
                    fontSize: 16,
                    marginLeft: 7,
                  }}
                >
                  {obj?.user_name}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: FontFamily.default,
                  color: "rgba(153, 153, 153, 1)",
                }}
              >
                5m ago
              </Text>
            </View>
            <View style={{ marginVertical: 20 }}>
              <Text
                style={{
                  fontFamily: FontFamily.default,
                  fontSize: 12,
                  color: "rgba(0, 0, 0, 0.58)",
                }}
              >
                You have recieved booking #7451250556561
              </Text>
            </View>
            <View style={sb.DIVIDER} />
            {obj && obj.action == "new_booking" && (
              <>
                <View style={{ marginVertical: 10 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: FontFamily.semi_bold,
                      marginVertical: 10,
                    }}
                  >
                    Booking Details :
                  </Text>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Customer Name :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>{obj?.user_name}</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Book date :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>28-02-2021</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Trip time :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>8:00 PM</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Number of guests :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>123456</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Trip hours :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>2hr</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Extra hours :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>1hr</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Equipment :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>Cupidatat reprehenderit</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Entertainment :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>Ipsum officia amet</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Food :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>Food</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Boat Place :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>Kuwait</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Trip Destination :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>Ea amet non aliquip</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Trip type :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>Ex sint in cupidata</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Discount :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>50%</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Coupon discount :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>30%</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Total price :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>3000</Text>
                    </View>
                  </View>

                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Extra requests :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>Velit cillum aute eiusmod</Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
      {/*  */}
      <View
        style={{
          position: "absolute",
          alignItems: "center",
          width: "100%",
          bottom: 10,
        }}
      >
        {obj && obj.advertisement_id != null && obj.booking_id != null && (
          <View style={sb.btn_1}>
            <TouchableOpacity
              style={[
                sb.btn1,
                { borderColor: Colors.orange, backgroundColor: Colors.white },
              ]}
              onPress={() => navigation.goBack(null)}
              activeOpacity={0.8}
            >
              <Text style={[sb.btn1Text, { color: Colors.orange }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                sb.btn1,
                { borderColor: Colors.orange, backgroundColor: Colors.orange },
              ]}
              onPress={() => {
                navigation.navigate("viewAdd", {
                  item: obj,
                });
              }}
              activeOpacity={0.8}
            >
              <Text style={[sb.btn1Text, { color: Colors.white }]}>
                Open Reservation
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
const sb = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    marginTop: -120,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
  },
  DIVIDER: {
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.5)",
  },
  style1: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
    alignItems: "center",
  },
  parameters: {
    fontFamily: FontFamily.semi_bold,
    fontSize: 12,
  },
  values: {
    fontFamily: FontFamily.default,
    fontSize: 12,
    // textAlign:"left"
    justifyContent: "flex-end",
    alignSelf: "flex-start",
  },
  style2: {
    width: 200,
  },
  btn1: {
    height: 48,
    width: 170,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    elevation: 2,
    borderWidth: 1,
  },
  btn1Text: {
    fontSize: 15,
    fontFamily: FontFamily.semi_bold,
  },
  btn_1: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
});

export default connect(mapStateToProps)(Notifications_Details);
