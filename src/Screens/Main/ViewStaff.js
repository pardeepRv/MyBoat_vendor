import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Header from '../../Components/Header';
import { Colors } from '../../Constants/Constants';
class ViewStaff extends React.Component {
  
  constructor(props) {
    console.log(props, 'props n view');
    super(props);
    let finalData = props.route.params.item;
    this.state = {
      item: props.route.params.item,
      iscontact: '',
      listKeys: [
        { key: 'Basketball', switch: true, text: 'View Home' },
        { key: 'Football',switch: finalData && finalData.manage_home_permission == 1 ? true : false, text: 'Manage Home' },
        { key: 'Baseball', switch: finalData && finalData.view_add_permission == 1 ? true : false, text: 'View my add' },
        { key: 'Soccer',switch: finalData && finalData.manage_add_permission == 1 ? true : false, text: 'Manage my add' },
        { key: 'Running', switch: finalData && finalData.chat_permission == 1 ? true : false, text: 'Chat' },
        { key: 'Cross Training',switch: finalData && finalData.view_unavailability_permission == 1 ? true : false, text: 'View Unavalibilty' },
        { key: 'Gym Workout',switch: finalData && finalData.manage_unavailability_permission == 1 ? true : false, text: 'Manage Unavalibilty' },
        { key: 'Workout',switch: finalData && finalData.view_my_wallet_permission == 1 ? true : false, text: 'View My Wallet' },
        { key: 'Gym ',switch: finalData && finalData.view_withdrawl_permission == 1 ? true : false, text: 'View Withdrawl' },
      ],
    };
  }

  setSwitchValue = (val, ind) => {
    console.log(val, 'valuesss');
    console.log(ind, 'indindind');
    return;
  };

  _renderDateView = ({ item, index }) => (
    <View
      style={{
        backgroundColor: '#fafafa',
        marginVertical: 10,
        marginHorizontal: 10,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.hText}>{item.text}</Text>

        <Switch
          onValueChange={value => this.setSwitchValue(value, index)}
          value={item.switch}
          trackColor={{
            true: Colors.orange,
            false: Platform.OS == 'android' ? '#d3d3d3' : Colors.orange,
          }}
          disabled
          style={{
            top: 2,
            alignSelf: 'center',
            right: 15,
            borderColor: Colors.orange,
            borderWidth: 2,
            borderRadius: 16,
          }}
        />
      </View>
    </View>
  );

  render() {
    console.log('details', this.state.item);
    const { item } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
        <Header imgBack={true} backBtn={true} name="Details" />
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.listKeys}
            renderItem={this._renderDateView}
            keyExtractor={(item, index) => 'key' + index}
            ListHeaderComponent={() =>
              !this.state.listKeys.length ? (
                <Text
                  style={{
                    alignSelf: 'center',
                    marginTop: 20,
                    //   fontFamily: fonts.regular,
                  }}>
                  No Match found
                </Text>
              ) : null
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default ViewStaff;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  hText: {
    fontSize: 18,
    fontWeight: 'bold',
    top: 5,
    left: 5,
  },
  sText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
});
