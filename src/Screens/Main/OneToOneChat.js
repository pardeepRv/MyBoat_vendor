import React, { PureComponent } from "react";
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { connect } from "react-redux";
import { Colors, FontFamily } from "../../Constants/Constants";
import ChatBubble from "./ChatBubble";
import { Icon } from "react-native-elements";
import socketServices from "../../config/socketServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../../Constants/config";
import { Loading } from "../../Components/Loader";

const { width, height } = Dimensions.get("window");

class OneToOneChat extends PureComponent {
  constructor(props) {
    console.log(props, "props in one to one");
    super(props);
    this.state = {
      messages: [
        // {
        //   _id: 1,
        //   text: "My boat owner",
        //   createdAt: new Date(),
        //   user: {
        //     _id: 2,
        //     name: "Prince",
        //   },
        // },
      ],
      isLoading: false,
    };
    this.parsedInfo = {};
  }
  renderChats = (props) => {
    return <ChatBubble {...props} />;
  };

  componentDidMount() {
    this.getChatListing();
    socketServices.on(`message`, this.onReceiveMessage);
  }

  // componentDidMount() {
  //   this.onFocusSubscribe = this.props.navigation.addListener("focus", () => {
  //     this.getChatListing();
  //     socketServices.on(`message`, this.onReceiveMessage);
  //   });
  // }
  // componentWillUnmount() {
  //   this.onFocusSubscribe();
  // }

  getChatListing = async () => {
    this.setState({
      isLoading: true,
    });
    const { data } = this.props.route?.params;
    console.log(data, "getting from all chat");
    let userInfo = await AsyncStorage.getItem("userInfo");
    this.parsedInfo = JSON.parse(userInfo);

    let url =
      config.apiUrl +
      "/chat_1_2_1.php?other_user_id=" +
      data.other_user_id +
      "&logged_in_user_id=" +
      this.parsedInfo.id;
    console.log(url, "url gere");
    axios
      .get(url)
      .then((res) => {
        console.log(res, "res of one to one");
        this.setState({
          isLoading: false,
        });
        if (res && res.data && res.data.data) {
          //Initalizing the chat history
          const messages = res.data.data.map((val, index) => {
            let message = {
              _id: val.id,
              text: val.message,
              createdAt: val.message_date,
              user: {
                _id: val.sender_id,
                // name: "pardeep",
                avatar: config.imageUrl + val.user_image,
              },
            };
            //   if (!!data.repliedToText) {
            //     message.replyText = data.repliedToText;
            //   }
            return message;
          });
          this.setState({
            messages,
          });
        } else {
          this.setState({
            isLoading: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
        console.log(err);
      });
  };

  onReceiveMessage = (param) => {
    console.log(param, "receive>>>");
    const { data } = this.props.route?.params;

    console.log(data, "data>>>");
    const message = {
      _id: param.id,
      text: param.message,
      createdAt: param.message_date,
      user: {
        _id: param.sender_id,
        // name: firstName,
        // avatar: profileImg && profileImg[0].thumbnail,
      },
    };

    if (
      this.parsedInfo.id == param.sender_id ||
      data.other_user_id == param.receiver_id
    ) {
      console.log(
        this.parsedInfo.id,
        "this.parsedInfo.id",
        param.sender_id,
        "sender id",
        param.receiver_id,
        "rec"
      );

      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, message),
      }));
    }

