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
      allChatMember: dummyChat,
    };
  }

  renderChats = ({ item }) => {
    let data = {};

    return (
      <TouchableOpacity
        style={{
          margin: 5,
          borderRadius: 10,
          flex: 1,
          borderBottomWidth: 0.5,
        }}
        onPress={() => {
          this.props.navigation.navigate("OneToOneChat", { data: data || {} });
        }}
      >
        <View style={styles.chat}>
          <View style={styles.left}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://manjeettattooz.com/wp-content/uploads/2018/09/User-dummy-300x300.png",
                }}
                style={{
                  height: "80%",
                  width: "80%",
                  alignSelf: "center",
                  marginTop: 5,
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
                  {item.lastMsg}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.right}>
            <Text style={styles.msgTime}>{item.time}</Text>
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
        {allChatMember.length > 0 ? (
          <FlatList
            keyboardShouldPersistTaps={"handled"}
            showsVerticalScrollIndicator={false}
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
    width: "70%",
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
