import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { Icon, Input, Card, AirbnbRating } from 'react-native-elements';
import Header from '../../Components/Header';
import {
  back_img3,
  boat_img1,
  Colors,
  FontFamily,
  Sizes,
} from '../../Constants/Constants';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../Constants/config';
import axios from 'axios';
import { s } from '../../Components/Header';
import { Loading } from '../../Components/Loader';
import I18n from "../../Translations/i18";
const Ratings = () => {
  const navigate = useNavigation();
  const [data, setData] = useState([]);
  const [count1, setCount1] = useState('');
  const [count2, setCount2] = useState('');
  const [count3, setCount3] = useState('');
  const [count4, setCount4] = useState('');
  const [count5, setCount5] = useState('');
  const [totalcount, setTotalcount] = useState('');
  const [totalrating, setTotalrating] = useState(0);
  const [loader, setLoader] = useState(false);
  // --------------------------------------- //
  const gotoRatingsDetails = ({ item }) => {
    navigate.navigate('DetailsRating', { item });
  };
  useEffect(async () => {
    let userInfo = await AsyncStorage.getItem('userInfo');
    let parsedInfo = JSON.parse(userInfo);
    console.log('parsedInfo', parsedInfo.id);
    // setUser_id_post(parsedInfo.id)
    setLoader(true);
    let url =
      config.apiUrl + '/ratingreviewList.php?user_id_post=' + parsedInfo.id;
    axios
      .get(url)
      .then(res => {
        console.log('getUserDetails', res.data.rating_arr);
        setLoader(false);
        if (res.data.success === 'true') {
          console.log('getUserDetails', res.data);
          setData(res.data.rating_arr);

          setCount1(res.data.food_rating.rating);
          setCount2(res.data.hospitality_rating.rating);
          setCount3(res.data.captain_rating.rating);
          setCount4(res.data.clean_rating.rating);
          setCount5(res.data.time_rating.rating);

          setTotalcount(res.data.total_rating.count);
          setTotalrating(res.data.total_rating.rating);
        } else {
          alert(res.data.msg[0]);
          console.log(res.data.success);
        }
      })
      .catch(err => console.log(err));
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header backBtn={true} name={I18n.translate("rating")} imgBack={true} headerHeight={300} />
      {/* Ratings */}
      <View
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          position: 'absolute',
          width: '100%',
          top: 70,
          alignItems: 'center',
          marginStart: 10
        }}>
        <View style={{ alignItems: 'center', width: '30%' }}>
          <Text
            style={{
              fontSize: 17,
              fontFamily: FontFamily.bold,
              color: Colors.white,
            }}>
            {totalrating}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            <AirbnbRating
              showRating={false}
              size={14}
              count={5}
              defaultRating={totalrating}
              isDisabled
              selectedColor="#FFCC39"
              starContainerStyle={{
                elevation: 5,
              }}
            />
            <Text style={sb.count}>({totalcount})</Text>
          </View>
        </View>
        {/*  */}
        <View style={{ left: 30 }} >
          {/* Time* */}
          <View
            style={sb.ratingView}>
            <Text style={sb.ratingText} >{I18n.translate('time')}</Text>
            <AirbnbRating
              showRating={false}
              size={14}
              count={5}
              defaultRating={count5}
              isDisabled
              selectedColor="#FFCC39"
              starContainerStyle={{
                elevation: 5,
              }}
            />
            <Text style={sb.count}>({count5})</Text>
          </View>
          {/* Clean* */}
          <View
            style={sb.ratingView}>
            <Text style={sb.ratingText} >{I18n.translate('clean')}</Text>
            <AirbnbRating
              showRating={false}
              size={14}
              count={5}
              defaultRating={count4}
              isDisabled
              selectedColor="#FFCC39"
              starContainerStyle={{
                elevation: 5,
              }}
            />
            <Text style={sb.count}>({count4})</Text>
          </View>
          {/* Captain* */}
          <View
            style={sb.ratingView}>
            <Text style={sb.ratingText} >{I18n.translate('captain')}</Text>
            <AirbnbRating
              showRating={false}
              size={14}
              count={5}
              defaultRating={count3}
              isDisabled
              selectedColor="#FFCC39"
              starContainerStyle={{
                elevation: 5,
              }}
            />
            <Text style={sb.count}>({count3})</Text>
          </View>
          {/* Hospitality* */}
          <View
            style={sb.ratingView}>
            <Text style={sb.ratingText} >{I18n.translate('hospitality')}</Text>
            <AirbnbRating
              showRating={false}
              size={14}
              count={5}
              defaultRating={count2}
              isDisabled
              selectedColor="#FFCC39"
              starContainerStyle={{
                elevation: 5,
              }}
            />
            <Text style={sb.count}>({count2})</Text>
          </View>
          {/* Food* */}
          <View
            style={sb.ratingView}>
            <Text style={sb.ratingText} >{I18n.translate('food')}</Text>
            <AirbnbRating
              showRating={false}
              size={14}
              count={5}
              defaultRating={count1}
              isDisabled
              selectedColor="#FFCC39"
              starContainerStyle={{
                elevation: 5,
              }}
            />
            <Text style={sb.count}>({count1})</Text>
          </View>
          {/* Equipment* */}
          <View
            style={sb.ratingView}>
            <Text style={sb.ratingText} >{I18n.translate('equipment')} </Text>
            <AirbnbRating
              showRating={false}
              size={14}
              count={5}
              defaultRating={count1}
              isDisabled
              selectedColor="#FFCC39"
              starContainerStyle={{
                elevation: 5,
              }}
            />
            <Text style={sb.count}>({count1})</Text>
          </View>
          {/* Entertainment* */}
          <View
            style={sb.ratingView}>
            <Text style={sb.ratingText} >{I18n.translate('entertainment')}</Text>
            <AirbnbRating
              showRating={false}
              size={14}
              count={5}
              defaultRating={count1}
              isDisabled
              selectedColor="#FFCC39"
              starContainerStyle={{
                elevation: 5,
              }}
            />
            <Text style={sb.count}>({count1})</Text>
          </View>
          {/*  */}
        </View>
      </View>
      {/* SEC2 */}
      <View style={sb.SEC2}>
        {loader ? (
          <Loading />
        ) : (
          <View style={{ marginTop: 30 }}>
            <FlatList
              renderItem={item => {
                return (
                  <Card
                    containerStyle={{
                      borderRadius: 12,
                      elevation: 3,
                    }}>
                    {console.log('item==Raa===>', item.item)}
                    <TouchableOpacity
                      onPress={() => gotoRatingsDetails({ item: item.item })}
                      style={{ width: '100%' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {
                            item && item.item.user_image ?
                              <Image
                                style={{ height: 40, width: 40 }}
                                source={{
                                  uri: config.imageUrl + item.item.user_image
                                }}
                              />
                              :
                              <Image
                                style={{ height: 40, width: 40 }}
                                source={{
                                  uri: 'https://source.unsplash.com/weekly?face'
                                }}
                              />
                          }

                          <View style={{ marginLeft: 5 }}>

                            <Text style={{ fontFamily: FontFamily.semi_bold, flex: 1, }}>
                              {item.item.user_name}
                            </Text>
                            <AirbnbRating
                              showRating={false}
                              size={10}
                              count={5}
                              defaultRating={item.rating}
                              isDisabled
                              selectedColor="#FFCC39"
                              starContainerStyle={{
                                elevation: 5,
                                alignSelf: 'flex-start',
                              }}
                            />
                            <Text
                              style={{
                                fontFamily: FontFamily.default,
                                width: Sizes.width - 100
                              }}
                              numberOfLines={2}
                              ellipsizeMode={'tail'}
                            >

                              {item.item.review}
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: FontFamily.default, right: 50
                          }}>
                          {item.item.createtime}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Card>
                );
              }}
              data={data === 'NA' ? [] : data}
              keyExtractor={(item, ind) => ind}
              contentContainerStyle={{
                paddingBottom: 15,
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};
const sb = StyleSheet.create({
  count: {
    fontFamily: FontFamily.default,
    fontSize: 14,
    color: Colors.white,
  },
  SEC2: {
    backgroundColor: Colors.white,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
  },
  ratingView: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
    width: '60%',
    
  },
  ratingText: {
    color: '#fff',
    width: 90,
    
  }
});
export default Ratings;
