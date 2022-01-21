import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import I18n from './src/Translations/i18';
import store from './rootReducer';
import {Provider} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Root} from 'native-base';
import Stacks from './src/Navi/Stack';
import {firebaseprovider} from './src/Screens/Provider/FirebaseProvider';
class App extends React.Component {
  async componentDidMount() {
    let appLang = await AsyncStorage.getItem('locale');
    if (appLang === null) {
      AsyncStorage.setItem('locale', 'en');
      AsyncStorage.setItem('language', '0');
    } else if (appLang === 'ar') {
      AsyncStorage.setItem('language', '1');
      AsyncStorage.setItem('locale', 'ar');
    } else {
      AsyncStorage.setItem('language', '0');
      AsyncStorage.setItem('locale', 'en');
    }
    I18n.locale = appLang;
    firebaseprovider.getMyInboxAllData();
    firebaseprovider.getAllUsers();
  }
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Root>
            {/* <StatusBar hidden /> */}
            <Stacks />
            {/* <TabNav /> */}
          </Root>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
