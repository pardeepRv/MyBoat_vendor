import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Geocode from "react-geocode";
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "react-native-elements";
import { connect, useDispatch } from "react-redux";
import Header from "../../Components/Header";
import { Loading } from "../../Components/Loader";
import { getPermission } from "../../config/callApi";
import socketServices from "../../config/socketServices";
import config from "../../Constants/config";
import { Colors, FontFamily } from "../../Constants/Constants";
import Outgoing from "../../Data/Outgoing";
import Upcoming from "../../Data/Upcoming";
import { toggleLanguage } from "../../Data_Service/actions";
import I18n from "../../Translations/i18";
import { UserContext } from "./UserContext";

const Home = (props) => {
  const value = React.useContext(UserContext);
  console.log(value, "in home");
  console.log(props, "pro[s in home");
  const [btn1Style, setBtn1Style] = useState({
    backColor: Colors.orange,
    textCOlor: Colors.white,
  });
  const [btn2Style, setBtn2Style] = useState({
    backColor: Colors.white,
    textCOlor: Colors.black,
  });
  const dispatch = useDispatch();
  const OutgoingData = Outgoing;
  const UpcomingData = Upcoming;
  const [data, setData] = useState(true);
  const [upcoming, setUpcoming] = useState(null);
  const [outgoing, setOutgoing] = useState(null);
  const [user_id_post, setUser_id_post] = useState(null);
  const [loader, setLoader] = useState(false);
  const [notificationIcon, setNotification] = useState(null);

  // --------------------------------------- //

  useEffect(async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);

    if (!socketServices.socket) {
      //connect socket
      socketServices.initializeSocket(parsedInfo.id);
    }
    if (!socketServices.socket.connected) {
      //connect socket
      socketServices.socket.connect();
    }
  }, []);

  const socketintial = () => {
    if (!socketServices.socket) {
      //connect socket
      socketServices.initializeSocket(206);
    }
    if (!socketServices.socket.connected) {
      //connect socket
      socketServices.socket.connect();
    }
  };

  useEffect(() => {
    console.log("in useEfect loginsuer>>>>>>>>>>>.");
    const unsubscribe = props.navigation.addListener("focus", () => {
      getLoginuserInfo();
      // socketintial();
    });
    return unsubscribe;
  }, [props.navigation]);

  //getting user information
  const getLoginuserInfo = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    console.log(parsedInfo, "parsedInfo >>>>>>>>>>>>>");

    if (parsedInfo?.role_id == 2) {
      // console.log("staff user is login");
      // getPermission(parsedInfo.id)
      //   .then((res) => {
      //     console.log(res, "res in new permiy");
      //   })
      //   .catch((err) => {
      //     console.log(err, "err coming");
      //   });
      // return;
      let url =
        config.apiUrl + "/get-permissions.php?user_id_post=" + parsedInfo.id;
      axios
        .get(url)
        .then((res) => {
          console.log(res, "res getting permission");
          setLoader(false);
          if (
            res?.data?.success === "true" &&
            res &&
            res.data &&
            res.data.permissions &&
            res.data.permissions.length > 0 &&
            res.data.permissions[0].view_home_permission
          ) {
            getBookingDetails();
          } else {
            alert("You do not have permission to see home page.");
          }
        })
        .catch((err) => console.log(err));
    } else {
      getBookingDetails();
    }
  };

  const OutgoingBtn = () => {
    setData(true);
    setBtn2Style({
      backColor: Colors.white,
      textCOlor: Colors.black,
    });
    setBtn1Style({
      backColor: Colors.orange,
      textCOlor: Colors.white,
    });
    // setData(OutgoingData);
  };
  // -------------------------------------- //
  const UpcomingBtn = () => {
    setData(false);
    setBtn1Style({
      backColor: Colors.white,
      textCOlor: Colors.black,
    });
    setBtn2Style({
      backColor: Colors.orange,
      textCOlor: Colors.white,
    });
    // setData(UpcomingData);
  };
  const logout = async () => {
    await AsyncStorage.clear();
    props.navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };
  const getBookingDetails = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    setUser_id_post(parsedInfo.id);
    setLoader(true);
    let url =
      config.apiUrl + "/booking_list_owner.php?user_id_post=" + parsedInfo.id;
    axios
      .get(url)
      .then((res) => {
        console.log(res, "res in home");
        setLoader(false);
        if (res.data.success == "true") {
          console.log(
            res.data.ongoning_booking_arr,
            "res.data.ongoning_booking_arr"
          );
          setNotification(res?.data?.is_read)

          if (res.data.upcoming_booking_arr != "NA2") {
            console.log("first....");
            setUpcoming(res.data.upcoming_booking_arr);
          }
          // if (res.data.ongoning_booking_arr == "NA3") {
          //   setOutgoing([]);
          // }
          if (
            Array.isArray(res.data.ongoning_booking_arr) &&
            res.data.ongoning_booking_arr.length > 0 &&
            res.data.ongoning_booking_arr != "NA3"
          ) {
            console.log("first111111...");

            setOutgoing(res.data.ongoning_booking_arr);
          }
          //  else {

          //   console.log('111112222...');

          //   setUpcoming([]);
          //   setOutgoing([]);
          // }
        } else {
          if (res?.data?.status_code == 405) {
            logout();
          }
          if (props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
        console.log(upcoming, "upcomingupcoming");
        console.log(outgoing, "outgoingoutgoing");
      })
      .catch((err) => console.log(err));
  };

  useEffect(async () => {
    let language_id = await AsyncStorage.getItem("language");

    if (language_id === null) {
      dispatch(props.toggleLanguage(0));
    } else {
      dispatch(props.toggleLanguage(language_id));
    }
    // getBookingDetails();
  }, []);

  const CardView = ({ item, ind }) => {
    return (
      <View>
        <Card containerStyle={s.Card}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("viewAdd", {
                item: item,
              });
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{
                  uri: config.imageUrl + item.image,
                }}
                style={{
                  height: 90,
                  width: 90,
                  borderRadius: 12,
                  marginLeft: -6,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 8,
                  flex: 0.9,
                }}
              >
                <View style={{}}>
                  <Text style={s.name}>{item.boat_name}</Text>
                  <Text style={s.type}>{I18n.translate("boat")}</Text>
                  <Text style={s.id}>{item.booking_no}</Text>
                  <Text style={s.type}>{item.date}</Text>

                  {/* <Text style={s.type}>{item.expiry_datetime}</Text> */}
                </View>
                <View
                  style={{ justifyContent: "space-between", marginLeft: 50 }}
                >
                  <Text style={[s.type, { textAlign: "right" }]}>
                    {item.createtime}
                  </Text>
                  <Text style={s.price}>
                    {I18n.translate("kwd")}
                    {item.total_amt}
                  </Text>

                  {item.booking_status === 0 ? (
                    <View
                      style={{
                        backgroundColor: "#ebd34e",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={[
                          s.status,
                          {
                            color: Colors.white,
                          },
                        ]}
                      >
                        Pending
                      </Text>
                    </View>
                  ) : null}
                  {item.booking_status === 1 ? (
                    <View
                      style={{
                        backgroundColor: "green",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={[
                          s.status,
                          {
                            color: Colors.white,
                          },
                        ]}
                      >
                        Confirmed
                      </Text>
                    </View>
                  ) : null}
                  {item.booking_status === 4 ? (
                    <View
                      style={{
                        backgroundColor: "red",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={[
                          s.status,
                          {
                            color: Colors.white,
                          },
                        ]}
                      >
                        Cancelled
                      </Text>
                    </View>
                  ) : null}
                  {item.booking_status === 3 ? (
                    <View
                      style={{
                        backgroundColor: "red",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={[
                          s.status,
                          {
                            textAlign: "center",
                            color: Colors.white,
                          },
                        ]}
                      >
                        Cancelled
                      </Text>
                    </View>
                  ) : null}
                  {item.booking_status === 2 ? (
                    <View
                      style={{
                        backgroundColor: Colors.orange,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={[
                          s.status,
                          {
                            textAlign: "center",
                            color: Colors.white,
                          },
                        ]}
                      >
                        Completed
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Card>
      </View>
    );
  };
  const allmapdata = (data) => {
    Geocode.fromAddress(data.description).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        this.props.navigation.replace("Mapviewpage", {
          lat: lat,
          lng: lng,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  };
  return (
    // <SafeAreaView
    //   style={{
    //     flex: 1,
    //   }}
    // >
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <StatusBar
        translucent
        // barStyle={"light-content"}
        backgroundColor={"transparent"}
      />
      <Header
        imgBack={true}
        notiBtn={true}
        notificationIcon={notificationIcon}
        searchBtn={true}
        name={I18n.translate("home")}
        isarbic={props.language_id == 1 ? 1 : 0}
      />

      {/* Buttons */}
      <View
        style={{
          position: "absolute",
          alignItems: "center",
          width: "100%",
          top: 100,
        }}
      >
        <View style={s.btn_1}>
          <TouchableOpacity
            style={[s.btn1, { backgroundColor: btn1Style.backColor }]}
            onPress={() => OutgoingBtn()}
            // onPress={() =>value.updateValue(2)}
            activeOpacity={0.8}
          >
            <Text style={[s.btn1Text, { color: btn1Style.textCOlor }]}>
              {I18n.translate("outgoing")}
            </Text>
            {/* <Text>{value.value}</Text> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btn1, { backgroundColor: btn2Style.backColor }]}
            onPress={() => UpcomingBtn()}
            // onPress={() => props.navigation.navigate('MapView')}
            activeOpacity={0.8}
          >
            <Text style={[s.btn1Text, { color: btn2Style.textCOlor }]}>
              {I18n.translate("upcoming")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* View */}
      <View style={s.SEC2}>
        {loader ? (
          <Loading />
        ) : (
          <View>
            {data ? (
              <View>
                {outgoing ? (
                  <FlatList
                    data={outgoing}
                    renderItem={CardView}
                    keyExtractor={(i, ind) => ind}
                    style={{
                      marginTop: 30,
                    }}
                    contentContainerStyle={
                      {
                        //    paddingBottom: 20,
                        //    height:"100%"
                      }
                    }
                    // ListFooterComponentStyle={{height:200}}
                    contentInsetAdjustmentBehavior="automatic"
                  />
                ) : (
                  <View style={{ alignItems: "center", marginTop: "10%" }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#ccc",
                      }}
                    >
                      {I18n.translate("no_data")}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View>
                {upcoming ? (
                  <FlatList
                    data={upcoming}
                    renderItem={CardView}
                    keyExtractor={(i, ind) => ind}
                    style={{
                      marginTop: 30,
                    }}
                    contentContainerStyle={
                      {
                        //    paddingBottom: 20,
                        //    height:"100%"
                      }
                    }
                    // ListFooterComponentStyle={{height:200}}
                    contentInsetAdjustmentBehavior="automatic"
                  />
                ) : (
                  <View style={{ alignItems: "center", marginTop: "10%" }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#ccc",
                      }}
                    >
                      {I18n.translate("no_data")}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
    // </SafeAreaView>
  );
};
const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
  permissions: state.data_Reducer.permissions,
});
const mapDispatchToProps = {
  toggleLanguage: toggleLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
const s = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    marginTop: -40,
    //   marginBottom:40,
    flex: 1,
  },
  btn1: {
    height: 35,
    width: 165,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    elevation: 5,
    margin: 7,
  },
  btn1Text: {
    fontSize: 12,
    fontFamily: FontFamily.semi_bold,
  },
  btn_1: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  Card: {
    borderRadius: 20,
    elevation: 3,
    marginHorizontal: 10,
    marginTop: 0,
    marginBottom: 15,
  },
  name: {
    fontFamily: FontFamily.semi_bold,
    fontSize: 16,
    marginBottom: 3,
  },
  type: {
    fontFamily: FontFamily.default,
    fontSize: 12,
    marginBottom: 3,
    //   opacity:0.5
    color: Colors.gray1,
  },
  id: {
    fontFamily: FontFamily.semi_bold,
    fontSize: 13,
    marginBottom: 3,
  },
  price: {
    marginBottom: 10,
    fontFamily: FontFamily.semi_bold,
    fontSize: 15,
    color: Colors.price,
    textAlign: "right",
  },
  status: {
    color: Colors.orange,
    fontFamily: FontFamily.default,
    fontWeight: "500",
    fontSize: 14,
    textAlign: "right",
  },
});
