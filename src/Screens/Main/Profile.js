import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
  Image,
  I18nManager,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import I18n from '../../Translations/i18'
import {Icon, Input, Card, Rating, AirbnbRating} from 'react-native-elements';
import axios from 'axios';
import {s} from '../../Components/Header';
import {back_img4, Colors, FontFamily, Sizes} from '../../Constants/Constants';
import {useNavigation} from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../Constants/config';
import {Loading} from '../../Components/Loader';
const CustomHeader = ({name}) => {
  const nav = useNavigation();
  const gotoSettings = () => {
    nav.navigate('Settings');
  };
  const gotoEditProfile = () => {
    nav.navigate('Edit_Profile');
  };
  return (
    <ImageBackground
      style={[s.ImageBackground, {height: 300, paddingTop: 15}]}
      source={back_img4}
      imageStyle={[s.ImageBackground_Img, {opacity: 0.8}]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '90%',
          marginTop: 30,
          alignSelf: 'center',
          backgroundColor: 'transparent',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => gotoEditProfile()}>
          <Icon name="edit" type="feather" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={{fontFamily: FontFamily.semi_bold, color: Colors.white}}>
          {name}
        </Text>
        <TouchableOpacity onPress={() => gotoSettings()}>
          <Icon
            name="md-settings-outline"
            type="ionicon"
            size={25}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const Profile = (props) => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [totalcount, setTotalcount] = useState('');
  const [totalrating, setTotalrating] = useState(null);
  const [totalWalet, setTotalWalet] = useState(0);
  const [loader, setLoader] = useState(false);
  // --------------------------------------- //
  const gotoWithdraw = () => {
    navigation.navigate('MyWithdraw');
  };
  const gotoWallet = () => {
    navigation.navigate('MyWallet');
  };
  const gotoRatings = () => {
    navigation.navigate('Ratings');
  };
  useEffect(async () => {
    review_data();
    wallet_data();
    setLoader(true);
    getData();
    navigation.addListener('focus', () => {
      getData();
    });
  }, []);

  const getData = async () => {
    let userInfo = await AsyncStorage.getItem('userInfo');
    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl + '/getUserDetails.php?user_id_post=' + parsedInfo.id;
    axios
      .get(url)
      .then(res => {
        if (res.data.success === 'true') {
          console.log('user details---',res.data.user_details)
          setLoader(false);
          setData(res.data.user_details);
        } else {
          setLoader(false);
          if(props.language_id ==0)
          alert(res.data.msg[0]);
          else  alert(res.data.msg[1]);
        }
      })
      .catch(err => {
        setLoader(false);
      });
  };
  const review_data = async () => {
    let userInfo = await AsyncStorage.getItem('userInfo');
    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl + '/ratingreviewList.php?user_id_post=' + parsedInfo.id;
    axios
      .get(url)
      .then(res => {
        if (res.data.success === 'true') {
          setTotalcount(res.data.total_rating.count);
          setTotalrating(res.data.total_rating.rating);
        } else {
          if(props.language_id == 0)
          alert(res.data.msg[0]);
          else  alert(res.data.msg[1]);
        }
      })
      .catch(err => console.log(err));
  };
  const wallet_data = async () => {
    let userInfo = await AsyncStorage.getItem('userInfo');
    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl + '/wallet_history_owner.php?user_id_post=' + parsedInfo.id;
    axios
      .get(url)
      .then(res => {
        if (res.data.success === 'true') {
         

          setTotalWalet(res.data.total_earning);
        } else {
          if(props.language_id == 0)
          alert(res.data.msg[0]);
          else  alert(res.data.msg[1]);
          console.log(res.data.success);
        }
      })
      .catch(err => console.log(err));
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <CustomHeader name={I18n.translate('profile')} />
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent
      />
      <View style={sb.SEC2}>
        {loader ? (
          <Loading />
        ) : (
          <View style={{flex: 1}}>
            <Image
              source={{
                uri:
                  data.image !== 'NA'
                    ? config.imageUrl + data.image
                    : 'https://media.istockphoto.com/vectors/no-image-available-sign-vector-id922962354?k=20&m=922962354&s=612x612&w=0&h=f-9tPXlFXtz9vg_-WonCXKCdBuPUevOBkp3DQ-i0xqo=',
              }}
              style={{
                height: 150,
                width: 150,
                borderRadius: 20,
                alignSelf: 'center',
                marginTop: -100,
              }}
            />
            <View style={{alignSelf: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 20, fontFamily: FontFamily.semi_bold}}>
                {data.f_name} {data.l_name}
              </Text>
              <Text style={[sb.Text, {fontSize: 14}]}>
                {data.bussness_name}
              </Text>
              <Text
                style={[
                  sb.Text,
                  {
                    fontSize: 13,
                    fontStyle: 'italic',
                    color: '#333',
                    opacity: 0.4,
                  },
                ]}>
                {data?.city_name?.length
                  ? props.language_id == 0? data?.city_name[0]: data?.city_name[1]
                  : I18n.translate('address_not_available')}
              </Text>
              <Text style={[sb.Text, {fontSize: 14}]}>#{data.user_id}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* TWO BTNS  */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 30,
                }}>
                <TouchableOpacity
                  style={{
                    height: 81,
                    width: 160,
                    backgroundColor: 'rgba(249, 105, 9, 0.76)',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => gotoWallet()}>
                  <Text
                    style={{
                      fontFamily: FontFamily.semi_bold,
                      color: Colors.white,
                      fontSize: 17,
                    }}>
                    {I18n.translate('kwd')} {totalWalet ? totalWalet : '0'}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FontFamily.default,
                      color: Colors.white,
                      fontSize: 14,
                    }}>
                    {I18n.translate('my_wallet')}
                  </Text>
                </TouchableOpacity>
                {/*  */}
                <TouchableOpacity
                  style={{
                    height: 81,
                    width: 160,
                    backgroundColor: 'rgba(249, 105, 9, 0.76)',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => gotoRatings()}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[sb.Text, {color: Colors.white}]}>
                      [{totalcount}]
                    </Text>
                    <AirbnbRating
                      showRating={false}
                      size={14}
                      count={5}
                      defaultRating={totalrating}
                      isDisabled
                      selectedColor="#FFCC39"
                      starContainerStyle={{
                        elevation: 5,
                      }}
                    />
                  </View>
                  <Text style={[sb.Text, {fontSize: 14, color: Colors.white}]}>
                   {I18n.translate('review')}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* THREE OPT  */}
              <View>
                {/* 1 option */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('manageBoats')}>
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
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name="settings" type="octicon" />
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: FontFamily.semi_bold,
                            marginHorizontal: 7,
                          }}>
                         {I18n.translate('manage_boat')}
                        </Text>
                      </View>
                      <Icon name="arrow-right" type="evilicon" />
                    </View>
                  </Card>
                </TouchableOpacity>
                {/* 2 */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('manageStaff')}
                  >
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
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name="settings" type="octicon" />
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: FontFamily.semi_bold,
                            marginHorizontal: 7,
                          }}>
                          Manage Your Staff
                        </Text>
                      </View>
                      <Icon name="arrow-right" type="evilicon" />
                    </View>
                  </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => gotoWithdraw()}>
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
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name="settings" type="octicon" />
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: FontFamily.semi_bold,
                            marginHorizontal: 7,
                          }}>
                         {I18n.translate('withdrawal')}
                        </Text>
                      </View>
                      <Icon name="arrow-right" type="evilicon" />
                    </View>
                  </Card>
                </TouchableOpacity>
                {/* 3 */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('History')}
                  style={{marginBottom: 15}}>
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
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name="settings" type="octicon" />
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: FontFamily.semi_bold,
                            marginHorizontal: 7,
                          }}>
                        {I18n.translate('history')}
                        </Text>
                      </View>
                      <Icon name="arrow-right" type="evilicon" />
                    </View>
                  </Card>
                </TouchableOpacity>
                {/*  */}
              </View>
              {/* DETAILS */}
              <View style={{marginHorizontal: 25, marginBottom: 20}}>
                <Text
                  style={[
                    sb.Text,
                    {
                      lineHeight: 28,
                      fontSize: 14,
                      opacity: 0.6,
                      color: Colors.black,
                    },
                  ]}>
                  {data?.email}
                </Text>
                <Text
                  style={[
                    sb.Text,
                    {
                      lineHeight: 28,
                      fontSize: 14,
                      opacity: 0.6,
                      color: Colors.black,
                    },
                  ]}>
                  {data?.mobile}
                </Text>
                {/* <Text
                  style={[
                    sb.Text,
                    {
                      lineHeight: 28,
                      fontSize: 14,
                      opacity: 0.6,
                      color: Colors.black,
                    },
                  ]}>
                  {}
                </Text> */}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};
const sb = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    marginTop: -50,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
  },
  Text: {
    fontFamily: FontFamily.default,
  },
});
const mapStateToProps = (state)=>({
  language_id: state.data_Reducer.language_id

})


export default connect(mapStateToProps)(Profile)
