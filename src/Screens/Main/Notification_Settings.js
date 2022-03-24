import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  I18nManager,
} from "react-native";
import { connect, useDispatch } from "react-redux";
import I18n from "../../Translations/i18";
import { Icon, Input, Card, Rating, AirbnbRating } from "react-native-elements";
import Header, { s } from "../../Components/Header";
import {
  back_img4,
  Colors,
  FontFamily,
  Sizes,
} from "../../Constants/Constants";
import { useNavigation } from "@react-navigation/core";
import { Switch } from "react-native-elements";
import axios from "axios";
import config from "../../Constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Loading } from "../../Components/Loader";
import { call } from "react-native-reanimated";

const Noti_Setting = (props) => {
  console.log("props", props);
  const [ongoingnoti, setongoingnoti] = useState(false);
  const [chatnoti, setchatnoti] = useState(false);
  const [promotion, setpromotion] = useState(false);
  const [Info, setUserInfo] = useState("");
  const [loader, setloader] = useState(false);

  useEffect(async () => {
    // for noti_data
    let noti_arr = await AsyncStorage.getItem("noti_arr");
    let notification = JSON.parse(noti_arr);
    console.log("notification", notification);

    setchatnoti(notification?.chat_notification ? true : false );
    setpromotion(notification?.promotion_notification  ? true : false );
    setongoingnoti(notification?.on_going_notification ? true : false );
  }, []);

  const callApi = async (status, type) => {
    console.log("index", type, status);
    let val = status ? 1 : 0;

    let userInfo = await AsyncStorage.getItem("user_arr");
    let parsedInfo = JSON.parse(userInfo);
    // console.log("first", parsedInfo);
    console.log("par", parsedInfo.user_id);
    let id = parsedInfo.user_id ; 

     console.log("userinfo", id);
    let url = config.apiUrl + "/notification_on_off.php";

    setloader(true);
    var data = new FormData();
    data.append("user_id_post", id);
    data.append("notification_status", val);
    data.append("notification_type", type);
    axios
      .post(url, data)
      .then((res) => {
        setloader(false);
        if (res) {
          let noti_data = JSON.stringify(res.data.user_details);
          AsyncStorage.setItem("noti_arr", noti_data);
          console.log("res", res);
          alert(res.data.msg[0]);
        } else {
          if (props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header
        backBtn={true}
        imgBack={true}
        headerHeight={300}
        name={"Notification Settings"}
      />
      <View style={styles.SEC2}>
        {loader ? (
          <Loading />
        ) : (
          <View style={{ marginTop: 30 }}>
            {/* 1 */}
            <View style={{ marginBottom: 1 }}>
              <Card
                containerStyle={{
                  height: 50,
                  paddingVertical: 2,
                  justifyContent: "center",
                  borderRadius: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: FontFamily.semi_bold,
                        marginHorizontal: 7,
                      }}
                    >
                      {I18n.translate("ongoing")}
                    </Text>
                  </View>
                  <View>
                    <Switch
                      value={ongoingnoti}
                      onChange={() => {
                        callApi(!ongoingnoti, "ongo");
                        setongoingnoti(!ongoingnoti);
                      }}
                      color="#fff"
                      trackColor={{
                        true: Colors.orange,
                        false: Colors.gray,
                      }}
                    />
                  </View>
                </View>
              </Card>
            </View>
            {/* 2 */}
            <View style={{ marginBottom: 1 }}>
              <Card
                containerStyle={{
                  height: 50,
                  paddingVertical: 2,
                  justifyContent: "center",
                  borderRadius: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: FontFamily.semi_bold,
                        marginHorizontal: 7,
                      }}
                    >
                      {I18n.translate("chat_not")}
                    </Text>
                  </View>
                  <View>
                    <Switch
                      value={chatnoti}
                      onChange={() => {
                        callApi(!chatnoti, "chat");
                        setchatnoti(!chatnoti);
                      }}
                      color="#fff"
                      trackColor={{
                        true: Colors.orange,
                        false: Colors.gray,
                      }}
                    />
                  </View>
                </View>
              </Card>
            </View>
            {/* 3 */}
            <View style={{ marginBottom: 1 }}>
              <Card
                containerStyle={{
                  height: 50,
                  paddingVertical: 2,
                  justifyContent: "center",
                  borderRadius: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: FontFamily.semi_bold,
                        marginHorizontal: 7,
                      }}
                    >
                      {I18n.translate("promotion")}
                    </Text>
                  </View>
                  <View>
                    <Switch
                      value={promotion}
                      onChange={() => {
                        callApi(!promotion, "promotion");
                        setpromotion(!promotion);
                      }}
                      color="#fff"
                      trackColor={{
                        true: Colors.orange,
                        false: Colors.gray,
                      }}
                    />
                  </View>
                </View>
              </Card>
            </View>
            {/*  */}
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
    height: 100,
  },
});
const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
});
// export default Noti_Setting;
export default connect(mapStateToProps)(Noti_Setting);
