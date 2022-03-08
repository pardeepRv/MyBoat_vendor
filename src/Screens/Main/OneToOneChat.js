import React, { PureComponent } from "react";
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { connect } from "react-redux";
import { Colors, FontFamily } from "../../Constants/Constants";
import ChatBubble from "./ChatBubble";
import { Icon } from "react-native-elements";
import socketServices from "../../config/socketServices";

const { width, height } = Dimensions.get("window");

class OneToOneChat extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          _id: 1,
          text: "My boat owner",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "Prince",
          },
        },
      ],
      isLoading: false,
    };
  }
  renderChats = (props) => {
    return <ChatBubble {...props} />;
  };

  componentDidMount() { 
    socketServices.on(`message`, this.onReceiveMessage);
}
 
  onReceiveMessage = param => {

    console.log(param, 'receive>>>');

    const { userData } = this.props;
    const { data } = this.props.route?.params;


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
    // console.log(data,"----------data")
    // console.log(commonConversationId,'the commonejoijoj');
    //To make sure that all the messages are seen if new message comes

    if (206 == param.sender_id || data.id == param.receiver_id) {
        console.log(data.id, 'data.id', param.sender_id, 'sender id', param.receiver_id, 'rec')
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
        }));

    }
    console.log(data.id, 'data.id', param.sender_id, 'sender id', param.receiver_id, 'rec')


    return
    if (data.commonConversationId === commonConversationId) {
        socketServices.emit(`${SOCKET_STRINGS.RECEIVED_MESSAGE}${userData.id}`, {
            senderId: data.senderId,
            isRead: true,
            recieverId: data.recieverId,
        });

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
        }));
    }
};


  onSend = (messages = []) => {
    socketServices.emit('sendMessage', {
      sender_id: 206,
      receiver_id: 209, //if user came to match screen then we sending swipe id instead of _id
      message_type: 'Text',
      message: messages[0].text,
      timestamp: new Date()
  });

    return
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  };

  render() {
    const { messages } = this.state;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.orange,
            height: 50,
            alignItems: "flex-start",
          }}
          activeOpacity={0.8}
          onPress={() => this.props.navigation.goBack()}
        >
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
        <GiftedChat
          messages={messages}
          onSend={(messages) => this.onSend(messages)}
          renderBubble={this.renderChats}
          user={{
            _id: 2,
          }}
          alwaysShowSend
          renderAvatar={null}
          keyboardShouldPersistTaps="handled"
          textInputStyle={styles.messageTextInput}
          placeholder="Type here"
          // renderChatFooter={() => <Text>Test</Text>}
          // renderActions={() => <Text>Test</Text>}
          // renderInputToolbar={renderInputToolbar}

          // }}
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