import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import I18n from '../../Translations/i18'
import {Icon, Input} from 'react-native-elements';
import {back_img, Colors, FontFamily, Sizes} from '../../Constants/Constants';
import {useNavigation} from '@react-navigation/core';
import Header from '../../Components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../Constants/config';
import axios from 'axios';
import {connect, useDispatch} from 'react-redux';
class Change_Password extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldpassword: '',
      oldPassToggle: false,
      newpassword: '',
      newPassToggle: false,
      confpassword: '',
      confPassToggle: false,
      loader: false,
      userId: '',
    };
  }
  async componentDidMount() {
    let userInfo = await AsyncStorage.getItem('userInfo');
    let parsedInfo = JSON.parse(userInfo);
    this.setState({userId: parsedInfo.id});
  }
  channgePassword = () => {
    if (
      !this.state.oldpassword.length ||
      !this.state.newpassword.length ||
      !this.state.confpassword.length
    ) {
      alert('Please fill the required details!');
      return;
    }
    let url = config.apiUrl + '/change_password.php';
    var data = new FormData();
    data.append('user_id_post', this.state.userId);
    data.append('password_old', this.state.oldpassword);
    data.append('password_new', this.state.newpassword);

    this.setState({loader: true});
    axios
      .post(url, data)
      .then(res => {
      ;
        this.setState({loader: false});
        if (res.data.success === 'true') {
          alert('password updated successfully!')
          this.props.navigation.goBack();
        } else {
          if(this.props.language_id == 0){
            alert(res.data.msg[0]);
          }
          else{
            alert(res.data.msg[1]);
          }

          
        }
      })
      .catch(err => console.log(err));
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <Header backBtn={true} name={I18n.translate('change_pass')} isarbic={this.props.language_id == 1 ? 1: 0} />
        <View style={sb.SEC2}>
          <View style={{marginTop: 30, paddingHorizontal: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
               
                
              }}>
              <TextInput
                 fontFamily ={FontFamily.default}
                placeholder={I18n.translate('old_pass')}
                secureTextEntry={this.state.oldPassToggle? false:true}
                placeholderTextColor={Colors.gray}
                style={{
                  borderBottomWidth: 1,
                  marginHorizontal: 15,
                  width:'80%'
                }}
                onChangeText={oldpassword => this.setState({oldpassword})}
              />
              <TouchableOpacity
               style={{marginBottom:5}}
                onPress={() =>
                  this.setState({oldPassToggle: !this.state.oldPassToggle})
                }>
                {this.state.oldPassToggle ? (
                  <Image
                    source={require('../../Images/eye.png')}
                    style={{height: 25, width: 25, resizeMode: 'contain'}}
                  />
                ) : (
                  <Image
                    source={require('../../Images/eyeOpen.png')}
                    style={{height: 25, width: 25, resizeMode: 'contain'}}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
               // justifyContent: 'space-between',
              }}>
              <TextInput
                fontFamily ={FontFamily.default}
                placeholder={I18n.translate('new_pass')}
                secureTextEntry={this.state.newPassToggle? false: true}
                placeholderTextColor={Colors.gray}
                style={{
                  borderBottomWidth: 1,
                  marginHorizontal: 15,
                  width:'80%'
                }}
                onChangeText={newpassword => this.setState({newpassword})}
              />
              <TouchableOpacity
              style={{marginBottom:5}}
                onPress={() =>
                  this.setState({newPassToggle: !this.state.newPassToggle})
                }>
                {this.state.newPassToggle ? (
                  <Image
                    source={require('../../Images/eye.png')}
                    style={{height: 25, width: 25, resizeMode: 'contain'}}
                  />
                ) : (
                  <Image
                    source={require('../../Images/eyeOpen.png')}
                    style={{height: 25, width: 25, resizeMode: 'contain'}}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
               
              }}>
              <TextInput
                fontFamily ={FontFamily.default}
                placeholder={I18n.translate('confirm_password')}
                secureTextEntry={this.state.confPassToggle? false: true}
                placeholderTextColor={Colors.gray}
                style={{
                  borderBottomWidth: 1,
                  marginHorizontal: 15,
                  width:'80%'
                }}
                onChangeText={confpassword => this.setState({confpassword})}
              />
              <TouchableOpacity
                style={{marginBottom:5}}
                onPress={() =>
                  this.setState({confPassToggle: !this.state.confPassToggle})
                }>
                {this.state.confPassToggle ? (
                  <Image
                    source={require('../../Images/eye.png')}
                    style={{height: 25, width: 25, resizeMode: 'contain'}}
                  />
                ) : (
                  <Image
                    source={require('../../Images/eyeOpen.png')}
                    style={{height: 25, width: 25, resizeMode: 'contain'}}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={sb.btn1}
            onPress={() => this.channgePassword()}>
            <Text style={sb.btn1Text}>{I18n.translate('submit')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const sb = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    marginTop: -120,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
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
    position: 'absolute',
    bottom: 0,
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
export default connect(mapStateToProps)(Change_Password)
