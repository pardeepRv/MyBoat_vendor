import I18n from 'react-native-i18n';
import en from './en';
import ar from './ar'
import AsyncStorage from '@react-native-async-storage/async-storage';
 
I18n.fallbacks = true;
I18n.translations = {
  ar,
  en
};



export default I18n;