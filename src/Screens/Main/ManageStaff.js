import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Modal,
} from "react-native";
import { Card, Icon, Overlay } from "react-native-elements";
import { connect } from "react-redux";
import Header from "../../Components/Header";
import { Loading } from "../../Components/Loader";
import config from "../../Constants/config";
import { Colors, FontFamily, Sizes } from "../../Constants/Constants";
import I18n from "../../Translations/i18";


const ManageStaff = (props) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [viewData, setViewdata] = useState([]);

  console.log("data :>> ", data);
  console.log("itemdata :>> ", itemData);
  // --------------------------------------- //
  const toggleOverlay = ({ item }) => {
    console.log(item, "item to be console");
    setItemData(item);
    setVisible(!visible);
    // setItemData(item);
  };

  useEffect(async () => {
    
    navigation.addListener("focus", () => {
      return allData();
    });
  }, []);

  const allData = async () => {
    setLoader(true);
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    console.log("parsedInfo", parsedInfo.id);
    let url = config.apiUrl + "/get_staff_member_list.php";

    var data = new FormData();
    data.append("boat_owner_id", parsedInfo.id);

    axios
      .post(url, data)
      .then((res) => {
        console.log("boat list >>>>>>>>>>>1", res);
        setLoader(false);
        setIsFetching(false);
        if (res && res.data && res.data.success == "true") {
          console.log("boat_list2", res.data.data);
          setData(res.data.data);
        } else {
          alert("Something went wrong!");
          console.log(res.data.success);
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteBoat = async (id) => {
    setLoader(true);
    console.log("id :>> ", id);
    let url = config.apiUrl + "/delete_staff_member.php";
    let data = new FormData();
    data.append("staff_id", id);
    axios
      .post(url, data)
      .then((res) => {
        console.log("delete list >>>>>>>>>>>1", res);
        setLoader(false);
        if (res && res.data) {
          setItemData(null);
          allData();
        } else {
          alert("Error");
          setLoader(false);
        }
      })
      .catch((err) => console.log(err));
  };
  const onRefresh = () => {
    setIsFetching(true);
    allData();
  };
  const onViewstaff = async (id) => {
    setLoader(true);
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    console.log("parsedInfo", parsedInfo.id);
    console.log("id :>> ", id);
    let url = config.apiUrl + "/view_staff_member.php";
    let data = new FormData();
    data.append("staff_id", id);
    data.append("boat_owner_id", parsedInfo.id);
    axios
      .post(url, data)
      .then((res) => {
        console.log("delete list >>>>>>>>>>>1", res);
        setLoader(false);
        if (res && res.data && res.data.data) {
          setViewdata(res.data.data);
          // allData();
          navigation.navigate("ViewStaff", { item: res.data.data[0] });
        } else {
          setLoader(false);
          alert("Something went wrong!");
          console.log(res.data.msg);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    // <SafeAreaView style={{ flex: 1 }}>
      <View style={{ backgroundColor: Colors.white, flex: 1 }}>
        <Header
          name={I18n.translate('Add_Staff')}
          backBtn={true}
          headerHeight={Sizes.height * 0.2}
          isarbic={props.language_id == 1 ? 1: 0}
          // searchBtn={true}
        />
        {/* Buttons */}
        <View style={s.btn_1}></View>
        {/* View */}
        <View style={s.SEC2}>
          <TouchableOpacity
            style={[s.btn1]}
            onPress={() => navigation.navigate("AddStaff", { type: "Add" })}
          >
            <Text style={{ letterSpacing: 0.75 }}>{I18n.translate('add')}</Text>
          </TouchableOpacity>
          {loader ? (
            <Loading />
          ) : (
            <View>
              {data === "NA" ? (
                <View style={{ alignItems: "center", marginTop: "10%" }}>
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", color: "#ccc" }}
                  >
                    No Staff Added
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={data === "NA" ? [] : data}
                  showsVerticalScrollIndicator={false}
                  refreshing={isFetching}
                  contentInset={{ bottom: 50 }}
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
                          <View style={s.SEC3}>
                            <View style={{ width: "90%", paddingStart: 10 }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text style={{ fontWeight: "bold" }}>
                                  email : {item && item.email}
                                </Text>
                              </View>
                              {/* <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                  }}>
                                  <Text>name : {item.boat_capacity}</Text>
                                  <Text style={{ color: '#ccc' }}>
                                    kunal
                              </Text>
                                </View> */}
                            </View>
                            <TouchableOpacity
                              style={{}}
                              onPress={() => toggleOverlay({ item })}
                            >
                              <Icon
                                name="dots-three-vertical"
                                type="entypo"
                                color={"#888"}
                              />
                            </TouchableOpacity>
                          </View>
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
                  }}
                />
              )}
            </View>
          )}
        </View>
        {/* Overlay */}
        {/* <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{ borderRadius: 20 }}
        supportedOrientations
        statusBarTranslucent>
        <View style={{ padding: 10, width: 300 }}>
          <TouchableOpacity onPress={() => {
            onViewstaff(itemData.user_id);
            // navigation.navigate('ViewStaff', { item: itemData });
            setVisible(false);
          }} >
            <Text
              style={{
                fontFamily: FontFamily.semi_bold,
                fontSize: 16,
                lineHeight: 40,
                color: 'rgba(0, 0, 0, 0.55)',
              }}>
              View
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              borderWidth: 0.5,
              marginTop: 5,
              borderColor: 'rgba(0, 0, 0, 0.55)',
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
            }}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddStaff', 
              { type: 'Edit', item: itemData }
              );
              setVisible(false)
            }}
            // onPress={() => {
            //   console.log('Doing it')
            //   setVisible(false)
            // }
            // }
          >
            <Text
              style={{
                fontFamily: FontFamily.semi_bold,
                fontSize: 16,
                lineHeight: 39,
                color: 'rgba(0, 0, 0, 0.55)',
              }}>
              Edit
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              borderWidth: 0.5,
              marginTop: 5,
              borderColor: 'rgba(0, 0, 0, 0.55)',
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
            }}
          />
          <TouchableOpacity
            // onPress={() => {
            //   console.log('Doing it')
            //   setVisible(false)
            // }
            // }
            onPress={() => {
              deleteBoat(itemData.user_id);
              setVisible(false)
            }}

          >
            <Text
              style={{
                fontFamily: FontFamily.semi_bold,
                fontSize: 16,
                lineHeight: 39,
                color: 'rgba(0, 0, 0, 0.55)',
              }}>
              Delete
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              borderWidth: 0.5,
              marginTop: 5,
              borderColor: 'rgba(0, 0, 0, 0.55)',
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
            }}
          />
          <TouchableOpacity onPress={() => toggleOverlay({ item: undefined })}>
            <Text
              style={{
                fontFamily: FontFamily.semi_bold,
                fontSize: 16,
                lineHeight: 39,
                color: 'rgba(0, 0, 0, 0.55)',
              }}>
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </Overlay> */}

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
                  onViewstaff(itemData.user_id);
                  setVisible(false);
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
                  {I18n.translate('view')}
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
                  navigation.navigate("AddStaff", {
                    type: "Edit",
                    item: itemData,
                  });
                  setVisible(false);
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
                  {I18n.translate('edit')}
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
                  deleteBoat(itemData.user_id);
                  setVisible(false);
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
                  {I18n.translate('delete')}
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
                  {I18n.translate('back')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    // </SafeAreaView>
  );
};
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


const mapStateToProps = (state)=>({
  language_id: state.data_Reducer.language_id

})



export default connect(mapStateToProps)(ManageStaff)

