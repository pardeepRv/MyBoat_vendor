import React from 'react';
// import { GiftedChat,Bubble, Actions,
//   ActionsProps, } from 'react-native-gifted-chat'
import {back_img, Colors, FontFamily, Sizes} from '../../Constants/Constants';
import {
  Text,
  View,
  Image,
  Platform,
  Modal,
  Alert,
  StyleSheet,
  FlatList,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {Icon} from 'react-native-elements';
// import {Lang_chg} from './Provider/Language_provider';
import config from '../../Constants/config';

import {localStorage} from './localStorageProvider';
import {msgProvider, msgTitle, msgText} from './messageProvider';
// import Icon from 'react-native-vector-icons/AntDesign'
import firebase from './Config1';
import Firebase from 'firebase';
// import {Languageprovider}  from './Provider/Language_provider';
import {launchImageLibrary} from 'react-native-image-picker';
import {firebaseprovider} from '../Provider/FirebaseProvider';
import {notification} from '../Provider/NotificationProvider'; 
import NetInfo from '@react-native-community/netinfo';
// import Loader from './Loader';
// import {consolepro} from './Provider/Consoleprovider';
// import {Circle} from 'react-native-maps';
// import { ActivityIndicator } from 'react-native-paper';
const BannerHieght = Dimensions.get('window').height;
const BannerWidth = Dimensions.get('window').width;
global.userChatIdGlobal = '';
global.blockinbox = 'no';
global.messagedata = [];
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      optionmsg: '',
      data1: [],
      user_id: '',
      chatmsg: '',
      other_user_name: '',
      data: this.props.route.params.chatdata,
      // data:{'other_user_name':'vikas',image:'',other_user_id:3,'blockstatus':'no'},
      name: '',
      message_type: 'text',

      filePath: {},
      messages: [],
      isVisible: false,
      modalVisible: false,
      fileData: '',
      fileUri: '',
      user_image: null,
      imgBlob: '',
      isConnected: true,
      loading: false,
      behavior: 'position',
      bottom: 5,
    };
    // OneSignal.init(config.onesignalappid, {
    //   kOSSettingsKeyAutoPrompt: true,
    // });
    // OneSignal.setLogLevel(6, 0);
    this.show_user_message_chat = this.show_user_message_chat.bind(this);
  }
  componentDidMount() {
    NetInfo.fetch().then(state => {
      this.setState({isConnected: state.isConnected});
    });
    //Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      this.setState({isConnected: state.isConnected});
    });
    this.getmessagedata();
  }
  getmessagedata = async () => {
    var userdata = await localStorage.getItemObject('user_arr');
    this.setState({user_id: userdata.user_id, user_image: userdata?.user_details?.image});
    console.log('DATA----===', this.state.data);
    var data = this.state.data;
    var other_user_id = data.other_user_id;

    var inbox_count = FirebaseUserJson.findIndex(
      x => x.user_id == other_user_id,
    );
    if (inbox_count >= 0) {
      var jsonData = FirebaseUserJson[inbox_count];
      if (jsonData.name != 'NA') {
        this.setState({name: jsonData.name});
      } else {
        this.setState({name: 'Chat'});
      }
    } else {
      this.setState({name: 'Chat'});
    }
    this.show_user_message_chat();
  };
  sendmessagebtn = async () => {
    let messageType = 'text';
    let message = this.state.chatmsg;
    this.chatmsg.clear();
    this.setState({chatmsg: ''});
    if (message.length <= 0) {
      // alert(Languageprovider.massege_validation[language_key]);
      return false;
    }
    this.sendmessagecallbtn(messageType, message);
  };
  sendmessagecallbtn = async (messageType, message) => {
    let userdata = await localStorage.getItemObject('user_arr');

    let data1 = this.state.data;
    //  jhkfhjkhsdk
    var user_id = userdata.user_id;
    var other_user_id = data1.other_user_id;
    //  var item_id = data1.item_id;
    var chat_type = 'Item_chat';

    var user_id_send = 'u_' + user_id;
    var other_user_id_send = 'u_' + other_user_id;

    var inbox_id_me = 'u_' + other_user_id;
    var inbox_id_other = 'u_' + user_id;
    if (FirebaseUserJson.length > 0) {
      var find_inbox_index2 = FirebaseUserJson.findIndex(
        x => x.user_id == other_user_id,
      );

      if (find_inbox_index2 != -1) {
        if ('myInbox' in FirebaseUserJson[find_inbox_index2]) {
          let myinbox2 = FirebaseUserJson[find_inbox_index2].myInbox;
          if (myinbox2 != undefined) {
            //  myinbox=myinbox.findIndex(x => x.user_id == other_user_id)
            if (inbox_id_other in myinbox2) {
              let myinboxdata = myinbox2[inbox_id_other];
              blockinbox = myinboxdata.block_status;
            }
          }
        }
      }
    }
    var find_inbox_index = FirebaseInboxJson.findIndex(
      x => x.user_id == other_user_id,
    );
    if (find_inbox_index == -1) {
      var jsonUserDataMe = {
        count: 0,
        lastMessageType: '',
        lastMsg: '',
        user_id: other_user_id,
        typing_status: 'no',
        block_status: 'no',
        lastMsgTime: Firebase.database.ServerValue.TIMESTAMP,
      };

      var jsonUserDataother = {
        count: 0,
        lastMessageType: '',
        lastMsg: '',
        user_id: user_id,
        typing_status: 'no',
        block_status: 'no',
        lastMsgTime: Firebase.database.ServerValue.TIMESTAMP,
      };

      firebaseprovider.UpdateUserInboxMe(
        user_id_send,
        inbox_id_me,
        jsonUserDataMe,
      );
      if (blockinbox == 'no') {
        firebaseprovider.UpdateUserInboxOther(
          other_user_id_send,
          inbox_id_other,
          jsonUserDataother,
        );
      }

    }
    //---------------------- this code for create inbox in first time end -----------

    //---------------------- this code for send message to both -----------
    var messageIdME = 'u_' + user_id + '__u_' + other_user_id;
    var messageIdOther = 'u_' + other_user_id + '__u_' + user_id;
    var senderId = user_id;
    var inputId = 'xyz';
    // var timestamp = new Date().getTime();
    var messageJson = {
      message: message,
      messageType: messageType,
      senderId: senderId,
      timestamp: Firebase.database.ServerValue.TIMESTAMP,
    };

    this.chatmsg.clear();

    firebaseprovider.SendUserMessage(
      messageIdME,
      messageJson,
      messageType,
      inputId,
    );
    if (this.state.data.blockstatus == 'no') {
      if (blockinbox == 'no') {
        firebaseprovider.SendUserMessage(
          messageIdOther,
          messageJson,
          messageType,
          inputId,
        );
      }
    }
    //---------------------- this code for send message to both end -----------

    //----------------update user inbox----------------------------
    var jsonUserDataMe = {
      count: 0,
      lastMessageType: messageType,
      lastMsg: message,
      lastMsgTime: Firebase.database.ServerValue.TIMESTAMP,
    };

    firebaseprovider.UpdateUserInboxMe(
      user_id_send,
      inbox_id_me,
      jsonUserDataMe,
    );

    var user_id_me = userdata.user_id;
    var chat_room_id = other_user_id;
    this.chatRoomIdUpdate(user_id_me, chat_room_id);

    //------------------------- get other user inbox -------------------

    var count_new = 0;
    var query = firebase
      .database()
      .ref('users/' + other_user_id_send + '/myInbox/' + inbox_id_other);
    query.once('value', data => {
      // console.log('user inbox data',data.val().count);
      var count_old = data.val() == null ? 0 : data.val().count;
      count_new = parseInt(count_old) + 1;

      var jsonUserDataOther = {
        count: count_new,
        lastMessageType: messageType,
        lastMsg: message,
        lastMsgTime: Firebase.database.ServerValue.TIMESTAMP,
      };
      // alert("dddd");
      // console.log('jsonUserDataOther',jsonUserDataOther);
      if (blockinbox == 'no') {
        firebaseprovider.UpdateUserInboxOther(
          other_user_id_send,
          inbox_id_other,
          jsonUserDataOther,
        );
      }
    });
    //---------------------- send message notifications ----------------
    var title = 'Cupido';
    var message_send = message;
    var SenderName = userdata.name;
    if (messageType != 'text' && messageType != 'location') {
      message_send = SenderName + ' sent: ' + messageType;
    } else {
      message_send = SenderName + ' ' + message_send;
    }

    var other_user_id = chat_room_id;
    var message_noti = message_send;
    var action_json = {
      user_id: user_id_me,
      other_user_id: other_user_id,
      chat_type: chat_type,

      action_id: 0,
      action: 'chat_single',
      // action_id : user_id_me,
      SenderName: SenderName,
    };
    // alert(user_id_me);
    this.sendNotificationSignle(
      title,
      message_noti,
      action_json,
      other_user_id,
    );
    //---------------------- send message notifications end----------------
  };
  sendNotificationSignle = async (
    title,
    message,
    action_json,
    user_id_member,
  ) => {
    let userdata = await localStorage.getItemObject('user_arr');
    var user_check_inbox = FirebaseUserJson.findIndex(
      x => x.user_id == user_id_member,
    );
    if (user_check_inbox >= 0) {
     
      var player_id_get = FirebaseUserJson[user_check_inbox].player_id;
      var chat_room_id_get = FirebaseUserJson[user_check_inbox].chat_room_id;
      var notification_status =
        FirebaseUserJson[user_check_inbox].notification_status;

    

      if (notification_status == 0) {
        var user_id_me = userdata.user_id;
        // if(chat_room_id_get != user_id_me){
        if (player_id_get != 'no' && player_id_get != '123456') {
          var player_id_arr = [];
          player_id_arr.push(player_id_get);

          if (player_id_arr.length > 0) {
            notification.notificationfunction(
              message,
              action_json,
              player_id_get,
              title,
            );
          }
          // }
        }
      }
    }
  };
  chatRoomIdUpdate = (user_id, other_user_id) => {
    var id = 'u_' + user_id;
    var jsonUserDataMe = {
      chat_room_id: other_user_id,
    };
    firebaseprovider.CreateUser(id, jsonUserDataMe);
  };
  myInboxCountZeroChat = () => {
    var data = this.state.data;
    var user_id = this.state.user_id;
    var other_user_id = data.other_user_id;
    var user_id_send = 'u_' + user_id;
    var other_user_id_send = 'u_' + other_user_id;

    var jsonUserDataOther = {
      count: 0,
      user_id: other_user_id,
    };
    firebaseprovider.UpdateUserInboxOther(
      user_id_send,
      other_user_id_send,
      jsonUserDataOther,
    );
  };

  show_user_message_chat = () => {
    //  var messagedata=[]
    var other_user_id = this.state.data.other_user_id;
    var find_inbox_index = FirebaseInboxJson.findIndex(
      x => x.user_id == other_user_id,
    );
  
    if (find_inbox_index >= 0) {
      this.myInboxCountZeroChat();
    }


    var data = this.state.data;
    var user_id = this.state.user_id;
    var other_user_id = data.other_user_id;
    var chat_type = 'Item_chat';

    var userChatId = 'u_' + user_id + '__u_' + other_user_id;
    if (userChatIdGlobal == '') {
      userChatIdGlobal = userChatId;
    }
    var queryOff = firebase.database().ref('message/').child(userChatIdGlobal);
    queryOff.off('child_added');
    queryOff.off('child_changed');
    // alert('userChatId======'+userChatId);
    var image_index_me = 0;
    var image_index_other = 0;
    userChatIdGlobal = userChatId;
    var query = firebase
      .database()
      .ref('message/' + userChatId)
      .orderByChild('timestamp');
    query.on('child_added', data => {
      // LoadingEnd();

      var msgKey = data.key;
      var message = data.val().message;
      var messageType = data.val().messageType;
      var senderId = data.val().senderId;
      var timestamp = data.val().timestamp;
      var lastMsgTime = firebaseprovider.convertTimeAllFormat(
        timestamp,
        'date_time_full',
      );
      var messageDataShow = '';

      if (senderId == user_id) {

        if (messageType == 'text') {
          var messageJson = {
            name: message,
            userid: senderId,
            messageType: messageType,
            time: lastMsgTime,
          };
          let data6 = this.state.data1;
          data6.push(messageJson);
          this.setState({data1: data6});
        } else if (messageType == 'location') {
          var messageJson = {
            name: message,
            userid: senderId,
            messageType: messageType,
            time: lastMsgTime,
          };
          let data6 = this.state.data1;
          data6.push(messageJson);
          this.setState({data1: data6});
        } else if (messageType == 'image') {
          var messageJson = {
            name: message,
            userid: senderId,
            messageType: messageType,
            time: lastMsgTime,
          };
          let data6 = this.state.data1;
          data6.push(messageJson);
          this.setState({data1: data6});
        }
      } else {
        if (messageType == 'text') {
          var messageJson = {
            name: message,
            userid: senderId,
            messageType: messageType,
            time: lastMsgTime,
          };
          let data6 = this.state.data1;
          data6.push(messageJson);
          this.setState({data1: data6});
        } else if (messageType == 'location') {
          var messageJson = {
            name: message,
            userid: senderId,
            messageType: messageType,
            time: lastMsgTime,
          };
          let data6 = this.state.data1;
          data6.push(messageJson);
          this.setState({data1: data6});
        } else if (messageType == 'image') {
          var messageJson = {
            name: message,
            userid: senderId,
            messageType: messageType,
            time: lastMsgTime,
          };
          let data6 = this.state.data1;
          data6.push(messageJson);
          this.setState({data1: data6});
        }
      }
    });

    

  };
  // senduserreport = async () => {
  //   let userdata = await localStorage.getItemObject('user_arr')
  //   console.log('userdata', userdata)
  //   let user_id = userdata.user_id
  //   let data = this.state.data
  //   var other_user_id = data.other_user_id
  //   var url = config.apiUrl + 'report_submit.php?user_id=' + user_id + '&other_user_id=' + other_user_id + '&report_type=chat';
  //   console.log('url', url)
  //   this.setState({ loading: true, })
  //   fetch(url, {
  //     method: 'GET',
  //     headers: {
  //       'Cache-Control': 'no-cache, no-store, must-revalidate',
  //       'Pragma': 'no-cache',
  //       'Expires': 0,
  //       Accept: 'application/json',
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   }).then((obj) => {
  //     this.setState({ loading: false });
  //     return obj.json();
  //   }).then((obj) => {
  //     console.log('obj', obj);

  //     if (obj.success == 'true') {
  //       msgProvider.alert('', obj.msg[config.language], false);
  //     }
  //     else {
  //       msgProvider.alert('', obj.msg[config.language], false);
  //       if (obj.active_status == "deactivate") {

  //         this.props.navigation.navigate('Logout')
  //       }
  //       return false;
  //     }
  //   }).catch((error) => {
  //     this.setState({ loading: false });
  //     msgProvider.alert(msgTitle.server[config.language], msgText.servermessage[config.language], false);
  //   })
  // }

  // // componentWillMount() {
  //   this.setState({
  //     messages: [
  //       {
  //           _id: 2,
  //           text: 'My message',
  //           createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
  //           avatar: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',

  //           user: {
  //             _id: 2,
  //             name: 'React Native',
  //            avatar: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
  //           },

  //         }
  //     ],
  //   })
  // }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }
  handlePickImage = () => {
  };
  renderBubble = props => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: 'white',
          },
        }}
        wrapperStyle={{
          right: {
            backgroundColor: Colorss.theme1,
          },
          left: {
            backgroundColor: '#d6d6d6',
          },
        }}
      />
    );
  };
  renderActions = props => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.goBack();
        }}
        style={{width: '10%', alignItems: 'center', justifyContent: 'center'}}>
        <Image
          style={{
            width: 34,
            height: 34,
            resizeMode: 'contain',
            marginLeft: 9,
            marginBottom: 9,
          }}
          source={require('../../Images/error.png')}></Image>
      </TouchableOpacity>
    );
  };

  senduserreport = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    let user_id = userdata.user_id;
    let data = this.state.data;
    var other_user_id = data.other_user_id;
    var url =
      config.apiUrl +
      'chat_report_submit.php?user_id=' +
      user_id +
      '&other_user_id=' +
      other_user_id +
      '&report_type=chat';
    this.setState({loading: true});
    fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(obj => {
        this.setState({loading: false});
        return obj.json();
      })
      .then(obj => {

        if (obj.success == 'true') {
          msgProvider.alert('', obj.msg[config.language], false);
        } else {
          if (obj.account_active_status == 'deactivate') {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          msgProvider.alert('', obj.msg[config.language], false);
          return false;
        }
      })
      .catch(error => {
        this.setState({loading: false});
        msgProvider.alert(
          msgTitle.server[config.language],
          msgText.servermessage[config.language],
          false,
        );
      });
  };

  clearchatbtn = () => {
    Alert.alert(
      'Are you sure you want to clear chat ?', // message
      '',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.ClearChatConfirm();
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };
  ClearChatConfirm = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    let data = this.state.data;
    var user_id = userdata.user_id;
    var other_user_id = data.other_user_id;
    // var item_id = data.item_id;
    var chat_type = 'Item_chat';

    var messageIdME = 'u_' + user_id + '__u_' + other_user_id;
    var id = 'u_' + user_id;
    var otherId = 'u_' + other_user_id;
    let jsonUsesadsssfrData = {};

    firebase
      .database()
      .ref()
      .child('message' + '/' + messageIdME + '/')
      .remove();
      firebase
      .database()
      .ref('users/' + id + '/myInbox/' + otherId + '/').remove()
    this.setState({data1: [], modalVisible: false},()=>{
        global.FirebaseInboxJson = []
        firebaseprovider.getMyInboxAllData()
        this.props.navigation.navigate('Inbox')
       
    });


  };
  btnOpneImageOption = async index => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.8,
    };

    const response = await launchImageLibrary(options);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      console.log('RES======', response);
      this.setState({
        filePath: response,
        fileData: response?.data,
        fileUri: response?.uri,
        imagedata: true,
        camraon: true,
        loading: true,
        profileimagehide: true,
        openDate: false,
      });
      let user_id = this.state.user_id;
      var url = config.apiUrl + 'chat_file_upload.php';
      var data2 = new FormData();

      data2.append('user_id', user_id);
      data2.append('file_type', 'image');
      data2.append('image', {
        uri: response.uri,
        type: 'image/jpg', // or photo.type
        name: 'image.jpg',
      });
      console.log('url', url);
      // this.setState({loading:true,})
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: data2,
      })
        .then(obj => {
          return obj.json();
        })
        .then(obj => {
          if (obj.success == 'true') {
            this.setState({loading: false,bottom: 0, loading: false});
          
            this.sendmessagecallbtn('image', obj.file);
          } else {
            this.setState({loading: false});
            msgProvider.alert(msgTitle.information[0], obj.msg[0], false);
            return false;
          }
        })
        .catch(error => {
          msgProvider.alert(
            msgTitle.server[0],
            msgText.servermessage[0],
            false,
          );
        });
    }
  };
  permmissionsendreport = () => {
    Alert.alert(
      'Confirm?',
      'Are your sure you want to report?',
      [
        {
          text: 'Yes',
          onPress: () => this.senduserreport(),
        },
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };
  permmissionclearchat = () => {
    Alert.alert(
      'Confirm?',
      'Are your sure you to clear chat?',
      [
        {
          text: 'Yes',
          onPress: () => this.ClearChatConfirm(),
        },
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };
  render() {
    return (
      <View style={[styles.container, {marginTop: StatusBar.currentHeight}]}>
        <StatusBar translucent backgroundColor={Colors.orange} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}>
          <TouchableOpacity
            style={{flex: 1}}
            activeOpacity={1}
            onPressOut={() => {
              this.setState({modalVisible: false});
            }}>
            <View
              style={{
                backgroundColor: '#f5f4f2',
                height: 'auto',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}>
              <View style={{paddingTop: 15, paddingHorizontal: 20}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({modalVisible: false});
                    this.permmissionsendreport();
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 15,
                      fontFamily: 'Ubuntu-Light',
                    }}>
                    {'Report User'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{paddingVertical: 16}}
                  onPress={() => {
                    this.setState({modalVisible: false});
                    this.permmissionclearchat();
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Ubuntu-Light',
                      fontSize: 15,
                    }}>
                    {'Clear Chat'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{paddingBottom: 15}}
                  onPress={() => {
                    this.setState({modalVisible: false});
                  }}>
                  <Text
                    style={{
                      color: 'red',
                      fontSize: 15,
                      fontFamily: 'Ubuntu-Light',
                    }}>
                    {'Cancel'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <View
          style={{
            paddingTop: 30,
            paddingBottom: 45,
            backgroundColor: Colors.orange,
            flexDirection: 'row',
            width: '100%',
          }}>
          <View style={{width: '15%', alignSelf: 'center'}}>
            <TouchableOpacity
              style={{width: '100%', paddingTop: 3}}
              onPressOut={() => {
                this.props.navigation.goBack();
              }}>
              {/* <Image
                source={require('../../Images/backw.png')}
                style={{width: 26, height: 14, alignSelf: 'center'}}
              /> */}
              <Icon
                name="arrow-back"
                type="ionicons"
                size={24}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{flexDirection: 'row', alignSelf: 'center', width: '85%'}}>
            <View
              style={{
                flexDirection: 'row',
                width: '80%',
                alignItems: 'center',
              }}>
              {this.state.data.image == undefined ||
              this.state.data.image == 'NA' ||
              this.state.data.image == null ? (
                <Image
                  source={require('../../Images/error.png')}
                  style={{
                    width: 30,
                    alignSelf: 'center',
                    height: 30,
                    resizeMode: 'cover',
                    borderRadius: 5,
                  }}
                />
              ) : (
                <Image
                  source={{uri: config.imageUrl + this.state.data.image}}
                  style={{
                    width: 30,
                    alignSelf: 'center',
                    height: 30,

                    borderRadius: 15,
                  }}
                />
              )}
              <Text
                style={{
                  color: 'white',
                  fontSize: 17,
                  fontFamily: FontFamily.bold,
                  paddingLeft: 10,
                }}>
                {this.state.data.other_user_name}
              </Text>
            </View>
            <View style={{width: '15%', alignItems: 'flex-end'}}>
              <TouchableOpacity
                style={{width: '100%', alignItems: 'flex-end'}}
                onPressOut={() => {
                  this.setState({modalVisible: true});
                }}>
                <Icon name="dots-three-vertical" type="entypo" color={'#fff'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            marginBottom: 50,
            borderRadius: 20,
            width: '100%',
            height: '100%',

            paddingTop: 10,
            marginTop: -25,
            backgroundColor: '#fff',
          }}>
              <ScrollView>
          <FlatList
            data={this.state.data1}
            showsVerticalScrollIndicator={false}
            ref={ref => (this.FlatListRef = ref)} // assign the flatlist's ref to your component's FlatListRef...
            onContentSizeChange={() => this.FlatListRef.scrollToEnd()} // scroll it
            contentContainerStyle={{marginBottom: 200}}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="always"
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    width: '97%',
                    alignSelf: 'center',
                    paddingVertical: 7,
                  }}>
                  {item.userid != this.state.user_id && (
                    <View
                      style={{
                        alignSelf: 'flex-start',
                        width: '70%',
                        flexDirection: 'row',
                      }}>
                      {this.state.data?.image !== 'NA' &&
                      this.state.data?.image &&
                      this.state.data?.image.length > 0 ? (
                        <Image
                          source={{
                            uri: config.imageUrl + this.state.data?.image,
                          }}
                          style={{
                            width: 25,
                            height: 25,
                            borderRadius: 5,
                            marginHorizontal: 5,
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../../Images/error.png')}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 5,
                            marginHorizontal: 5,
                            // backgroundColor: back_img,
                          }}
                        />
                      )}
                      <View
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.03)',
                          paddingVertical: 1.5,
                          paddingHorizontal: 8,
                          alignSelf: 'flex-start',
                          borderTopStartRadius: 6,
                          borderTopEndRadius: 6,
                          borderBottomLeftRadius: 6,
                        }}>
                        {item.messageType == 'text' && (
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'Ubuntu-Bold',
                              color: 'black',
                              padding: 10,
                            }}>
                            {item.name}
                          </Text>
                        )}
                        {item.messageType == 'image' && (
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                              this.props.navigation.navigate('Imagefullview', {
                                images: item.name,
                              });
                            }}>
                            <Image
                              source={{uri: config.imageUrl + item.name}}
                              style={{
                                width: (BannerWidth * 42) / 100,
                                height: (BannerHieght * 30) / 100,
                                borderRadius: 5,
                                backgroundColor: back_img,
                              }}
                            />
                          </TouchableOpacity>
                        )}
                        {/* <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'Ubuntu-Light',
                              color: 'gray',
                            }}>
                            {item.time}
                          </Text> */}
                      </View>
                    </View>
                  )}
                  {item.userid == this.state.user_id && (
                    <View
                      style={{
                        width: '70%',
                        alignContent: 'flex-end',
                        flexDirection: 'row-reverse',
                        alignSelf: 'flex-end',
                      }}>
                      {this.state.user_image !== 'NA' &&
                      this.state.user_image?.length > 0 &&
                      this.state.user_image ? (
                        <Image
                          source={{
                            uri: config.imageUrl + this.state.user_image,
                          }}
                          style={{
                            width: 25,
                            height: 25,
                            borderRadius: 5,
                            marginHorizontal: 5,
                            alignSelf: 'flex-start',
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../../Images/error.png')}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 5,
                            marginHorizontal: 5,
                            alignSelf: 'flex-start',
                            // backgroundColor: back_img,
                          }}
                        />
                      )}
                      <View
                        style={{
                          backgroundColor: '#FEE1CE',
                          borderTopStartRadius: 6,
                          borderTopEndRadius: 6,
                          borderBottomLeftRadius: 6,
                          paddingVertical: 1.5,
                          paddingHorizontal: 8,
                          alignSelf: 'flex-end',
                        }}>
                        {item.messageType == 'text' && (
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'Ubuntu-Light',
                              color: '#000',
                              padding: 10,
                            }}>
                            {item.name}
                          </Text>
                        )}
                        {item.messageType == 'image' && (
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                              this.props.navigation.navigate('Imagefullview', {
                                images: item.name,
                              });
                            }}>
                            <Image
                              source={{uri: config.imageUrl + item.name}}
                              style={{
                                width: (BannerWidth * 42) / 100,
                                height: (BannerHieght * 30) / 100,
                                borderRadius: 5,
                                backgroundColor: 'red',
                              }}
                            />
                          </TouchableOpacity>
                        )}
                        {/* <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'Ubuntu-Light',
                              color: '#FFFFFF',
                            }}>
                            {item.time}
                          </Text> */}
                      </View>
                    </View>
                  )}
                </View>
              );
            }}
          />
          </ScrollView>
        </View>

        <View
          style={{
            position: 'absolute',
            borderTopWidth: 0.6,
            bottom: Platform.OS === 'ios' ? this.state.bottom : 0,
            left: 0,
            right: 0,
            borderTopColor: '#FFFFFF',
            backgroundColor: '#fff',
            paddingBottom: 2,
          }}>
          {this.state.data.blockstatus != 'no' && (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Blockuser');
              }}>
              <View style={{alignSelf: 'center', paddingVertical: 10}}>
                <Text
                  style={{
                    color: Colors.orange,
                    fontSize: 15,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}>
                  you blocked this user.tap to unblock
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {this.state.data.blockstatus == 'no' && (
            <View
              style={{
                flexDirection: 'row',
                borderColor: 'rgba(0, 0, 0, 0.03)',
                elevation: 2,
                width: '100%',
                paddingVertical: 10,
              }}>
              <TouchableOpacity
                style={{
                  height: 35,
                  width: '10%',
                  height: 35,
                  alignSelf: 'center',
                  paddingHorizontal: 10,
                  marginHorizontal: 10,
                }}
                onPress={() => {
                  this.btnOpneImageOption();
                }}>
                {/* <Icon name='camera' size={20} color={Colors.buttoncolor} style={{alignSelf:'center'}}/> */}

                <View
                  style={{
                    elevation: 1,
                    height: 35,
                    borderWidth: 1,
                    width: 35,
                    borderColor: 'rgba(0, 0, 0, 0.03)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../../Images/upload-image.png')}
                    style={{width: 20, height: 20, resizeMode: 'cover'}}
                  />
                </View>
              </TouchableOpacity>

              <TextInput
                placeholder={'Message'}
                placeholderTextColor={Colors.orange}
                ref={input => {
                  this.chatmsg = input;
                }}
                onChangeText={txt => {
                  this.setState({chatmsg: txt});
                }}
                keyboardType="default"
                onFocus={() => {
                  this.setState({Numberbtn: 1, bottom: 43});
                }}
                blurOnSubmit={true}
                scrollEnabled={true}
                onSubmitEditing={() => {
                  this.setState({bottom: 0});
                }}
                style={{
                  width: '77%',
                  paddingRight: 6,
                  fontFamily: 'Ubuntu-Light',
                  paddingVertical: 8,
                  color: 'black',
                }}
              />
              {this.state.chatmsg.length > 0 && (
                <TouchableOpacity
                  style={{
                    width: '13%',
                    alignSelf: 'center',
                    alignContent: 'center',
                  }}
                  onPress={() => {
                    this.sendmessagebtn();
                  }}>
                  <Image
                    source={require('../../Images/send.png')}
                    style={{width: 25, height: 15, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              )}

              {this.state.chatmsg.length <= 0 && (
                <TouchableOpacity
                  style={{
                    width: '13%',
                    alignSelf: 'center',
                  }}></TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>

      // </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: Colors.orange,
    width: '90%',
    borderRadius: 8,
    paddingVertical: 8.5,
    marginTop: 7,
    marginTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
  ImageBackground: {
    //height: '100%',
    // width: Sizes.width,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.black,
  },
  ImageBackground_Img: {
    opacity: 0.5,
  },
});
