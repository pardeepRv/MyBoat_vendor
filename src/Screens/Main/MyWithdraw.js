import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon, Input, Card} from 'react-native-elements';
import Header from '../../Components/Header';
import {
  back_img3,
  boat_img1,
  Colors,
  FontFamily,
  Sizes,
} from '../../Constants/Constants';
import {connect, useDispatch} from 'react-redux';
import I18n from '../../Translations/i18'
import config from '../../Constants/config';
import axios from 'axios';
import {Loading} from '../../Components/Loader';
const MyWithdraw = (props) => {
  const [data, setData] = useState([]);
  const [pendingAmount, setPendingAmount] = useState([]);
  const [totalEarning, setTotalEarning] = useState([]);
  const [bank, setBank] = useState([]);
  const [loader, setLoader] = useState(false);
  // --------------------------------------- //
  useEffect(async () => {
    let userInfo = await AsyncStorage.getItem('userInfo');
    let parsedInfo = JSON.parse(userInfo);
    setLoader(true);
    let url =
      config.apiUrl + '/withdraw_history.php?user_id_post=' + parsedInfo.id;
    axios
      .get(url)
      .then(res => {
        console.log(res,'in withdraw');
        let data = JSON.stringify(res.data, null, 1);

        setLoader(false);
        if (res.data.success === 'true') {
          setData(res.data.withhdraw_arr);
          setPendingAmount(res.data.pending_amount);
          setTotalEarning(res.data.total_earning);
          setBank(res.data.bank_arr);
        } else {
          if(props.language_id == 0)
          alert(res.data.msg[0]);
          else   alert(res.data.msg[1]);
        }
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <Header
        backBtn={true}
        name={I18n.translate('withdrawal')}
        imgBack={true}
        headerHeight={300}
        isarbic={props.language_id==1 ? 1 :0}
      />
      {/* btn */}
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          width: '100%',
          justifyContent: 'space-around',
          top: 170,
        }}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: FontFamily.bold,
              fontSize: 17,
              color: Colors.white,
            }}>
            {I18n.translate('kwd')} {totalEarning ? totalEarning : '0'}
          </Text>
          <Text
            style={{
              fontFamily: FontFamily.default,
              fontSize: 17,
              color: Colors.white,
            }}>
           {I18n.translate('total_amt')}
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: FontFamily.bold,
              fontSize: 17,
              color: Colors.white,
            }}>
            {I18n.translate('kwd')} {pendingAmount ? pendingAmount : '0'}
          </Text>
          <Text
            style={{
              fontFamily: FontFamily.default,
              fontSize: 17,
              color: Colors.white,
            }}>
            {I18n.translate('pending_amt')}
          </Text>
        </View>
      </View>
      {/*  */}
      <View style={sb.SEC2}>
        {loader ? (
          <Loading />
        ) : (
          <View style={{marginTop: 30}}>
            <ScrollView>
              {data === 'NA' ? (
                <View style={{alignItems: 'center', marginTop: '10%'}}>
                  <Text
                    style={{fontSize: 20, fontWeight: 'bold', color: '#ccc'}}>
                    {I18n.translate('no_data')}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={data === 'NA' ? [] : data}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => {
                    return (
                      <Card containerStyle={{borderRadius: 12, elevation: 3}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <View style={{width: '70%'}}>
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: FontFamily.semi_bold,
                              }}>
                              #{item.booking_no}
                            </Text>
                            <Text
                              style={{
                                fontSize: 10,
                                fontFamily: FontFamily.default,
                                color: 'rgba(153, 153, 153, 1)',
                              }}>
                              {item.updatetime}
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: FontFamily.semi_bold,
                              }}>
                              {bank.holder_name}
                            </Text>
                            <Text
                              style={{
                                fontSize: 10,
                                fontFamily: FontFamily.default,
                                color: 'rgba(153, 153, 153, 1)',
                              }}>
                              Ac. No.: {bank.account_no} {'\n'}
                              Ifsc : {bank.ifsc_no} {'\n'}
                            </Text>
                          </View>
                          <View style={{marginLeft: -10}}>
                            {/* <Text style={{textAlign:"right",fontFamily:FontFamily.default,fontSize:10,color:"rgba(153, 153, 153, 1)"}}>5m ago</Text> */}
                            <Text
                              style={{
                                fontSize: 16,
                                fontFamily: FontFamily.semi_bold,
                                color: Colors.orange,
                                lineHeight: 40,
                              }}>
                               {I18n.translate('kwd')} {item.amount}
                            </Text>
                            {/* <Text style={{ textAlign: "right", fontFamily: FontFamily.semi_bold, fontSize: 13, color: "rgba(235, 219, 78, 1)" }}>Pending</Text> */}
                          </View>
                        </View>
                      </Card>
                    );
                  }}
                  keyExtractor={(i, ind) => ind}
                  style={{
                    marginTop: 30,
                  }}
                  contentInsetAdjustmentBehavior="automatic"
                  contentContainerStyle={{
                    paddingBottom: 10,
                    //    height:"100%"
                  }}
                />
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};
const sb = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
    height: 100,
  },
});

const mapStateToProps = (state)=>({
  language_id: state.data_Reducer.language_id

})



export default connect(mapStateToProps)(MyWithdraw)
