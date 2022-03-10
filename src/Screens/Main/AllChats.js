import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { PureComponent } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import Header from "../../Components/Header";
import { Loading } from "../../Components/Loader";
import config from "../../Constants/config";
import TimeAgo from "react-native-timeago";

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

  renderChats = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          margin: 5,
          borderRadius: 10,
          flex: 1,
          borderBottomWidth: 0.5,
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
                  borderRadius:10
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
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    // const { userData } = this.props;
    const { isLoading, allChatMember } = this.state;

    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <Header
          imgBack={true}
          notiBtn={false}
          searchBtn={this.state?.allChatMember?.length > 0 ? true : false}
          headerHeight={150}
          name={"Messages"}
          backImgSource={require("../../../src/Images/back.jpg")}
        />
        {isLoading && <Loading />}
        {allChatMember.length > 0 ? (
          <FlatList
            keyboardShouldPersistTaps={"handled"}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={allChatMember}
            style={{
              marginTop: 10,
              alignSelf: "center",
            }}
            extraData={allChatMember}
            renderItem={this.renderChats}
            item={(item, index) => index.toString()}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{}}>No chat yet</Text>
          </View>
        )}
      </SafeAreaView>
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
    width: "60%",
    alignItems: "center",
  },
  right: {
    flex: 1,
    alignItems: "flex-end",
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
});

export default connect(null, null)(AllChats);
