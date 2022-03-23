import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  I18nManager,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import I18n from '../../Translations/i18'
import {Icon, Input, Card, Rating, AirbnbRating} from 'react-native-elements';
import Header, {s} from '../../Components/Header';
import {back_img4, Colors, FontFamily, Sizes} from '../../Constants/Constants';
import {useNavigation} from '@react-navigation/core';
import {Switch} from 'react-native-elements';
import axios from 'axios';
import config from '../../Constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loading} from '../../Components/Loader';
class Noti_Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ongoingnoti: false,
      chatnoti: false,
      promotion: false,
      loader: false,
      userId: '',
    };
  }
  async componentDidMount() {
    let userInfo = await AsyncStorage.getItem('userInfo');
    let parsedInfo = JSON.parse(userInfo);
    this.setState({userId: parsedInfo.id});
  }

  callApi = index => {
    const {userId} = this.state;
    let status = '';
    if (index === 1) {
      status = 'ongo';
      this.setState({ongoingnoti: !this.state.ongoingnoti});
    } else if (index === 2) {
      status = 'chat';
      this.setState({chatnoti: !this.state.chatnoti});
    } else {
      status = 'promotion';
      this.setState({promotion: !this.state.promotion});
    }

    let url = config.apiUrl + '/notification_on_off.php';

    this.setState({loader: true});
    var data = new FormData();
    data.append('user_id_post', this.state.userId);
    data.append('notification_status', 1);
    data.append('notification_type', status);
    axios
      .post(url, data)
      .then(res => {
        this.setState({loader: false});
        if (res) {
          // this.props.navigation.navigate('Ad');
        } else {
          if(this.props.language_id == 0)
          alert(res.data.msg[0]);
          else   alert(res.data.msg[1]);
        }
      })
      .catch(err => console.log(err));
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <Header
         backBtn={true}
          imgBack={true}
           headerHeight={300}
          name={'Notification Settings'}

            />
        <View style={styles.SEC2}>
          {this.state.loader ? (
            <Loading />
          ) : (
            <View style={{marginTop: 30}}>
              {/* 1 */}
              <View style={{marginBottom: 1}}>
                <Card
                  containerStyle={{
                    height: 50,
                    paddingVertical: 2,
                    justifyContent: 'center',
                    borderRadius: 12,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: FontFamily.semi_bold,
                          marginHorizontal: 7,
                        }}>
                         {I18n.translate('ongoing')}
                      </Text>
                    </View>
                    <View>
                      <Switch
                        value={this.state.ongoingnoti}
                        onChange={() => this.callApi(1)}
                        color="#fff"
                        trackColor={{
                          true: Colors.orange,
                          false: Colors.gray,
                        }}
                      />
                    </View>
                  </View>
                </Card>
              </View>
              {/* 2 */}
              <View style={{marginBottom: 1}}>
                <Card
                  containerStyle={{
                    height: 50,
                    paddingVertical: 2,
                    justifyContent: 'center',
                    borderRadius: 12,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: FontFamily.semi_bold,
                          marginHorizontal: 7,
                        }}>
                         {I18n.translate('chat_not')}
                      </Text>
                    </View>
                    <View>
                      <Switch
                        value={this.state.chatnoti}
                        onChange={() => this.callApi(2)}
                        color="#fff"
                        trackColor={{
                          true: Colors.orange,
                          false: Colors.gray,
                        }}
                      />
                    </View>
                  </View>
                </Card>
              </View>
              {/* 3 */}
              <View style={{marginBottom: 1}}>
                <Card
                  containerStyle={{
                    height: 50,
                    paddingVertical: 2,
                    justifyContent: 'center',
                    borderRadius: 12,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: FontFamily.semi_bold,
                          marginHorizontal: 7,
                        }}>
                        {I18n.translate('promotion')}
                      </Text>
                    </View>
                    <View>
                      <Switch
                        value={this.state.promotion}
                        onChange={() => this.callApi(3)}
                        color="#fff"
                        trackColor={{
                          true: Colors.orange,
                          false: Colors.gray,
                        }}
                      />
                    </View>
                  </View>
                </Card>
              </View>
              {/*  */}
            </View>
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
    height: 100,
  },
});
const mapStateToProps = (state)=>({
  language_id: state.data_Reducer.language_id

})


export default connect(mapStateToProps)(Noti_Setting)
