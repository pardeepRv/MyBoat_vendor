import React, { useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {  useSelector} from "react-redux";
import Header from "../../Components/Header";
import { Colors, FontFamily } from "../../Constants/Constants";
import config from "../../Constants/config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import I18n from "../../Translations/i18";


const Notifications_Details = ({ route, navigation } ) => {
  console.log(route, "props in noti details");
  let language_id = useSelector(state => state.data_Reducer);
console.log('laungugageid', language_id)
  let obj = route?.params?.data?.item;
  console.log(navigation, "obj");

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
                {obj?.booking_details?.booking_arr?.createtime_ago}
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
                {obj.message[0]}
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
{I18n.translate("booking_details") }
                  </Text>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>{I18n.translate("Book_date")}</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}> {obj?.user_name}</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>{I18n.translate("Trip_time")}</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>
                        {obj?.booking_details?.booking_arr?.date}
                      </Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>{I18n.translate("Trip_time")}</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>
                        {obj?.booking_details?.booking_arr?.time}
                      </Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>{I18n.translate("no_of_guest")}</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>
                        {obj?.booking_details?.booking_arr?.no_of_guest}
                      </Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>{I18n.translate("trip_hours")}</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>
                        {obj?.booking_details?.booking_arr?.minimum_hours} hr
                      </Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>{I18n.translate("extra_hours_view_add")}</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>
                        {obj?.booking_details?.booking_arr?.extra_time} hr
                      </Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>{I18n.translate("equipment")} :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>Equipment</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>{I18n.translate("entertainment")} :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>Entertainment</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>{I18n.translate("food")} :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>Food</Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>{I18n.translate("boat_place")} :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>
                        {obj?.booking_details?.booking_arr?.location_address}
                      </Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Trip {I18n.translate("discount")}:</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>
                        {obj?.booking_details?.booking_arr?.location_address}
                      </Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>Trip type :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>
                        {obj?.booking_details?.booking_arr?.trip_name[0]}
                      </Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>{I18n.translate("coupon_discount")} :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>
                        {obj?.booking_details?.booking_arr?.discount} %
                      </Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>{I18n.translate("coupon_discount")} :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}></Text>
                    </View>
                  </View>
                  <View style={sb.style1}>
                    <Text style={sb.parameters}>{I18n.translate("total_amt")}:</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>
                        kD {obj?.booking_details?.booking_arr?.total_amt}
                      </Text>
                    </View>
                  </View>

                  <View style={sb.style1}>
                    <Text style={sb.parameters}>{I18n.translate("extraresuesr")} :</Text>
                    <View style={sb.style2}>
                      <Text style={sb.values}>No Request</Text>
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


export default Notifications_Details;
