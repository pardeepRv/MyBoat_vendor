import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,Alert
} from 'react-native';
import { connect } from 'react-redux';
import Header from '../../Components/Header';
import { Colors } from '../../Constants/Constants';
import I18n from "../../Translations/i18";
class ViewStaff extends React.Component {

  componentDidMount(){
   
  }

  constructor(props) {
    console.log(props, 'props n view');
    super(props);
    let finalData = props.route.params.item;
    this.state = {
      item: props.route.params.item,
      iscontact: '',
      listKeys: [
        { key: 'Basketball', switch: finalData && finalData.view_home_permission == 1 ? true : false, text: I18n.translate('view_home') },
        { key: 'Football',switch: finalData && finalData.manage_home_permission == 1 ? true : false, text: I18n.translate('manage_home') },
        { key: 'Baseball', switch: finalData && finalData.view_add_permission == 1 ? true : false, text: I18n.translate('view_my_add') },
        { key: 'Soccer',switch: finalData && finalData.manage_add_permission == 1 ? true : false, text: I18n.translate('manage_my_add') },
        { key: 'Running', switch: finalData && finalData.chat_permission == 1 ? true : false, text: I18n.translate('chat')},
        { key: 'Cross Training',switch: finalData && finalData.view_unavailability_permission == 1 ? true : false, text: I18n.translate('view_unavailability') },
        { key: 'Gym Workout',switch: finalData && finalData.manage_unavailability_permission == 1 ? true : false, text: I18n.translate('manage_unavailability') },
        { key: 'Workout',switch: finalData && finalData.view_my_wallet_permission == 1 ? true : false, text: I18n.translate('view_my_wallet') },
        { key: 'Gym ',switch: finalData && finalData.view_withdrawl_permission == 1 ? true : false, text: I18n.translate('view_withdraw') },
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
        <Header imgBack={true} backBtn={true} name={I18n.translate("details")} isarbic={this.props.language_id == 1? 1:0}  />
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
const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
  permissions: state.data_Reducer.permissions,
});

export default connect(mapStateToProps)(ViewStaff);


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
