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
  TextInput,
} from 'react-native';
import I18n from '../../Translations/i18'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon, Input, Card} from 'react-native-elements';
import {Colors, FontFamily, Sizes} from '../../Constants/Constants';
import {useNavigation} from '@react-navigation/core';
import Header from '../../Components/Header';
import config from '../../Constants/config';
const aboutUs = [
  'Myboat: The Kuwait App for boat booking',
  'MyBoat is an app for tour, fishing, diving and anniversary trips.',
  'Want boat trip! Yes we delivered easy direct way for boat booking. customer or boat owner we are happy to present our apps to suit your desire from fishing to island tour to special anniversary that will saved ever in your mind, for boat owners will give the easiest professional app to upload and organize your trips and of course keep you very near to your customer with great communication features.',
];
const about = () => {
  React.useEffect(async () => {
    let userInfo = await AsyncStorage.getItem('userInfo');

    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl +
      '/get_all_content.php?user_id=' +
      parsedInfo.id +
      '&user_type=2';
    // axios.get(url).then(res=>{

    // }).catch(error=>{
    //     alert('he')
    // })
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <Header backBtn={true} imgBack={true} name={I18n.translate('about')} />
      <View style={subrata.SEC2}>
        <View style={{marginTop: 30, paddingHorizontal: 20}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: FontFamily.bold,
                marginBottom: 10,
              }}>
              {`${I18n.translate('about')}`}
            </Text>
            {aboutUs.map(item => {
              return (
                <Text
                  style={{
                    textAlign: 'auto',
                    fontFamily: FontFamily.default,
                    fontSize: 12,
                    lineHeight: 27,
                  }}>
                  {item}
                </Text>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
const subrata = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    marginTop: -40,
    flex: 1,
  },
});
export default about;
