import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Icon } from "react-native-elements";
import { connect } from "react-redux";
import Header from "../../Components/Header";
import { Loading } from "../../Components/Loader";
import config from "../../Constants/config";
import { Colors, FontFamily } from "../../Constants/Constants";
import I18n from "../../Translations/i18";

const NotificationsPage = () => {
  const navigation = useNavigation();
  const [user_id_post, setUser_id_post] = useState(false);
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  // --------------------------------------- //
  const gotoNotifications_Details = ({ data }) => {
    navigation.navigate("Notifications_Details", { data });
  };
  useEffect(() => {
    getAllNotifications();
  }, []);

  const getAllNotifications = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    setUser_id_post(parsedInfo.id);
    setLoader(true);
    let url =
      config.apiUrl + "/notificationList.php?user_id_post=" + parsedInfo.id;
    axios
      .get(url)
      .then((res) => {
        setLoader(false);
        console.log(res, "res of notification");
        if (res.data.success === "true") {
          setData(res.data.notification_arr);
        } else {
          if (props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteNotification = async (type, id) => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    setLoader(true);
    let url =
      config.apiUrl +
      "/notificationDelete.php?user_id_post=" +
      parsedInfo.id +
      "&delete_type=" +
      type +
      "&notification_message_id=" +
      id;
    console.log(url, "url of notify");
    axios
      .get(url)
      .then((res) => {
        setLoader(false);
        console.log(res, "res of notification del");
        if (res?.data?.success === "true") {
          getAllNotifications();
          alert(res?.data?.msg[0]);
        } else {
          if (props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header backBtn={true} name={I18n.translate("notifications")} />
      {/* Clear */}
      <View style={{ position: "absolute", right: 30, top: 32 }}>
        <TouchableOpacity onPress={()=>deleteNotification('all',null)}>
          <Text
            style={{
              fontFamily: FontFamily.semi_bold,
              // textDecorationStyle: 'solid',
              textDecorationLine: "underline",
              color: Colors.white,
              //fontFamily: FontFamily.default,
              fontSize: 14,
              marginTop: 15,

              letterSpacing: 0.5,
            }}
          >
            {I18n.translate("clear")}
          </Text>
        </TouchableOpacity>
      </View>
      {/* SEC2 */}
      <View style={sb.SEC2}>
        {loader ? (
          <Loading />
        ) : (
          <View style={{ marginTop: 30 }}>
            {data === "NA" ? (
              <View style={{ alignItems: "center", marginTop: "10%" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#ccc" }}
                >
                  {I18n.translate("no_notification")}
                </Text>
              </View>
            ) : (
              <FlatList
                data={data === "NA" ? [] : data}
                keyExtractor={(item, ind) => ind}
                contentContainerStyle={{
                  paddingBottom: 15,
                }}
                renderItem={(item) => {
                  return (
                    <TouchableOpacity
                      onPress={() => gotoNotifications_Details({ data: item })}
                    >
                      <Card containerStyle={{ borderRadius: 12, padding: 5 }}>
                        <View
                          style={{
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              alignItems: "center",
                              flexDirection: "row",
                              width: "50%",
                            }}
                          >
                            <Image
                              style={{
                                height: 60,
                                width: 60,
                                borderRadius: 12,
                              }}
                              source={{
                                uri: config.imageUrl + item?.item?.user_image,
                              }}
                            />
                            <View style={{ marginLeft: 7 , alignItems:'flex-start'}}>
                              <Text
                                style={{
                                  fontFamily: FontFamily.semi_bold,
                                  fontSize: 16,
                                  lineHeight: 22,
                                }}
                              >
                                {I18n.translate ? item.item.title[1] : item.item.title[0]}
                              </Text>
                              <Text
                                style={{
                                  width: "50%",
                                  fontSize: 12,
                                  fontFamily: FontFamily.default,
                                  color: "rgba(0, 0, 0, 0.58)",
                                }}
                              >
                                {I18n.translate ? item.item.message[1] : item.item.message[0]}
                              </Text>
                            </View>
                          </View>
                          <View>
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: FontFamily.default,
                                color: "rgba(0, 0, 0, 0.58)",
                              }}
                            >
                              {item.item.createtime_ago}
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                deleteNotification(
                                  "single",
                                  item?.item?.notification_message_id
                                )
                              }
                            >
                              <Card
                                containerStyle={{
                                  height: 30,
                                  width: 30,
                                  padding: 0,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Icon
                                  name="trash-outline"
                                  type="ionicon"
                                  color={Colors.orange}
                                />
                              </Card>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
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
});
const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
});

export default connect(mapStateToProps)(NotificationsPage);
