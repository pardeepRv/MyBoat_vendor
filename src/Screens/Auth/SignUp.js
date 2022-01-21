import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList,
  StatusBar,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import I18n from '../../Translations/i18'
import {Icon, Input, Overlay} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {back_img, Colors, FontFamily, Sizes} from '../../Constants/Constants';
import {useNavigation} from '@react-navigation/core';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import config from '../../Constants/config';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-datepicker';
import OtpInputs from 'react-native-otp-inputs';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Feather from 'react-native-vector-icons/dist/Feather';
import { firebaseprovider } from '../Provider/FirebaseProvider';

/*
email, 
login_type (0 for App, 1 for Facebook, 2 for Google, 3 for twitter, 4 for Instagram, 5 for apple), 
user_type_post (0=admin, 1=user, 2=Client), 
device_type (browser, Android, IOS), 
f_name , 
l_name, 
user_name, 
business_name , 
dob, 
city ( check city_master table for codes for each city), 
language_id (0=English, 1=Arabic), 
country_code (for mobile number), 
phone_number, 
password, 
gender (0 for none, 1 for male, 2 for female), 
player_id
*/

const SignUp = (props) => {
  const Navigation = useNavigation();
  const [cityArr, serCityArr] = useState([]);
  const [cityArrCopy, setCityArrCopy] = useState([]);
  const [isChecked, setChecked] = useState(false)
  const [loader, setloader] = useState(false);
  // -------------------------------------------- //
  const [f_name, setF_name] = useState('');
  const [L_name, setL_name] = useState('');
  const [email, setemail] = useState('');
  const [m_number, setm_number] = useState('');
  const [b_name, setb_name] = useState('');
//   const [b_location, setb_location] = useState('');
  const [dob, setdob] = useState('');
  const [city, setcity] = useState(0);
  const [cityName, setCityName] = useState(I18n.translate('select_city'));

  const [gender, setgender] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPass, setconfirmPass] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  //
  const [userId, setUserId] = useState(null);
  //
  const [visible, setVisible] = useState(false);
  const [visibleCity, setVisibleCity] = useState(false);
  const [otp, setOtp] = useState('');
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  // ----------- //
  const [AllData, setAllData] = useState(null);
  const [AllDataRe, setAllDataRe] = useState(null);
  //
  var raw = {
    f_name: f_name,
    l_name: L_name,
    business_name: b_name,
    country_code: config.country_code,
    language_id: props.language_id,
    login_type: config.login_type,
    device_type: config.device_type,
    dob: dob,
    city: city,
    phone_number: m_number,
    password: password,
    gender: gender === '' ? 0 : gender === 'male' ? 1 : 2,
    player_id: config.player_id,
    user_type_post: config.user_type_post,
  };

  // console.log(signup_data);

  // -----------------------Api Urls--------------------- //
  var url_main = 'https://myboatonline.com/app/webservice';
  var url = config.apiUrl;
  const apiUrl_signup = url + '/signup.php';
  const cityUrl = url + '/city_list.php?country_code=965';
  const mailSendUrl = url + '/mailFunctionsSend.php';
  const resendOtpUrl = url + '/resend_otp.php';
  const verifyOtpUrl = url + '/otp_verify.php';
  // ----------All Citys ----------- //
  const all_city_call = () => {
    axios
      .get(cityUrl)
      .then(res => {
        sortCity(res.data.city_arr);
        serCityArr(res.data.city_arr);
        setCityArrCopy(res.data.city_arr);
      })
      .catch(err => console.log(err));
  };

  // --------------Sign Up ----------- //
  var signup_data = new FormData();
  signup_data.append('f_name', f_name);
  signup_data.append('l_name', L_name);
  signup_data.append('email', email);
  signup_data.append('business_name', b_name);
  signup_data.append('country_code', config.country_code);
  signup_data.append('language_id', props.language_id);
  signup_data.append('login_type', config.login_type);
  signup_data.append('device_type', config.device_type);
  signup_data.append('dob', dob);
  signup_data.append('city', city);
  signup_data.append('phone_number', m_number);
  signup_data.append('password', password);
  signup_data.append('gender', gender === '' ? 0 : gender === 'male' ? 1 : 2);
  signup_data.append('player_id', config.player_id);
  signup_data.append('user_type_post', config.user_type_post);
  // ------------------------------------//

  const sortCity = arr => {
    arr.sort(function (a, b) {
      if (a.city[0] < b.city[0]) {
        return -1;
      }
      if (a.city[0] > b.city[0]) {
        return 1;
      }
      return 0;
    });
    serCityArr(arr);
  };

  const signUp = () => {
    if (password !== confirmPass) {
      alert(I18n.translate('passoword_not_match'));
    } else {
      axios
        .post(apiUrl_signup, signup_data)
        .then(res => {
          setAllData(res.data),
            res.data.success === 'true'
              ? toggleOverlay()
              : alert(res.data.msg[0]);
        })
        .catch(err => console.log('sign_up_error', err));
    }
  };
  // ----------- Mail sent ---------- //
  var email_array = AllData === null ? null : AllData.email_arr;
  var user_details = AllData === null ? null : AllData.user_details;
  useEffect(() => {
    if (AllData !== null) {
      if (AllData.success === 'true') {
        setUserId(user_details.user_id);
        mailSend({email_array: email_array});
      }
    }
  }, [AllData]);

  useEffect(() => {
    if (AllDataRe !== null) {
      if (AllDataRe.success === 'true') {
        mailSend({email_array: AllDataRe.email_arr});
      }
    }
  }, [AllDataRe]);

  console.log(userId);
  const mailSend = ({email_array}) => {
    var email = email_array[0].email;
    var mailcontent = email_array[0].mailcontent;
    var mailsubject = email_array[0].mailsubject;
    var fromName = email_array[0].fromName;
    var mailData = new FormData();
    mailData.append('email', email);
    mailData.append('mailcontent', mailcontent);
    mailData.append('mailsubject', mailsubject);
    mailData.append('fromName', fromName);
    mailData.append('mail_file', 'NA');
    // console.log('mailData==', mailData);
    axios
      .post(mailSendUrl, mailData)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  };
  // ---------- Resend Otp ------ //
  const resendOtp = ({user_id}) => {
    var resend_otp_data = new FormData();
    resend_otp_data.append('user_id_post', user_id);
    axios
      .post(resendOtpUrl, resend_otp_data)
      .then(res => {
        setAllDataRe(res.data),
          setOtp(AllDataRe ? res.data.user_details.otp : null);
      })
      .catch(err => console.log(err));
  };
  // ------------------------------Verify Otp----- //
  console.log('OTP', user_details ? user_details.otp : null);
  /**
   * New Parameters = user_id_post, user_otp, user_type (0=admin, 1=user, 2=Client), device_type (browser, Android, IOS), player_id
   */
  const verifyOtp = ({user_id, user_otp}) => {
    console.log(parseInt(user_otp));
    var verify_otp_data = new FormData();
    verify_otp_data.append('user_id_post', user_id);
    verify_otp_data.append('user_type', config.user_type_post);
    verify_otp_data.append('device_type', config.device_type);
    verify_otp_data.append('player_id', config.player_id);
    verify_otp_data.append('user_otp', parseInt(user_otp));
    axios
      .post(verifyOtpUrl, verify_otp_data)
      .then(res => {
        if (res.data.success === 'true') {
          let user_arr = JSON.stringify(res.data.user_details)
          let userInfo = JSON.stringify({
            id: res.data.user_details.user_id,
            email: res.data.user_details.email,
            phone: res.data.user_details.mobile,
            fname: res.data.user_details.f_name,
            lname: res.data.user_details.l_name,
            image: res.data.user_details.image,
          });
          let jsonUserDataMe = {
            name:res.data.user_details.name,
            email: res.data.user_details.email,
            image: res.data.user_details.image,
            onlineStatus: 'true',
            player_id: null,
            user_id: res.data.user_details.user_id,
            user_type: res.data.user_details.user_type,
            notification_status: res.data.user_details.notification_status,
            chat_room_id: 'no',
            login_type: res.data.user_details.login_type,
          };
          AsyncStorage.setItem('user_arr', user_arr);
          AsyncStorage.setItem('userInfo', userInfo);
          firebaseprovider.CreateUser('u_'+res.data.user_details.user_id, jsonUserDataMe)
        } else {
          null;
        }
        res.data.success === 'true'
          ? (ToastAndroid.show(
              res.data.msg[0],
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            ),
            setVisible(false),
            gotoAddBoatPage())
          : ToastAndroid.show(
              res.data.msg[0],
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
      })
      .catch(err => console.log(err));
  };
  //-----------//
  useEffect(() => {
    all_city_call();
  }, []);
  // --------Navigation --------- //
  const gotoAddBoatPage = () => {
    setloader(true);
    setTimeout(() => {
      setloader(false);
      Navigation.navigate('AddBoat');
    }, 3000);
  };
  const searchCity = e => {
    let text = e.toLowerCase();
    let cityArrCopy = cityArr;
    let filteredName = cityArrCopy.filter(item => {
      return item.city[0].toLowerCase().match(text);
    });
    if (!text || !text.length || text === '') {
      setCityArrCopy(cityArr);
    } else if (!filteredName.length) {
      setCityArrCopy(cityArr);
    } else if (Array.isArray(filteredName)) {
      setCityArrCopy(filteredName);
    }
  };
  console.log('city', cityArr);
  return (
    <View style={{flex: 1, paddingTop: StatusBar.currentHeight + 10}}>
      <StatusBar
        barStyle={'light-content'}
        translucent
        backgroundColor={'transparent'}
      />
      <ImageBackground
        style={s.ImageBackground}
        source={back_img}
        imageStyle={s.ImageBackground_Img}
      />
      <Modal
        visible={visibleCity}
        animationType={'slide'}
        animationInTiming={500}
        animationOutTiming={500}>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign
              name={'arrowleft'}
              onPress={() => {
                setVisibleCity(!visibleCity);
              }}
              size={25}
              style={{padding: 5, marginHorizontal: 10}}
            />

            <TextInput
              placeholder={I18n.translate('search_city')}
              value={placeholderText}
              onChangeText={text => {
                setPlaceholderText(text);
                searchCity(text);
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
            data={cityArrCopy}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setcity(item.city_id);
                    setCityName(item.city[0]);
                    setVisibleCity(!visibleCity);
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 18,
                      marginVertical: 3,
                      marginHorizontal: 20,
                    }}>
                    { props.language_id == 0? item.city[0]: item.city[1]}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>

      {loader ? (
        <ActivityIndicator
          animating={loader}
          color={Colors.white}
          size={50}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: 70,
          }}
        />
      ) : (
        <KeyboardAwareScrollView>
          <Image source={require('../../Images/orange.png')} style={s.Logo} />
          <Text style={s.Text1}>{I18n.translate('boat_owner')}</Text>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '98%',
                alignSelf: 'center',
              }}>
              <Input
                textAlign={props.language_id == 0? 'left':'right'}
                placeholder={I18n.translate('first_name')}
                containerStyle={s.Input1}
                inputContainerStyle={s.Input1}
                placeholderTextColor={Colors.white}
                inputStyle={{color: Colors.white}}
                onChangeText={t => setF_name(t)}
                value={f_name}
              />
              <Input
                textAlign={props.language_id == 0? 'left':'right'}
                placeholder={I18n.translate('last_name')}
                containerStyle={s.Input1}
                inputContainerStyle={s.Input1}
                placeholderTextColor={Colors.white}
                inputStyle={{color: Colors.white}}
                onChangeText={t => setL_name(t)}
                value={L_name}
              />
            </View>
            <Input
              textAlign={props.language_id == 0? 'left':'right'}
              placeholder={I18n.translate('email')}
              containerStyle={s.Input}
              inputContainerStyle={s.Input}
              placeholderTextColor={Colors.white}
              inputStyle={{color: Colors.white}}
              keyboardType="email-address"
              onChangeText={t => setemail(t)}
              value={email}
            />
            <Input
              textAlign={props.language_id == 0? 'left':'right'}
              placeholder={I18n.translate('mobile')}
              containerStyle={s.Input}
              inputContainerStyle={s.Input}
              placeholderTextColor={Colors.white}
              inputStyle={{color: Colors.white}}
              keyboardType="number-pad"
              onChangeText={t => setm_number(t)}
              value={m_number}
            />
            <Input
              textAlign={props.language_id == 0? 'left':'right'}
              placeholder={I18n.translate('business_name')}
              containerStyle={s.Input}
              inputContainerStyle={s.Input}
              placeholderTextColor={Colors.white}
              inputStyle={{color: Colors.white}}
              keyboardType="default"
              onChangeText={t => setb_name(t)}
              value={b_name}
            />
            {/* <Input
              placeholder="Business Location"
              containerStyle={s.Input}
              inputContainerStyle={s.Input}
              placeholderTextColor={Colors.white}
              inputStyle={{color: Colors.white}}
              onChangeText={t => setb_location(t)}
              value={b_location}
            /> */}
            <TouchableOpacity
              onPress={() => {
                // StatusBar.setBackgroundColor('white')
                // StatusBar.setBarStyle('dark-content')
                setVisibleCity(!visibleCity);
              }}
              style={{
                flexDirection: 'row',
                paddingBottom: 15,
                paddingHorizontal: 15,
                marginTop:-12
              }}>
              <Text style={{fontSize: 18, color: '#fff'}}>{`${
                cityName
              }`}</Text>
            </TouchableOpacity>
            <View
              style={{
                borderColor: '#fff',
                borderBottomWidth: 1,
                width: '95%',
                alignSelf: 'center',
                marginBottom: 23,
                marginTop: -7,
              }}
            />
            <DatePicker
              style={{
                width: '95%',
                alignSelf: 'center',
                height: 60,
                color: '#fff',
              }}
              date={dob}
              mode="date"
              placeholder={I18n.translate('date_of_birth')}
              format="YYYY-MM-DD"
              // minDate="2016-05-01"
              // maxDate="2016-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  alignItems: 'flex-end',
                },
                dateInput: {
                  borderColor: '#234456',
                  borderWidth: 0,
                  // borderRadius: 4,
                  alignItems: 'flex-start',
                  paddingRight: 10,
                  borderBottomColor: '#fff',
                  borderBottomWidth: 1,
                },
                dateText: {
                  color: '#fff',
                  fontFamily: FontFamily.semi_bold,
                  // fontSize:30
                },
              }}
              onDateChange={date => setdob(date)}
            />
            <Picker
              selectedValue={gender}
              style={[
                {
                  color: '#fff',
                  marginTop: -20,
                  borderBottomColor: Colors.white,
                  borderBottomWidth: 1,
                },
              ]}
              itemStyle={{fontFamily: FontFamily.default}}
              dropdownIconColor="#fff"
              mode="dialog"
              onValueChange={(itemValue, itemIndex) => setgender(itemValue)}>
              <Picker.Item label={I18n.translate('gender')} value="" />
              <Picker.Item label={I18n.translate('male')} value={I18n.translate('male')} />
              <Picker.Item label={I18n.translate('female')} value={I18n.translate('female')} />
            </Picker>
            <View
              style={{
                borderColor: '#fff',
                borderBottomWidth: 1,
                width: '95%',
                alignSelf: 'center',
                marginBottom: 23,
                marginTop: -7,
              }}
            />
            <Input
              textAlign={props.language_id == 0? 'left':'right'}
              placeholder={I18n.translate('password')}
              secureTextEntry
              containerStyle={s.Input}
              inputContainerStyle={s.Input}
              placeholderTextColor={Colors.white}
              inputStyle={{color: Colors.white}}
              onChangeText={t => setpassword(t)}
              value={password}
            />
            <Input
              textAlign={props.language_id == 0? 'left':'right'}
              placeholder={I18n.translate('confirm_password')}
              containerStyle={s.Input}
              secureTextEntry
              inputContainerStyle={s.Input}
              placeholderTextColor={Colors.white}
              inputStyle={{color: Colors.white}}
              onChangeText={t => setconfirmPass(t)}
              value={confirmPass}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginHorizontal: 20,
              marginTop: 10,
              alignItems:'center'
            }}>
            {isChecked ? (
              <AntDesign
                onPress={()=> setChecked(!isChecked)}
                name={'checksquare'}
                size={25}
                color={'#fff'}
                style={{marginHorizontal: 5}}
              />
            ) : (
              <Feather
              onPress={()=> setChecked(!isChecked)}
                name={'square'}
                size={25}
                color={'#fff'}
                style={{marginHorizontal: 5}}
              />
            )}

            <Text style={s.Text1}>{I18n.translate('terms1')}</Text>
            <TouchableOpacity
              onPress={()=>{
                Navigation.navigate('Terms_Conditions');
              }}
              style={{borderBottomWidth: 1, borderColor: '#fff'}}>
              <Text style={[s.Text1]}>{` ${I18n.translate('terms2')} `}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginHorizontal: 10,
              marginBottom: 15,
            }}>
            <Text style={s.Text1}>{`${I18n.translate('terms3')} `}</Text>
            <TouchableOpacity
              onPress={()=>{
                Navigation.navigate('privacyPolicy');
              }}
              style={{borderBottomWidth: 1, borderColor: '#fff'}}>
              <Text style={s.Text1}>{`${I18n.translate('terms4')} `}</Text>
            </TouchableOpacity>
          </View>

          <View style={{elevation: 5}}>
            <TouchableOpacity
              style={s.btn1}
              onPress={() => {
                signUp();
              }}>
              <Text style={s.btn1Text}>{I18n.translate('signUp')}</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={[s.Text1, {marginBottom: 10}]}>
            {I18n.translate('existing_account_text')}
              <Text
                style={{
                  fontFamily: FontFamily.semi_bold,
                  color: Colors.white,
                  alignSelf: 'center',
                  textDecorationLine: 'underline',
                }}
                suppressHighlighting={true}
                onPress={() => Navigation.navigate('Login')}>
                {I18n.translate('login')}
              </Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>
      )}
      {/* </ImageBackground> */}
      <Overlay visible={visible}>
        <View style={{width: '90%', alignSelf: 'center'}}>
          <Text
            style={{
              textAlign: 'center',
              marginVertical: 10,
              fontFamily: FontFamily.semi_bold,
            }}>
            {I18n.translate('verify_otp')}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginBottom: 10,
              fontFamily: FontFamily.default,
            }}>
            {I18n.translate('otp_sent')}
          </Text>
          <OtpInputs
            handleChange={code => setOtp(code)}
            numberOfInputs={6}
            value={parseInt(otp)}
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: '100%',
              alignSelf: 'center',
              fontFamily: FontFamily.semi_bold,
            }}
            inputStyles={{
              color: Colors.orange,
              textAlign: 'center',
              fontFamily: FontFamily.semi_bold,
              fontSize: 20,
            }}
            inputContainerStyles={{
              backgroundColor: Colors.gray1,
              borderColor: '#000',
              height: 50,
              width: 50,
              borderRadius: 10,
              borderWidth: 0,
              elevation: 5,
              justifyContent: 'space-around',
            }}
            focusStyles={{
              // borderWidth:1,
              borderColor: Colors.orange,
              backgroundColor: Colors.white,
              elevation: 5,
            }}
          />
          <View
            style={{flexDirection: 'row', marginTop: 30, alignSelf: 'center'}}>
            <Text style={{textAlign: 'center', fontFamily: FontFamily.default}}>
              {' '}
              Didn't recived code ?{' '}
            </Text>
            <TouchableOpacity
              style={{}}
              onPress={() => resendOtp({user_id: userId})}>
              <Text
                style={{alignSelf: 'center', fontFamily: FontFamily.semi_bold}}>
              {I18n.translate('resend_code')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{elevation: 5, marginBottom: 10}}>
            <TouchableOpacity
              style={s.btn1}
              onPress={() => {
                verifyOtp({user_id: userId, user_otp: otp});
              }}>
              <Text style={s.btn1Text}>{I18n.translate('verify_sign_up')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    </View>
  );
};
const s = StyleSheet.create({
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
  Logo: {
    height: 70,
    width: 70,
    borderRadius: 20,
    // backgroundColor: Colors.orange,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  Text1: {
    textAlign: 'center',
    fontFamily: FontFamily.default,
    color: Colors.white,
    fontSize: 14,
  },
  Input1: {
    borderBottomColor: Colors.white,
    width: Sizes.width * 0.46,
    marginLeft: -5,
  },
  Input: {
    borderBottomColor: Colors.white,
    marginTop: -15,
  },
  Input11: {
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    marginTop: -25,
    // marginBottom:20,
    borderColor: '#fff',
  },
  btn1: {
    height: 48,
    width: '95%',
    backgroundColor: Colors.orange,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginVertical: 10,
    elevation: 5,
  },
  btn1Text: {
    fontSize: 20,
    fontFamily: FontFamily.semi_bold,
    color: Colors.white,
  },
});
const mapStateToProps = (state)=>({
  language_id: state.data_Reducer.language_id

})
export default connect(mapStateToProps)(SignUp)

