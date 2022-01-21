import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Keyboard,
} from 'react-native';
// import color1 from './Colors'
import I18n from '../../Translations/i18'
import config from '../../Constants/config';
import {connect, useDispatch} from 'react-redux';
// import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
// import { Lang_chg } from './Provider/Language_provider'
// import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import {localStorage} from './Provider/localStorageProvider';
import axios from 'axios';
import {ActivityIndicator} from 'react-native-paper';
class Forgot extends Component {
  state = {
    email: '',
    loading: false,
    isConnected: true,
  };

  backpress = () => {
    this.props.navigation.goBack();
  };

  _btnSubmitForgot = () => {
    let user_email = this.state.email;
    //email============================
    if (user_email.length <= 0) {
      alert(I18n.translate('invalid_email'));
      //msgProvider.toast(Lang_chg.emptyEmail[config.language], 'center')
      return false;
    }
    if (user_email.length > 50) {
      alert(I18n.translate('max_length'));
      //msgProvider.toast(Lang_chg.emailMaxLength[config.language], 'center')
      return false;
    }
    const reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (reg.test(user_email) !== true) {
      alert(I18n.translate('invalid_email'));
      // msgProvider.toast(Lang_chg.validEmail[config.language], 'center')
      return false;
    }

    if (this.state.isConnected === true) {
      let url = config.apiUrl + '/forget_password.php';
      var data = new FormData();
      data.append('user_email', user_email);
      this.setState({loading: true});
      axios
        .post(url, data)
        .then(obj => {
          if (obj.data.success == 'true') {
            let email_arr = obj.data.email_arr;
            if (typeof email_arr !== 'undefined') {
              if (email_arr != 'NA') {
                this.mailsendfunction(email_arr);
              }
            }

            //msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
            this.backpress();
            return false;
          } else {
            // alert('Unable to send email at this moment! Please try again!')
            //msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
            return false;
          }
        })
        .catch(error => {
          this.setState({loading: false});
        });
    } else {
      alert(I18n.translate('internet_alert'));
    }
  };
  mailsendfunction = email_arr => {
    for (let i = 0; i < email_arr.length; i++) {
      var email = email_arr[i].email;
      var mailcontent = email_arr[i].mailcontent;
      var mailsubject = email_arr[i].mailsubject;
      var fromName = email_arr[i].fromName;
      var url = config.apiUrl + '/mailFunctionsSend.php';
      var data = new FormData();
      data.append('email', email);
      data.append('mailcontent', mailcontent);
      data.append('mailsubject', mailsubject);
      data.append('fromName', fromName);

      axios.post(url, data).then(obj => {
        if (obj.data.success == 'true') {
          alert(
           I18n.translate('mail_send_success')
          );
        } else {
          alert(I18n.translate('mail_send_failure'));
        }
      });
    }
  };
  render() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={Keyboard.dismiss}
        style={{flex: 1, height: '100%', backgroundColor: '#ffffff'}}>
        <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />
        <StatusBar
          backgroundColor={'transparent'}
          barStyle="light-content"
          // hidden={false}
          translucent={true}
          // networkActivityIndicatorVisible={true}
        />

        {/* <ActivityIndicator loading={this.state.loading} /> */}
        <ImageBackground
          style={{width: '100%', height: '100%', opacity: 0.9}}
          imageStyle={{backgroundColor: '#000'}}
          source={require('../../Images/back.jpg')}>
          <View style={styles.firgot_header}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.back_buttn_top}
              onPress={() => {
                this.backpress();
              }}>
              <Image
                resizeMode="contain"
                style={styles.forgot_back}
                source={require('../../Images/email.png')}></Image>
            </TouchableOpacity>
          </View>

          <View style={styles.logo_forgot}>
            <Image
              resizeMode="contain"
              style={styles.forgot_logo_img}
              source={require('../../Images/orange.png')}></Image>
            <Text style={styles.forgot_title}>{'My Boat Owner'}</Text>
          </View>

          <View style={styles.main_login}>
            <View style={styles.login_input}>
              <TextInput
                textAlign={this.props.language_id == 0? 'left':'right'}
                style={styles.enter_emaol_login}
                onChangeText={this.handleTextChange}
                placeholder={I18n.translate('email')}
                placeholderTextColor="#b8b8b8"
                returnKeyLabel="done"
                returnKeyType="done"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                onChangeText={txt => {
                  this.setState({email: txt});
                }}
                maxLength={50}
                minLength={6}
                value={this.state.email}
                keyboardType="email-address"
              />
              <Image
                style={styles.login_email}
                source={require('../../Images/email.png')}></Image>
            </View>

            <View style={styles.login_btn1}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this._btnSubmitForgot();
                }}>
                <Text style={styles.log_txt_btn}>{I18n.translate('submit')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}
const mapStateToProps = (state)=>({
  language_id: state.data_Reducer.language_id

})
export default connect(mapStateToProps)(Forgot)

const styles = StyleSheet.create({
  forgot_back: {
    width: 35,
    height: 20,
  },
  firgot_header: {
    marginTop: 25,
    marginLeft: 20,
  },
  forgot_logo_img: {
    width: 90,
    height: 90,
  },
  logo_forgot: {
    textAlign: 'center',
    alignItems: 'center',
    marginTop: 90,
  },
  forgot_title: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 25,
    color: '#d15400',
    marginTop: 5,
    fontWeight: 'bold',
  },
  main_login: {
    width: '90%',
    alignItems: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 50,
  },
  login_input: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#d15400',
    backgroundColor: '#fff',
    height: 50,
  },
  enter_emaol_login: {
   
    paddingRight: 20,
    paddingLeft: 20,
    fontSize: 16,
    fontFamily: 'Ubuntu-Regular',
    height: 50,
    width: '100%',
  },
  login_email: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  log_txt_btn: {
    lineHeight: 60,
    textAlign: 'center',
    fontFamily: 'Ubuntu-Bold',
    fontSize: 17,
    color: 'white',
  },
  login_btn1: {
    backgroundColor: '#d15400',
    width: '100%',
    alignSelf: 'center',
    height: 60,
    borderRadius: 15,
    marginTop: 40,
  },
});
