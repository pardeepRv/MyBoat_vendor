import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
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
import { Colors, FontFamily, Sizes } from "../../Constants/Constants";
import I18n from "../../Translations/i18";

const ManageBoats = (props) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState([]);
  const [itemData, setItemData] = useState([]);
  // --------------------------------------- //
  const toggleOverlay = ({ item }) => {
    setVisible(!visible);
    setItemData(item);
  };
  useEffect(async () => {
    navigation.addListener("focus", () => {
      allData();
    });
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    allData();
  }, []);
  const allData = async () => {
    setLoader(true);
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    let url = config.apiUrl + "/boat_list.php?user_id_post=" + parsedInfo.id;
    axios
      .get(url)
      .then((res) => {
        setLoader(false);
        setIsFetching(false);
        let data = JSON.stringify(res.data, null, 1);
        if (res.data.success === "true") {
          setData(res.data.boat_arr);
        } else {
          if (this.props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
  };
  const deleteBoat = async (id) => {
    setLoader(true);
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl +
      "/boat_delete.php?user_id_post=" +
      parsedInfo.id +
      "&boat_id=" +
      id;
    axios
      .get(url)
      .then((res) => {
        setLoader(false);
        let data = JSON.stringify(res.data, null, 1);
        if (res.data.success === "true") {
          setVisible(!visible);
          setItemData(null);
          allData();
        } else {
          if (this.props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
  };
  const onRefresh = () => {
    setIsFetching(true);
    allData();
  };
  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <Header
        name={I18n.translate("choose_boat")}
        backBtn={true}
        headerHeight={Sizes.height * 0.2}
        isarbic={props.language_id == 1 ? 1 : 0}
        // searchBtn={true}
      />
      {/* Buttons */}
      <View style={s.btn_1}></View>
      {/* View */}
      <View style={s.SEC2}>
        <TouchableOpacity
          style={[
            s.btn1,
            Platform.OS === "ios"
              ? {
                  shadowColor: "rgba(0, 0, 0, 0.25)",
                  shadowOpacity: 1,
                  // shadowRadius: 5,
                  backgroundColor: "#fff",
                  shadowOffset: { width: 2, height: 2 },
                }
              : { elevation: 2 },
          ]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("AddBoat", { type: "Add" })}
        >
          <Text style={{ letterSpacing: 0.75, fontFamily: FontFamily.default }}>
            {I18n.translate("add")}
          </Text>
        </TouchableOpacity>
        {loader ? (
          <Loading />
        ) : (
          <View>
            {data === "NA" ? (
              <View style={{ alignItems: "center", marginTop: "10%" }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: FontFamily.semi_bold,
                    color: "#ccc",
                  }}
                >
                  {I18n.translate("no_boats_added")}
                </Text>
              </View>
            ) : (
              <FlatList
                data={data === "NA" ? [] : data}
                showsVerticalScrollIndicator={false}
                refreshing={isFetching}
                onRefresh={onRefresh}
                renderItem={({ item }) => {
                  return (
                    <View style={{ padding: 5 }}>
                      <Card
                        containerStyle={{
                          padding: 0,
                          borderRadius: 15,
                          paddingHorizontal: 0,
                          margin: 7.5,
                          marginHorizontal: 10,
                          elevation: 5,
                        }}
                      >
                        {/*  */}
                        <TouchableOpacity
                          style={[
                            s.SEC3,
                            Platform.OS === "ios"
                              ? {
                                  shadowColor: "rgba(0, 0, 0, 0.5)",
                                  borderRadius: 10,
                                  borderWidth: 1,
                                  borderColor: "rgba(0, 0, 0, 0.1)",
                                  backgroundColor: "#fff",
                                  shadowOffset: { width: 3, height: 6 },
                                }
                              : {},
                          ]}
                          onPress={() => {
                            navigation.navigate("viewBoat", { item: item });
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              paddingStart: 10,
                              flexDirection: "row",
                            }}
                          >
                            <View
                              style={{
                                width: "45%",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                style={{ fontFamily: FontFamily.semi_bold }}
                              >
                                {I18n.translate("year")}-
                                {item.manufacturing_year.split("-")[0]}
                              </Text>
                              <Text style={{ fontFamily: FontFamily.default }}>
                                {I18n.translate("capacity")} -{" "}
                                {item.boat_capacity}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: "45%",
                                justifyContent: "center",

                                alignItems: "flex-end",
                                paddingRight: 10,
                              }}
                            >
                              <Text style={{ fontFamily: FontFamily.default }}>
                                {item.name}
                              </Text>
                              {/* <Text style={{color: '#ccc'}}>
                                #{item.boat_id}
                              </Text> */}
                            </View>
                            <TouchableOpacity
                              style={{ justifyContent: "center" }}
                              onPress={() => toggleOverlay({ item })}
                            >
                              <Icon
                                name="dots-three-vertical"
                                type="entypo"
                                color={"#888"}
                              />
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      </Card>
                    </View>
                  );
                }}
                keyExtractor={(i, ind) => ind}
                style={{
                  marginTop: 30,
                }}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{
                  paddingBottom: 10,
                  //    height:"100%"
                }}
              />
            )}
          </View>
        )}
      </View>
      {/* Overlay */}
      <Modal
        animationType={"none"}
        transparent={true}
        visible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{ borderRadius: 20 }}
        onRequestClose={() => {}}
      >
        <View
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff25",
          }}
        >
          <View
            style={{
              width: 300,
              justifyContent: "center",
              elevation: 1,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 1,
              borderRadius: 20,
              backgroundColor: "white",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setVisible(!visible);
                navigation.navigate("AddBoat", {
                  type: "Edit",
                  item: itemData,
                });
              }}
            >
              <Text
                style={{
                  fontFamily: FontFamily.semi_bold,
                  fontSize: 16,
                  lineHeight: 40,
                  color: "rgba(0, 0, 0, 0.55)",
                }}
              >
                {I18n.translate("edit")}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: "100%",
                borderWidth: 0.5,
                marginTop: 5,
                borderColor: "rgba(0, 0, 0, 0.55)",
                backgroundColor: "rgba(0, 0, 0, 0.55)",
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setVisible(!visible);
                deleteBoat(itemData.boat_id);
              }}
            >
              <Text
                style={{
                  fontFamily: FontFamily.semi_bold,
                  fontSize: 16,
                  lineHeight: 39,
                  color: "rgba(0, 0, 0, 0.55)",
                }}
              >
                {I18n.translate("delete")}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: "100%",
                borderWidth: 0.5,
                marginTop: 5,
                borderColor: "rgba(0, 0, 0, 0.55)",
                backgroundColor: "rgba(0, 0, 0, 0.55)",
              }}
            />
            <TouchableOpacity
              onPress={() => toggleOverlay({ item: undefined })}
            >
              <Text
                style={{
                  fontFamily: FontFamily.semi_bold,
                  fontSize: 16,
                  lineHeight: 39,
                  color: "rgba(0, 0, 0, 0.55)",
                }}
              >
                {I18n.translate("back")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
});
export default connect(mapStateToProps)(ManageBoats);

