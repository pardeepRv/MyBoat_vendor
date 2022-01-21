import React, {useEffect, useState} from 'react';
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
  Alert,
} from 'react-native';
import { toggleLanguage } from '../../Data_Service/actions';
import {connect, useDispatch} from 'react-redux';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import I18n from '../../Translations/i18';
import {Icon, Input, Card, Rating, AirbnbRating} from 'react-native-elements';
//  import I18n from 'react-native-i18n';
import Header, {s} from '../../Components/Header';
import {back_img4, Colors, FontFamily, Sizes} from '../../Constants/Constants';
import {useNavigation} from '@react-navigation/core';
import config from '../../Constants/config';

const Change_Language = (props) => {
  const [appLang, setAppLang] = useState('');
  const [selectedLang, setSelectedLang] = useState('');
  const [btn1Style, setBtn1Style] = useState({
    backColor: Colors.orange,
    textCOlor: Colors.white,
  });
  const [btn2Style, setBtn2Style] = useState({
    backColor: Colors.white,
    textCOlor: Colors.black,
  });
  const dispatch = useDispatch()
  useEffect(async () => {
    if (props.language_id == 1) {
      setSelectedLang('arabic');
      setAppLang('arabic');
    } else {
      setAppLang('english');
      setSelectedLang('english');
    }
  }, []);
  const changeAppLangConfig = (cb) => {
    if (props.language_id == 0) {
      AsyncStorage.setItem('locale', 'ar');
      AsyncStorage.setItem('language', '1');
      I18n.locale = 'ar'
      dispatch(props.toggleLanguage('1'))
      I18nManager.forceRTL(true);
    } else {
        I18n.locale = 'en'
      AsyncStorage.setItem('locale', 'en');
      AsyncStorage.setItem('language','0');
      dispatch(props.toggleLanguage(0))
      I18nManager.forceRTL(false);
    }
    if(cb){cb()}
  };
  const restartApp = () => {
    Alert.alert(
      'Restart app?',
      'You have changed the app language. You need to restart the app for it to be effective.',
      [
        // {
        //   text: 'Do it later',
        //   style: 'cancel',
        //   onPress: () => {
        //     changeAppLangConfig();
        //   },
        // },
        {
          text: 'Restart now',
          onPress: () => {
            changeAppLangConfig(()=>{RNRestart.Restart()});

           
          },
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <Header
        backBtn={true}
        imgBack={true}
        name={I18n.translate('change_lang')}
        headerHeight={300}
      />
      <View style={sb.SEC2}>
        <View style={{marginTop: 30, paddingHorizontal: 10}}>
          {/*  */}
          <TouchableOpacity
            onPress={() => {
              if (selectedLang === 'arabic') {
                setSelectedLang('english');

                // alert('je')
              }
              //AsyncStorage.setItem('locale','en')
              // I18nManager.forceRTL(false)
              //restartApp()
            }}>
            <Card
              
              containerStyle={{
                backgroundColor:
                  selectedLang === 'english'
                    ? btn1Style.backColor
                    : btn2Style.backColor,
                borderRadius: 12,
                paddingHorizontal: 20,
              }}>
              <Text
                
                style={{
                    textAlign:'left',
                  fontFamily: FontFamily.default,
                  fontWeight: '500',
                  color:
                    selectedLang === 'english'
                      ? btn1Style.textCOlor
                      : btn2Style.textCOlor,
                }}>
                {'English'}
              </Text>
            </Card>
          </TouchableOpacity>
          {/*  */}
          <TouchableOpacity
            onPress={() => {
              if (selectedLang === 'english') {
                setSelectedLang('arabic');
              }

              // I18nManager.forceRTL(true)
              //restartApp()
            }}>
            <Card
              containerStyle={{
                backgroundColor:
                  selectedLang === 'arabic'
                    ? btn1Style.backColor
                    : btn2Style.backColor,
                borderRadius: 12,
                paddingHorizontal: 20,
              }}>
              <Text
                style={{
                  fontFamily: FontFamily.default,
                  fontWeight: '500',
                  color:
                    selectedLang === 'arabic'
                      ? btn1Style.textCOlor
                      : btn2Style.textCOlor,
                }}>
                {I18n.translate('arabic')}
              </Text>
            </Card>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            if (appLang !== selectedLang) {
              restartApp();
            }
          }}
          style={sb.btn1}>
          <Text style={sb.btn1Text}>{I18n.translate('done')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const mapStateToProps = (state)=>({
  language_id: state.data_Reducer.language_id

})

const mapDispatchToProps =({
  toggleLanguage: toggleLanguage
})

export default connect(mapStateToProps,mapDispatchToProps)(Change_Language)


const sb = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    marginTop: -50,
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

