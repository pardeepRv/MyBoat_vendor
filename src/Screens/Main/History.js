import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import I18n from '../../Translations/i18'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../Constants/config';
import {Icon, Input, Card, Rating, AirbnbRating} from 'react-native-elements';
import {Colors} from '../../Constants/Constants';
import Header from '../../Components/Header';
import moment from 'moment';
import {Loading} from '../../Components/Loader';
class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      Data: [],
      loader: false,
    };
  }
  async componentDidMount() {
    let userInfo = await AsyncStorage.getItem('userInfo');
    let parsedInfo = JSON.parse(userInfo);
    console.log('parsedInfo', parsedInfo.id);
    this.setState({userId: parsedInfo.id});
    console.log('baoi', this.props.route.params);
    this.historyData();
  }
  historyData = () => {
    this.setState({loader: true});
    let url =
      config.apiUrl +
      '/booking_history.php?user_id_post=' +
      this.state.userId +
      '&searchtext&search_flag';
    axios
      .get(url)
      .then(res => {
        console.log('booking_history', res.data.booking_arr);
        this.setState({loader: false});
        if (res) {
          this.setState({
            Data: res.data.booking_arr,
          });
        } else {
          if(this.props.language_id == 0)
          alert(res.data.msg[0]);
          else   alert(res.data.msg[1]);
          console.log(res.data.success);
        }
      })
      .catch(err => console.log(err));
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header imgBack={true} name={I18n.translate('history')} backBtn={true} />
        <View
          style={{
            marginTop: '20%',
            borderRadius: 8,
            backgroundColor: 'white',
            height: 30,
            width: '90%',
            flexDirection: 'row',
            borderColor: 'red',
            borderWidth: 1,
            position: 'absolute',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', marginStart: 7}}>
            <Icon
              name="calendar"
              type="antdesign"
              size={22}
              color={Colors.black1}
            />
            <Text style={{marginStart: 10, alignSelf: 'center'}}>{I18n.translate('date')}</Text>
          </View>
          <View style={{}}>
            <Icon
              name="right"
              type="antdesign"
              size={22}
              color={Colors.black1}
            />
          </View>
        </View>
        {this.state.loader ? (
          <Loading />
        ) : (
          <View>
            {this.state.Data === 'NA' ? (
              <View style={{alignItems: 'center', marginTop: '10%'}}>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#ccc'}}>
                 {I18n.translate('no_data')}
                </Text>
              </View>
            ) : (
              <FlatList
                data={this.state.Data === 'NA' ? [] : this.state.Data}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => {
                  return (
                    <View style={{}}>
                      <View style={styles.box}>
                        <Image
                          source={require('../../Images/back.jpg')}
                          style={styles.image}
                        />
                        <View style={{paddingTop: 8, width: '45%'}}>
                          <Text style={styles.first_text}>
                            {item.advertisement_name[0]}
                          </Text>
                          <Text style={styles.second_text}>
                            {item.boat_name}
                          </Text>
                          <Text style={styles.third_text}>
                            #{item.booking_no}
                          </Text>
                          <Text style={styles.fourth_text}>
                            {moment(item.date).format('DD-MMM-YYYY')}
                            {', '}
                            {moment(item.time, ['h:mm A']).format('hh:mm a')}
                          </Text>
                        </View>
                        <View style={{paddingTop: 8, overflow: 'scroll'}}>
                          <Text style={styles.right_first_text}>
                            {item.createtime} {I18n.translate('ago')}
                          </Text>
                          <Text style={styles.right_second_text}>
                            {I18n.translate('kwd')} {item.rent_amount}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(i, ind) => ind}
                style={{}}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{
                  paddingBottom: 10,
                  //    height:"100%"
                }}
              />
            )}
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state)=>({
  language_id: state.data_Reducer.language_id

})



export default connect(mapStateToProps)(History)

const styles = StyleSheet.create({
  search: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  box: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 10,
    width: '95%',
    alignSelf: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    margin: 5,
  },
  first_text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  second_text: {
    color: 'gray',
    fontSize: 10,
    paddingTop: 2,
  },
  third_text: {
    fontWeight: 'bold',
    paddingTop: 2,
  },
  fourth_text: {
    color: 'gray',
    fontSize: 10,
    paddingTop: 2,
  },
  right_first_text: {
    color: 'gray',
    fontSize: 12,
  },
  right_second_text: {
    paddingTop: 20,
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