const s = StyleSheet.create({
  btn1: {
    borderRadius: 5,

    alignSelf: "flex-end",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.25)",
    marginRight: 20,

    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  btn1Text: {
    fontSize: 15,
    fontFamily: FontFamily.semi_bold,
    color: Colors.black,
  },
  btn_1: {
    flexDirection: "row",
    justifyContent: "space-around",
    // position: "absolute",
    alignSelf: "center",
    top: 100,
  },
  SEC2: {
    backgroundColor: Colors.white,
    marginTop: -40,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
  },
  ImageBackground: {
    height: 215,
    width: "100%",
    borderRadius: 15,
    alignSelf: "center",
    // marginHorizontal:10,
    elevation: 0,
  },
  imgStyle: {
    borderRadius: 15,
    height: 215,
    width: "100%",
    alignSelf: "center",
  },
  SEC3: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingHorizontal: 5,
    alignItems: "center",
  },
  title: {
    fontFamily: FontFamily.semi_bold,
    fontSize: 18,
    color: Colors.orange,
    // lineHeight:20
  },
  type: {
    fontFamily: FontFamily.default,
    fontSize: 15,
    lineHeight: 20,
    color: Colors.black1,
  },
  no: {
    fontFamily: FontFamily.default,
    fontSize: 12,
    lineHeight: 20,
    color: Colors.black1,
  },
  dis: {
    fontFamily: FontFamily.default,
    fontSize: 13,
    color: Colors.black1,
  },
  place: {
    fontFamily: FontFamily.default,
    fontSize: 16,
    color: Colors.orange,
  },
  trapezoid_discount: {
    width: 115,
    height: 0,
    borderBottomWidth: 25,
    borderBottomColor: Colors.orange,
    borderLeftWidth: 25,
    borderLeftColor: "transparent",
    borderRightWidth: 25,
    borderRightColor: "transparent",
    borderStyle: "solid",
    backgroundColor: "transparent",
    alignItems: "center",
    transform: [{ rotate: "-45deg" }],
    marginTop: 19.2,
    marginLeft: -26,
  },
});
