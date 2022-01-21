import React, {Component} from 'react';
import {I18nManager, SafeAreaView, StatusBar, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../Constants/config';
import {localStorage} from '../ChatModule/localStorageProvider';
import {msgProvider, msgTitle, msgText} from '../ChatModule/messageProvider';
import Header from '../../Components/Header';
import {back_img, Colors, FontFamily, Sizes} from '../../Constants/Constants';
// import Footer from './Footer';
import I18n from '../../Translations/i18'
import {connect, useDispatch} from 'react-redux';
import axios from 'axios';
import {Icon} from 'react-native-elements';
import {firebaseprovider} from '../Provider/FirebaseProvider';
import firebase from '../ChatModule/Config1';
import NetInfo from '@react-native-community/netinfo';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';

// import Footer from './Provider/Footer';
// import { Nodata_found } from './Nodata_found';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      isConnected: true,
      loadMoreloading: false,
      pagename: 'inbox',
      page: 'message',
      inboxmessage: [],
      loading: false,
      idex1: 0,
      user_id: '',
      notification_arr: 'NA',
      refresh: false,
      bookingListDetails: [],
      availablePeopleToChat: [],
      modalVisible: false,
      placeholderText: '',
      availablePeopleToChatCopy: [],
    };
  }
  getBookingListForOwner = async () => {
    let userInfo = await AsyncStorage.getItem('userInfo');
    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl + '/booking_list_owner.php?user_id_post=' + parsedInfo.id;
    axios
      .get(url)
      .then(res => {
        if (res.data.success === 'true') {
          res.data.upcoming_booking_arr?.length &&
            this.setState(
              {
                bookingListDetails: res.data.upcoming_booking_arr.length && res.data.upcoming_booking_arr !== 'NA' ?res.data.upcoming_booking_arr: [],
              },
              () => {
                this.setAvailableChatDetails();
              },
            );
        } else {
          if(this.props.language_id == 0)
          alert(res.data.msg[0]);
          else   alert(res.data.msg[1]);
          console.log(res.data.success);
        }
      })
      .catch(err => console.log(err));
  };

  checkBookingStatus = item => {
    let found = false;
    FirebaseUserJson?.length &&
      FirebaseUserJson.map((innerItem, index) => {
        if (innerItem.user_type === 1 && item.user_id === innerItem.user_id) {
          found = true;
        }
        // if (
        //   innerItem.user_type === 1 &&
        //   (item.user_id === 31 || item.user_id === 17)
        // ) {
        //   found = true;
        // }
      });

    return found;
  };
  setAvailableChatDetails = () => {
    let availablePeopleToChat = [];
    let bookingDetails = this.state.bookingListDetails;
    bookingDetails?.length &&
      bookingDetails.map(item => {
        if (this.checkBookingStatus(item)) {
          availablePeopleToChat.push(item);
        }
      });

    this.setState({
      availablePeopleToChat,
      availablePeopleToChatCopy: availablePeopleToChat,
    });
  };
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getBookingListForOwner();
      this.showUserInbox();
    });
    this.getBookingListForOwner();
    firebaseprovider.firebaseUserGetInboxCount();
    this.showUserInbox();
    NetInfo.fetch().then(state => {
      this.setState({isConnected: state.isConnected});
    });
    const unsubscribe = NetInfo.addEventListener(state => {
      this.setState({isConnected: state.isConnected});
    });
  }
  getMyInboxAllData1 = async () => {
    userdata = await localStorage.getItemObject('user_arr');
    if (userdata != null) {
      let id = 'u_' + userdata.user_id;
      if (inboxoffcheck > 0) {
        var queryOffinbox = firebase
          .database()
          .ref('users/' + id + '/myInbox/')
          .child(userChatIdGlobal);
        queryOffinbox.off('child_changed');
      }

      var queryUpdatemyinboxmessage = firebase
        .database()
        .ref('users/' + id + '/myInbox/');
      queryUpdatemyinboxmessage.on('child_changed', data => {
        setTimeout(() => {
          this.showUserInbox();
        }, 3000);
      });
      var queryUpdatemyinboxadded = firebase
        .database()
        .ref('users/' + id + '/myInbox/');
      queryUpdatemyinboxadded.on('child_added', data => {
        setTimeout(() => {
          this.showUserInbox();
        }, 3000);
      });
    }
  };

  convertTimeAllFormat = (time11, format) => {
    time11 = parseInt(time11);

    var date1 = new Date(time11);

    var curr_day = date1.getDay();
    var curr_date = date1.getDate();
    var curr_month = date1.getMonth();
    var curr_year = date1.getFullYear();

    var hours = date1.getHours();
    var minutes = date1.getMinutes();

    if (format == 12) {
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
    } else if (format == 24) {
      var ampm = hours >= 12 ? 'PM' : 'AM';
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes;
    } else if (format == 'other') {
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTimeAll = hours + ':' + minutes + ' ' + ampm;
      var strTime =
        curr_date +
        '. ' +
        m_names_sort[curr_month] +
        ' ' +
        curr_year +
        ' ' +
        strTimeAll;
    } else if (format == 'ago') {
      var strTime = timeSince(new Date(time11));
    } else if (format == 'date_time') {
      var date = new Date(time11);

      var seconds = Math.floor((new Date() - date) / 1000);
      var interval = Math.floor(seconds / 3600);
      if (interval <= 24) {
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
      } else {
        var curr_month = date1.getMonth() + 1; //Months are zero based
        var curr_year = date1.getFullYear();
        var curr_year_small = String(curr_year);
        curr_year_small = curr_year_small.substring(2, 4);
        var strTime = curr_month + '/' + curr_date + '/' + curr_year_small;
      }
    } else if (format == 'date_time_full') {
      var date = new Date(time11);

      var seconds = Math.floor((new Date() - date) / 1000);
      var interval = Math.floor(seconds / 3600);
      if (interval <= 24) {
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
      } else {
        var curr_month = date1.getMonth() + 1; //Months are zero based
        var curr_year = date1.getFullYear();
        var curr_year_small = String(curr_year);
        curr_year_small = curr_year_small.substring(2, 4);

        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTimeAll = hours + ':' + minutes + ' ' + ampm;

        var strTime =
          curr_month +
          '/' +
          curr_date +
          '/' +
          curr_year_small +
          ' ' +
          strTimeAll;
      }
    }

    return strTime;
  };

  showUserInbox = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    var user_id = userdata.user_id;
    var login_type = userdata.login_type;
    inboxoffcheck = 1;
    var inbox = [];
    var len = FirebaseInboxJson.length;
    if (len > 0) {
      FirebaseInboxJson.sort((a, b) => {
        var x = a.lastMsgTime,
          y = b.lastMsgTime;
        return x > y ? -1 : x < y ? 1 : 0;
      });
      let other_user_id55 = 0;
      for (
        let k = 0;
        k < FirebaseInboxJson.length;
        k++ // FirebaseInboxJson.map((keyValue)=>
      ) {
        let keyValue = FirebaseInboxJson[k];
        if (keyValue.user_id != other_user_id55) {
          var other_user_id = keyValue.user_id;
          var blockstatus = keyValue.block_status;
          other_user_id55 = keyValue.user_id;
          var user_data_other = FirebaseUserJson.findIndex(
            x => x.user_id == other_user_id,
          );
          if (user_data_other != -1) {
            var userDataMe = FirebaseUserJson[user_data_other];

            var count = keyValue.count;
            var lastMessageType = keyValue.lastMessageType;
            var lastMsg = keyValue.lastMsg;
            var lastMsgTime = keyValue.lastMsgTime;
            var userId = userDataMe.user_id;
            if (userDataMe.login_type == 'app') {
              var userImage = config.imageUrl + userDataMe.image;
            } else {
              var userImage = userDataMe.image;
            }

            var userName = userDataMe.name;
            var onlineStatus = userDataMe.onlineStatus;

            var lastMsgShow = '';
            if (lastMessageType == 'text') {
              lastMsgShow = lastMsg;
            } else if (lastMessageType == 'image') {
              lastMsgShow = 'Photo';
            }

            var imgOnline = '';
            var countHtml = '';
            if (lastMsgTime != '') {
              lastMsgTime = this.convertTimeAllFormat(lastMsgTime, 'date_time');
              // lastMsgTime=lastMsgTime
              countHtml = '';
            } else {
              lastMsgTime = '';
            }
            if (count > 0) {
              countHtml = count;
            }
            let data5 = {
              name: userName,
              images: userImage,
              message: lastMsgShow,
              time: lastMsgTime,
              count: count,
              other_user_id: other_user_id,
              blockstatus: blockstatus,
              vip_staus_me: userdata.vip_staus_me,
            };
            inbox.push(data5);
          }
        }
      }
    }
    this.setState({inboxmessage: inbox, inboxmessage2: inbox, refresh: false});
  };
  SearchFilterFunction = text => {
    //passing the inserted text in textinput
    let data1 = this.state.inboxmessage2;
    const newData = data1.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    if (newData.length > 0) {
      this.setState({
        inboxmessage: newData,
        search: text,
      });
    } else {
      this.setState({
        inboxmessage: 'NA',
        search: text,
      });
      this.setState({msg: 'This Type of data is not available'});
    }
  };
  _onRefresh = () => {
    this.setState({refresh: true});
    this.showUserInbox();
  };

  loadMore = () => {
    if (this.state.notification_arr != 'NA') {
      this.setState(
        {
          loadMoreloading: true,
          page: this.state.page + 1,
        },
        () => {
          this.getallnotification1();
        },
      );
    }
  };

  checkfreindstatus = async item => {
    let userdata = await localStorage.getItemObject('user_arr');
    let user_id = userdata.user_id;
    if (this.state.isConnected == true) {
      let url =
        config.apiUrl +
        'check_friendstateus.php?user_id=' +
        user_id +
        '&other_user_id=' +
        item.other_user_id;
      axios
        .get(url)
        .then(obj => {
          if (obj.success == 'true') {
            if (
              item.vip_staus_me == 1 ||
              obj.friend_status == 1 ||
              obj.vip_staus_me == 1
            ) {
              this.props.navigation.navigate('Chat', {
                chatdata: {
                  other_user_id: item.other_user_id,
                  other_user_name: item.name,
                  image: item.images,
                  blockstatus: item.blockstatus,
                },
              });
            } else {
              this.props.navigation.navigate('Becomevip');
            }
          } else {
            msgProvider.alert(msgTitle.information[0], obj.msg[0], false);
            return false;
          }
        })
        .catch(error => {
          this.setState({loading: false});
        });
    } else {
      msgProvider.alert(
        msgTitle.internet[0],
        msgText.networkconnection[0],
        false,
      );
    }
  };

  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (this.state.loadMoreloading == true) {
      return <ActivityIndicator style={{color: '#000'}} />;
    } else {
      return null;
    }
  };

  renderitem = ({item}) => {
    if (this.state.inboxmessage.length >= 0) {
      return (
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            backgroundColor: '#ffffff',
            marginVertical: 5,
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.props.navigation.navigate('Chat', {
                chatdata: {
                  other_user_name: item.name,
                  image: item.images,
                  other_user_id: item.other_user_id,
                  blockstatus: 'no',
                },
              });
            }}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                elevation: 5,
                borderColor: 'rgba(0, 0, 0, 0.03)',
                marginBottom: 5,
                paddingHorizontal: 10,
                paddingVertical: 10,
                flexDirection: 'row',
                width: '100%',
                borderWidth: 0.5,
                borderColor: '#cfcfcf',
              }}>
              <View
                style={{
                  width: '15%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {item.images == undefined ||
                item.images == 'NA' ||
                item.images === null ? (
                  <ImageBackground
                    imageStyle={{borderRadius: 20}}
                    style={{
                      width: 40,
                      height: 40,
                      resizeMode: 'contain',
                      borderRadius: 5,
                    }}
                    source={require('../../Images/error.png')}
                  />
                ) : (
                  <ImageBackground
                    imageStyle={{borderRadius: 20}}
                    style={{
                      width: 40,
                      height: 40,
                      resizeMode: 'contain',
                      borderRadius: 5,
                    }}
                    source={{
                      uri: config.imageUrl + item.images,
                    }}></ImageBackground>
                )}
              </View>

              <View style={{marginLeft: 10, width: '65%', alignSelf: 'center'}}>
                <Text style={{fontSize: 18, fontFamily: FontFamily.bold}}>
                  {item.name}
                </Text>
                <Text style={{fontSize: 12, fontFamily: 'Ubuntu-Regular'}}>
                  {item.message}
                </Text>
              </View>
              <View
                style={{
                  width: '20%',
                  alignSelf: 'center',
                  alignItems: 'flex-end',
                  right: 19,
                }}>
                {item.count != 0 && (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'green',
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 12,
                        fontFamily: 'Ubuntu-Regular',
                      }}>
                      {item.count}
                    </Text>
                  </View>
                )}
                <Text style={{fontSize: 13, fontFamily: 'Ubuntu-Regular'}}>
                  {item.time}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };
  searchPeople = e => {
    let text = e.toLowerCase();
    let availablePeopleToChatCopy = this.state.availablePeopleToChat;
    let filteredName = availablePeopleToChatCopy.filter(item => {
      return item.user_name.toLowerCase().match(text);
    });
    if (!text || !text.length || text === '') {
      this.setState({
        availablePeopleToChatCopy: this.state.availablePeopleToChat,
      });
    } else if (!filteredName.length) {
      this.setState({
        availablePeopleToChatCopy: this.state.availablePeopleToChat,
      });
    } else if (Array.isArray(filteredName)) {
      this.setState({availablePeopleToChatCopy: filteredName});
    }
  };
  render() {
    return (
      <View style={{backgroundColor: '#fff', flex: 1}}>
        <Header name={I18n.translate('inbox')} imgBack={true} backBtn />
        <Modal
          animationType="slide"
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <AntDesign
                name={'arrowleft'}
                onPress={() => {
                  this.setState({modalVisible: false});
                }}
                size={25}
                style={{padding: 5, marginHorizontal: 10}}
              />

              <TextInput
                textAlign={this.props.language_id == 0? 'left':'right'}
                placeholder={I18n.translate('search_people')}
                value={this.state.placeholderText}
                onChangeText={text => {
                  this.setState({placeholderText: text}, () => {
                    this.searchPeople(text);
                  });
                }}
                style={{
                  borderWidth: 1,
                  borderColor: Colors.orange,
                  width: '85%',
                  borderRadius: 10,
                  marginVertical: 10,
                }}
              />
            </View>

            <FlatList
              data={this.state.availablePeopleToChatCopy}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      //this._selectCity(item);

                      this.setState(
                        {modalVisible: !this.state.modalVisible},
                        () => {
                          this.props.navigation.navigate('Chat', {
                            chatdata: {
                              other_user_id: item.user_id,
                              other_user_name: item.user_name,
                              image: item.image,
                              blockstatus: 'no',
                            },
                          });
                        },
                      );
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 18,
                        marginVertical: 3,
                        marginHorizontal: 20,
                        //textAlign:'right'
                      }}>
                      {item.user_name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => {
            this.setState({modalVisible: !this.state.modalVisible});
          }}
          activeOpacity={0.6}
          style={{
            height: 60,
            width: 60,
            borderRadius: 30,
            backgroundColor: Colors.orange,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            bottom: Dimensions.get('window').height * 0.05,
            right: Dimensions.get('window').width * 0.08,
            zIndex: 1,
          }}>
          <Icon name="plus" type="antdesign" size={30} color={Colors.white} />
        </TouchableOpacity>
        <View
          style={{
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            marginTop: -Dimensions.get('window').height * 0.1,
            flex: 1,
          }}>
          {this.state.inboxmessage.length <= 0 && (
            <View
              style={[
                styles.upcoming_main,
                {alignItems: 'center', justifyContent: 'center', height: 600},
              ]}>
              <Image
                source={require('../../Images/inbox_not_found.png')}
                style={{height: 100, width: 100, resizeMode: 'contain'}}
              />
            </View>
          )}
          <FlatList
            style={{marginTop: 10}}
            data={this.state.inboxmessage}
            renderItem={this.renderitem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state)=>({
  language_id: state.data_Reducer.language_id

})



export default connect(mapStateToProps)(Inbox)

const styles = StyleSheet.create({
  crossimg: {
    resizeMode: 'contain',
    width: 15,
    height: 15,
    alignSelf: 'center',
  },
  imgicon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginTop: 5,
    marginRight: 10,
  },
});