    return;
    if (data.commonConversationId === commonConversationId) {
      socketServices.emit(`${SOCKET_STRINGS.RECEIVED_MESSAGE}${userData.id}`, {
        senderId: data.senderId,
        isRead: true,
        recieverId: data.recieverId,
      });

      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, message),
      }));
    }
  };

  onSend = (messages = []) => {
    const { data } = this.props.route?.params;

    console.log(messages, "messagesmessages");
    if (messages[0].text.trim()) {
      socketServices.emit("sendMessage", {
        sender_id: this.parsedInfo.id,
        receiver_id: data.other_user_id, //if user came to match screen then we sending swipe id instead of _id
        message_type: "Text",
        message: messages[0].text,
        timestamp: new Date(),
        avatar: "cYCz7Q4sFzr4He616539749.jpeg",
      });

      // this.setState((previousState) => ({
      //   messages: GiftedChat.append(previousState.messages, messages),
      // }));
    }
  };

  render() {
    const { messages } = this.state;
    const { data } = this.props.route?.params;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: Colors.orange,
            height: 60,
            alignItems: "flex-start",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          activeOpacity={0.8}
        >
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon
              name="arrow-back"
              type="ionicons"
              size={24}
              color={Colors.white}
              style={{
                paddingHorizontal: 10,
                marginVertical: 10,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              top: 12,
              flexDirection: "row",
              justifyContent: "flex-start",
              backgroundColor: Colors.orange,
            }}
          >
            <View
              style={{
                backgroundColor: Colors.orange,
                alignSelf: "center",
                alignItems: "center",
                marginRight: 14,
                justifyContent: "center",
                height: 40,
                width: 40,
                borderRadius: 50,
              }}
            >
              {data && data.image ? (
                <Image
                  source={{ uri: config.imageUrl + data.image }}
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 10,
                  }}
                />
              ) : (
                <Image
                  source={require("../../../src/Images/error.png")}
                  style={{ height: 40, width: 40, resizeMode: "contain" }}
                />
              )}
            </View>
            <View
              style={{ flexDirection: "column", marginRight: 15, width: "50%" }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: Colors.white,
                  textAlign: "left",
                  fontSize: 16,
                  bottom: 2,
                  fontFamily: FontFamily.bold,
                }}
              >
                {" "}
                {data.name}
              </Text>
              {/* <Text
                numberOfLines={1}
                style={{
                  color: Colors.white,
                  textAlign: "left",
                  fontSize: 12,
                  fontFamily: FontFamily.bold,
                }}
              >
                {" "}
                online{" "}
              </Text> */}
            </View>
          </View>
          <TouchableOpacity
            style={{
              top: 13,
              backgroundColor: Colors.orange,
              alignItems: "center",
              marginRight: 14,
              justifyContent: "center",
              height: 40,
              width: 40,
              borderRadius: 50,
            }}
          >
            {/* <Icon
              name="dots-three-vertical"
              type="entypo"
              color={"#fff"}
            /> */}
          </TouchableOpacity>
        </View>
        {this.state.isLoading && <Loading />}

        <GiftedChat
          messages={messages}
          onSend={(messages) => this.onSend(messages)}
          renderBubble={this.renderChats}
          user={{
            _id: this.parsedInfo.id,
          }}
          alwaysShowSend
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
          keyboardShouldPersistTaps="handled"
          textInputStyle={styles.messageTextInput}
          placeholder="Type here"
          minComposerHeight={40}
        />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  name: {
    fontFamily: FontFamily.default,
    fontSize: 15,
    color: Colors.gray1,
  },
  backIconContainer: {
    height: width * 0.08,
    width: width * 0.08,
    overflow: "hidden",
    backgroundColor: "lightgreen",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Platform.OS === "android" ? 10 : 0,
  },
  imageContainer: {
    height: width * 0.08,
    width: width * 0.08,
    borderWidth: 1,
    borderRadius: (width * 0.08) / 2,
    borderColor: Colors.white,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  iconContainer: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Colors.white,
    overflow: "hidden",
  },
  separator: {
    width: "100%",
    marginVertical: 2,
  },
  themeHeading: {
    fontFamily: FontFamily.default,
    color: Colors.orange,
  },
  themeText: {
    fontFamily: FontFamily.default,
    fontSize: 12,
    color: Colors.orange,
  },

  messageTextInput: {
    backgroundColor: "#eaeaea",
    paddingTop: Platform.OS == "ios" ? 8 : undefined,
    borderRadius: 20,
    paddingRight: 5,
    textAlignVertical: "center",
    fontFamily: FontFamily.default,
    alignSelf: "center",
    paddingHorizontal: 10,
  },
});

export default connect(null, null)(OneToOneChat);
