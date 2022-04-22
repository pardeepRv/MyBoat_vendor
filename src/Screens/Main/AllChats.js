import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { PureComponent } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import TimeAgo from "react-native-timeago";
import { connect } from "react-redux";
import Header from "../../Components/Header";
import { Loading } from "../../Components/Loader";
import config from "../../Constants/config";
import { Colors } from "../../Constants/Constants";

const { width, height } = Dimensions.get("window");

const dummyChat = [
  {
    id: 1,
    name: "Colin Mochrie",
    lastMsg: "How are you doing?",
    time: "1h",
  },
  {
    id: 2,
    name: "Mila Kunis",
    lastMsg: "How are you doing?",
    time: "2h",
  },
  {
    id: 3,
    name: "James Kylie",
    lastMsg: "How are you doing?",
    time: "2h",
  },
];

class AllChats extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      allChatMember: [],
      searchText: "",
    };
  }

  componentDidMount() {
    this.onFocusSubscribe = this.props.navigation.addListener("focus", () => {
      this.getAllChatMembers();
    });
  }

  componentWillUnmount() {
    this.onFocusSubscribe();
  }

  logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  getAllChatMembers = async () => {
    this.setState({
      isLoading: true,
    });
    let url = config.apiUrl + "/chat_list.php";

    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    console.log(parsedInfo, "parsedInfo >>>>>>>>>>>>>");

    let data = new FormData();
    data.append("user_id", parsedInfo.id);

    axios
      .post(url, data)
      .then((res) => {
        console.log(res, "get all chats");
        if (res?.data?.data) {
          this.setState({
            allChatMember: res?.data?.data,
            isLoading: false,
          });
        } else {
          if (res?.data?.status_code == 405) {
            this.logout();
            alert(res?.data?.msg[0]);
          }
          this.setState({
            isLoading: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false,
        });
      });
  };

  //filter search
  searchByKeyword = async (text) => {
    console.log(text, " searching chat");
    this.setState({
      searchText: text,
      isLoading: true,
    });

    let url = config.apiUrl + "/chat_list.php";
    return;
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    console.log(parsedInfo, "parsedInfo >>>>>>>>>>>>>");

    let data = new FormData();
    data.append("user_id", parsedInfo.id);

    axios
      .post(url, data)
      .then((res) => {
        console.log(res, "get all chats");
        if (res?.data?.data) {
          this.setState({
            allChatMember: res?.data?.data,
            isLoading: false,
          });
        } else {
          this.setState({
            isLoading: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false,
        });
      });
  };

  deleteChat = async (item) => {
    console.log("item", item);
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);

    this.setState({ isLoading: true });
    let url = config.apiUrl + "/chat_delete_list.php";
    console.log(url, "url of notify");
    var data = new FormData();
    data.append("user_id", parsedInfo.id);
    data.append("other_user_id", item.other_user_id);
    console.log(data, "data while creatin Ad");
    this.setState({ isLoading: true });
    axios
      .post(url, data)
      .then((res) => {
        console.log("res", res);
        this.setState({ isLoading: false });
        if (res.data.success === "true") {
          alert("Chat has been deleted successfully!");
          this.getAllChatMembers();
        }
      })
      .catch((err) => console.log(err));
  };

  deleteChatAlert(item) {
    Alert.alert(
      "Delete chat",
      "Are you sure you want to delete ?",
      [
        {
          text: "Ok",
          onPress: () => {
            this.deleteChat(item);
          },
        },
        {
          text: "Cancel",
          onPress: () => {
            console.log("cancel");
          },
        },
      ],
      { cancelable: false }
    );
  }
  renderChats = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          margin: 10,
          borderRadius: 10,
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() => {
          this.props.navigation.navigate("OneToOneChat", { data: item });
        }}
      >
        <View style={styles.chat}>
          <View style={styles.left}>
            <View style={styles.imageContainer}>
              <Image
                source={
                  item?.image
                    ? { uri: config.imageUrl + item.image }
                    : {
                        uri: "https://manjeettattooz.com/wp-content/uploads/2018/09/User-dummy-300x300.png",
                      }
                }
                style={{
                  height: "80%",
                  width: "80%",
                  alignSelf: "center",
                  marginTop: 5,
                  borderRadius: 10,
                }}
                resizeMode="cover"
              />
            </View>
            <View style={{ paddingLeft: 10 }}>
              <Text style={{}}>{item.name}</Text>
              <View
                style={{
                  justifyContent: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  width: width / 1.4,
                  paddingTop: 10,
                }}
              >
                <Text numberOfLines={1} style={styles.msgText}>
                  {item.last_message}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.right}>
            <TimeAgo time={item?.last_message_time} />
          </View>
          <TouchableOpacity
            onPress={() => this.deleteChatAlert(item)}
            style={{
              height: 30,
              width: 30,
              padding: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="trash-outline" type="ionicon" color={Colors.orange} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    // const { userData } = this.props;
    const { isLoading, allChatMember } = this.state;

    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Header
          imgBack={true}
          notiBtn={false}
          // searchBtn={this.state?.allChatMember?.length > 0 ? true : false}
          headerHeight={150}
          name={"Messages"}
        />
        {/* <TextInput
          onChangeText={(search) => this.searchByKeyword(search)}
          value={this.state.searchText}
          placeholder="Search here..."
          style={styles.searchStyle}
        /> */}

        {isLoading && <Loading />}
        <View
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: 25,
            borderTopEndRadius: 25,
            marginTop: -30,
            flex: 1,
          }}
        >
          {allChatMember.length > 0 ? (
            <FlatList
              keyboardShouldPersistTaps={"handled"}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={allChatMember}
              style={{}}
              extraData={allChatMember}
              renderItem={this.renderChats}
              item={(item, index) => index.toString()}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{}}>No chat yet</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperStyle: {
    backgroundColor: "white",
  },
  listContainer: {
    paddingBottom: 60,
  },
  headerContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: "green",
  },
  hiddenContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  moreText: {
    color: "white",
  },
  chat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 5,
    width: "80%",
  },
  imageContainer: {
    height: width * 0.15,
    width: width * 0.15,
    overflow: "hidden",
  },
  left: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
  },
  right: {
    width: "20%",
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  separator: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "lightgrey",
    marginVertical: 10,
  },
  msgText: {
    fontSize: 14,
    marginTop: 4,
  },
  msgTime: {
    fontSize: 14,
    textAlign: "right",
  },
  searchStyle: {
    margin: 10,
    width: "90%",
    height: 35,
    position: "absolute",
    top: 40,
    left: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});

export default connect(null, null)(AllChats);
