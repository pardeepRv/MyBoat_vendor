import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  TextInput,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import I18n from '../../Translations/i18'
import {Icon, Input} from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../Components/Header';
import {back_img, Colors, FontFamily, Sizes} from '../../Constants/Constants';
import {useNavigation} from '@react-navigation/core';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import config from '../../Constants/config';
import ToastMessage from '../../Components/toastMessage/ToastMessage';
import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geocode from 'react-geocode';
const width = Dimensions.get('window').width;
const snapPoints = ['0%', '50%'];
class AddAd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      Arbic_captain: props?.route?.params?.captain_ar || '',
      English_captain: props?.route?.params?.captain_en ?? '',
      Company_name: '',
      Captin_name: '',
      Contact_number: props?.route?.params?.mobile || '',
      tripType: props?.route?.params?.trip_type_id || '',
      boat: props?.route?.params?.boat_id || '',
      max_number_of_people:
        JSON.stringify(props?.route?.params?.no_of_people) || '',
      BoatLang: '',
      BoatLat: '',
      cityOfBoat: props.route?.params?.city_get || '',
      CityName: props.route?.params?.city_name || I18n.translate('select_city'),
      Description_arbic: props?.route?.params?.discription_ar || '',
      Description_engilsh: props?.route?.params?.discription_en || '',
      Rental_price: '',
      Extra_per_hour_price: props?.route.params?.extra_price || '',
      Minimum_hour: props?.route?.params?.minimum_hours || '',
      idle_hours: props?.route?.params?.idle_time || '',
      Coupon_discount: props?.route?.params?.coupon_code || '',
      Coupon_discount_perct: props?.route?.params?.coupon_discount || '',
      bannerLoader: false,
      Discount: props?.route?.params?.discount || '',
      loader1: false,
      loader2: false,
      loader3: false,
      loader4: false,
      loader5: false,
      loader6: false,
      loader7: false,
      locationAddress: null,
      discountError: false,
      tripTypeDropdown: [],
      uploadedImageCount: 0,
      boatDropdown: [],
      cityDropdown: [],
      cityDropdownCopy: [],
      modalVisible: false,
      capacityError: false,
      userId: '',
      images: null,
      imageFiles: [],
      boatCapacity: 0,
      banner: props?.route?.params?.image ?? null,
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      image6: null,
      image7: null,
    };
    this.bottomSheetRef = React.createRef();
    this.addOnData();
  }
  setPosition = (lat, lng) => {
    Geocode.fromLatLng(lat, lng).then(
      response => {
        let address = response.results[1].formatted_address;
        this.setState({
          locationAddress: address,
        });
      },
      error => {
        console.error(error);
      },
    );
  };
  componentDidMount() {
   //alert(this.props.language_id)
    Geocode.setApiKey('AIzaSyBwum8vSJGI-HNtsPVSiK9THpmA2IbgDTg');
    if (this.props?.route?.params?.edit) {
      this.setBoatLocationLatLong(
        this.props?.route?.params?.location_lat,
        this.props?.route?.params?.location_lng,
      );
      this.setBoatCapacity(this.props?.route?.params?.boat_id);
      this.setPosition(
        this.props?.route?.params?.location_lat,
        this.props?.route?.params?.location_lng,
      );
      this.setImages(this.props.route.params.img_arr);
    }
  }
  setBoatLocationLatLong = (lat, lng) => {
    this.setState({BoatLat: lat, BoatLang: lng});
  };

  setImages(arr) {
    arr?.length &&
      arr !== 'NA' &&
      arr.map((item, index) => {
        if (index > 0) {
          switch (index) {
            case 1:
              this.setState({
                image1: item.image,
                uploadedImageCount: arr?.length,
              });
              break;
            case 2:
              this.setState({
                image2: item.image,
                uploadedImageCount: arr?.length,
              });
              break;
            case 3:
              this.setState({
                image3: item.image,
                uploadedImageCount: arr?.length,
              });
              break;
            case 4:
              this.setState({
                image4: item.image,
                uploadedImageCount: arr?.length,
              });
              break;
            case 5:
              this.setState({
                image5: item.image,
                uploadedImageCount: arr?.length,
              });
              break;
            case 6:
              this.setState({
                image6: item.image,
                uploadedImageCount: arr?.length,
              });
              break;
            case 7:
              this.setState({
                image7: item.image,
                uploadedImageCount: arr?.length,
              });
              break;
            default:
              null;
          }
        }
      });
  }
  async setLocationAddress() {
    let location = await AsyncStorage.getItem('location');
    let locationAddress = await AsyncStorage.getItem('locationAddress');
    if (location && locationAddress) {
      this.setState({
        BoatLang: JSON.stringify(JSON.parse(location).lng),
        BoatLat: JSON.stringify(JSON.parse(location).lat),
        locationAddress: locationAddress,
      });
    }
  }
  componentWillUnmount() {}
  uploadImage = type => {
    ImagePicker.openPicker({
      width: Dimensions.get('window').width,
      height: 300,
      cropping: true,
    })
      .then(image => {
        var imagefil = {
          uri: image.path,
          name: image.modificationDate + '.' + image.mime.split('/')[1],
          size: image.size,
          filename: image.modificationDate + '.' + image.mime.split('/')[1],
          type: image.mime,
        };

        var data = new FormData();
        data.append('image', imagefil);
        let url = config.apiUrl + '/upload_adver_image.php';
        axios
          .post(url, data)
          .then(res => {
            if (res.data.success == 'true') {
              this.setState({
                uploadedImageCount: ++this.state.uploadedImageCount,
              });
              switch (type) {
                case 'banner':
                  this.setState({
                    banner: res?.data?.image_name,
                    bannerLoader: !this.state.bannerLoader,
                  });
                  break;
                case '1':
                  this.setState({
                    image1: res.data.image_name,
                    loader1: !this.state.loader1,
                  });
                  break;
                case '2':
                  this.setState({
                    image2: res.data.image_name,
                    loader2: !this.state.loader2,
                  });
                  break;
                case '3':
                  this.setState({
                    image3: res.data.image_name,
                    loader3: !this.state.loader3,
                  });
                  break;
                case '4':
                  this.setState({
                    image4: res.data.image_name,
                    loader4: !this.state.loader4,
                  });
                  break;
                case '5':
                  this.setState({
                    image5: res.data.image_name,
                    loader5: !this.state.loader5,
                  });
                  break;
                case '6':
                  this.setState({
                    image6: res.data.image_name,
                    loader6: !this.state.loader6,
                  });
                  break;
                case '7':
                  this.setState({
                    image7: res.data.image_name,
                    loader7: !this.state.loader7,
                  });
                  break;
                default:
                  Alert.alert('TYPE NOT FOUND');
              }
            } else {
            }
          })
          .catch(err => {
            this.stopLoader(type);
          });
      })
      .catch(err => {
        this.stopLoader(type);
      });
  };
  stopLoader = type => {
    switch (type) {
      case 'banner':
        this.setState({
          banner: res.data.image_name,
          bannerLoader: !this.state.bannerLoader,
        });
        break;
      case '1':
        this.setState({loader1: !this.state.loader1});
        break;
      case '2':
        this.setState({loader2: !this.state.loader2});
        break;
      case '3':
        this.setState({loader3: !this.state.loader3});
        break;
      case '4':
        this.setState({loader4: !this.state.loader4});
        break;
      case '5':
        this.setState({loader5: !this.state.loader5});
        break;
      case '6':
        this.setState({loader6: !this.state.loader6});
        break;
      case '7':
        this.setState({loader7: !this.state.loader7});
        break;
      default:
        Alert.alert('TYPE NOT FOUND');
    }
  };
  sortCity = arr => {
    arr.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  };

  addOnData = async () => {
    let userInfo = await AsyncStorage.getItem('userInfo');

    let parsedInfo = JSON.parse(userInfo);
    this.setState(
      {
        userId: parsedInfo.id,
      },
      () => {
        this.setLocationAddress();
        let url =
          config.apiUrl +
          '/boat_trip_type_for_add_advr.php?user_id_post=' +
          this.state.userId +
          '&country_code=965';
        axios
          .get(url)
          .then(res => {
            if (res) {
              var cityArr = res?.data?.city_arr || [];
              var arr = [];
              cityArr.map(item => {
                var cityItem = {id: item.city_id, name: this.props.language_id == 0? item.city[0]:item.city[1]};
                arr.push(cityItem);
              });
              this.sortCity(arr);
              this.setState(
                {
                  tripTypeDropdown: res.data.trip_type_arr,
                  boatDropdown: res.data.boat_arr,
                  cityDropdown: arr,
                  cityDropdownCopy: arr,
                },
                () => {
                  if (this.props?.route?.params?.edit)
                    this.setBoatCapacity(this.props?.route?.params?.boat_id);
                },
              );
            } else {
              if(this.props.language_id == 0)
              alert(res.data.msg[0]);
              else   alert(res.data.msg[1]);
            }
          })
          .catch(err => console.log(err));
      },
    );
  };
  Addad = async () => {
    const {
      Arbic_captain,
      English_captain,
      Captin_name,
      Company_name,
      Contact_number,
      tripType,
      boat,
      max_number_of_people,
      BoatLang,
      BoatLat,
      Description_arbic,
      Description_engilsh,
      Rental_price,
      Extra_per_hour_price,
      Minimum_hour,
      idle_hours,
      Coupon_discount,
      Coupon_discount_perct,
      Discount,
      banner,
      image1,
      image2,
      image3,
      cityOfBoat,
    } = this.state;
    if (!banner || banner === '') {
      alert(I18n.translate('banner_image'));
      return;
    }
    if (this.state.uploadedImageCount < 3) {
      alert(I18n.translate('upload_pic_alert'));
      return;
    }
    if (this.state.discountError) {
      alert(I18n.translate('invalid_coupon'));
      return;
    }

    if (Arbic_captain === '') {
      alert(I18n.translate('ar_cap_name'));
    } else if (English_captain === '') {
      alert(I18n.translate('en_cap_name'));
    } else if (Contact_number === '') {
      alert(I18n.translate('contact_num_alert'));
    } else if (tripType === '') {
      alert(I18n.translate('trip_type_alert'));
    } else if (boat === '') {
      alert(I18n.translate('select_boat_alert'));
    } else if (max_number_of_people === '') {
      alert(I18n.translate('max_people_alert'));
    } else if (BoatLang === '') {
      alert(I18n.translate('location_alert'));
    } else if (cityOfBoat === '') {
      alert(I18n.translate('select_city_alert'));
    } else if (Description_arbic === '') {
      alert(I18n.translate('des_ar_alert'));
    } else if (Description_engilsh === '') {
      alert(I18n.translate('des_en_alert'));
    } else if (Extra_per_hour_price === '') {
      alert(I18n.translate('extra_hour_alert'));
    } else if (Minimum_hour === '') {
      alert(I18n.translate('min_hour_alert'));
    } else if (idle_hours === '') {
      alert(I18n.translate('ideal_hours'));
    } else {
      let data = {
        Arbic_captain: this.state.Arbic_captain,
        English_captain: this.state.English_captain,
        Contact_number: this.state.Contact_number,
        Trip_type: this.state.tripType,
        Boat: this.state.boat,
        Max_number_of_people: this.state.max_number_of_people,
        BoatLang: this.state.BoatLang,
        BoatLat: this.state.BoatLat,
        cityOfBoat: this.state.cityOfBoat,
        Description_arbic: this.state.Description_arbic,
        Description_engilsh: this.state.Description_engilsh,
        Extra_per_hour_price: this.state.Extra_per_hour_price,
        Minimum_hour: this.state.Minimum_hour,
        idle_hours: this.state.idle_hours,
        Coupon_discount: this.state.Coupon_discount,
        Coupon_discount_perct: this.state.Coupon_discount_perct,
        Discount: this.state.Discount,

        images: [
          this.state.banner,
          this.state.image1,
          this.state.image2,
          this.state.image3,
          this.state.image4,
          this.state.image5,
          this.state.image6,
          this.state.image7,
        ],
      };
      if (
        this.props.route?.params?.advertisement_id &&
        this.props.route?.params?.edit
      ) {
        if (this.props.route?.params?.trip_time_type === 1) {
          (data.trip_time_start = this.props.route.params?.trip_time_start),
            (data.trip_time_end = this.props.route.params?.trip_time_end);
        } else {
          data.trip_time_start = this.props.route?.params?.trip_time_start;
        }
        (data.addon_arr =
          JSON.parse(JSON.stringify(this.props?.route?.params?.addon_arr)) ||
          []),
          (data.destination_arr =
            JSON.parse(
              JSON.stringify(this.props?.route?.params?.destination_arr),
            ) || []),
          (data.free_cancel_days =
            this.props.route?.params?.free_cancel_days || null),
          (data.advertisement_id =
            this.props?.route?.params?.advertisement_id || null);
        data.trip_time_type = this.props?.route?.params.trip_time_type;
        data.trip_type_id = this.props?.route?.params.trip_type_id;
        data.adver_boat_type = this.props?.route?.params?.adver_boat_type;
      }
      this.props.navigation.navigate('AddAd1', {
        data: data,
      });
    }
  };
  renderTripTypeValues() {
    return this.state.tripTypeDropdown.map((item, key) => (
      <Picker.Item label={this.props.language_id == 0? item?.name[0]: item?.name[1]} value={item?.trip_type_id} key={key} />
    ));
  }
  _searchCity = e => {
    let text = e.toLowerCase();
    let cityArrCopy = this.state.cityDropdown;
    let filteredName = cityArrCopy.filter(item => {
      return item.name.toLowerCase().match(text);
    });
    if (!text || !text.length || text === '') {
      this.setState({cityDropdownCopy: this.state.cityDropdown});
    } else if (!filteredName.length) {
      this.setState({cityArrCopyCopy: this.state.cityDropdown});
    } else if (Array.isArray(filteredName)) {
      this.setState({cityDropdownCopy: filteredName});
    }
  };
  _selectCity = item => {
    this.setState({
      CityName: item.name,
      cityOfBoat: item.id,
      modalVisible: false,
    });
  };

  setBoatCapacity = boat_id => {
    this.state.boatDropdown !== 'NA' &&
    this.state.boatDropdown?.length &&
      this.state.boatDropdown.forEach(item => {
        if (item.boat_id === boat_id) {
          this.setState({
            max_number_of_people: item.boat_capacity,
            boatCapacity: item.boat_capacity,
          });
        }
      });
  };
  render() {
    return (
      <BottomSheetModalProvider>
        <View style={{flex: 1, backgroundColor: Colors.white}}>
          <Header
            imgBack={true}
            name={I18n.translate('add_ad')}
            backBtn={true}
            headerHeight={120}
          />
          <ScrollView
            style={{
              marginVertical: -30,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              backgroundColor: '#fff',
             // paddingHorizontal:10
            }}>
            <Modal
              onRequestClose={() => {
                this.setState({modalVisible: false});
              }}
              visible={this.state.modalVisible}
              animationType={'slide'}
              animationInTiming={500}
              animationOutTiming={500}>
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <AntDesign
                    name={'arrowleft'}
                    onPress={() => {
                      this.setState({modalVisible: false});
                    }}
                    size={25}
                    style={{padding: 5, marginHorizontal: 10}}
                  />

                  <TextInput
                      textAlign={this.props.language_id == 0? 'left':'right'}
                    placeholder={I18n.translate('search_city')}
                    //value={placeholderText}
                    onChangeText={text => {
                      //setPlaceholderText(text);
                      this._searchCity(text);
                    }}
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.orange,
                      width: '85%',
                      borderRadius: 10,
                      marginVertical: 10,
                    }}
                  />
                </View>
                <FlatList
                  data={this.state.cityDropdownCopy}
                  renderItem={({item}) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this._selectCity(item);
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 18,
                            marginVertical: 3,
                            marginHorizontal: 20,
                          }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </Modal>
            <View style={s.SEC2}>
              <View
                style={{
                
                  height: 300,
                  width: Dimensions.get('window').width,
                  backgroundColor: 'black',
                  opacity: 0.8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf:'center'
                  //zIndex:-1
                }}>
                {this.state.banner ? (
                  <ImageBackground
                    source={{uri: config.imageUrl + this.state.banner}}
                    style={{
                      height: 300,
                      width: 400,
                    }}
                  />
                ) : this.state.bannerLoader ? (
                  <ActivityIndicator size={40} color={Colors.orange} />
                ) : (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 20,
                      fontFamily: FontFamily.default,
                    }}>
                    {`${I18n.translate('upload_text')}\n`}{`${I18n.translate('sub_upload_text')}` }
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={{zIndex: 1, right: 15, bottom: 15, position: 'absolute'}}
                onPress={() => {
                  this.setState({bannerLoader: !this.state.bannerLoader});
                  this.uploadImage('banner');
                }}>
                <Image
                  source={require('../../Images/chose_image.png')}
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 2,
                  }}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                marginLeft: 10,
                marginTop: 10,
                fontSize: 16,
                fontWeight: 'bold',
              }}>
           {I18n.translate('add_more')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                marginVertical: 15,
              }}>
              <View style={{marginHorizontal: 2, marginVertical: 5}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({loader1: !this.state.loader1}, () =>
                      this.uploadImage('1'),
                    );
                  }}>
                  {this.state.loader1 ? (
                    <View
                      style={{
                        borderColor: Colors.orange,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                        width: 50,
                        borderWidth: 2,
                        borderRadius: 5,
                        marginHorizontal: 5,
                      }}>
                      <ActivityIndicator size={20} color={Colors.orange} />
                    </View>
                  ) : (
                    <Image
                      source={
                        this.state.image1
                          ? {uri: config.imageUrl + this.state.image1}
                          : require('../../Images/chose_image.png')
                      }
                      style={s.imagePicker}
                    />
                  )}

                  <AntDesign
                    onPress={() => {
                      this.setState({
                        image1: null,
                        uploadedImageCount: this.state.uploadedImageCount - 1,
                      });
                    }}
                    style={this.state.loader1 ? s.closeIcon : s.closeIcon2}
                    name="closecircle"
                    size={18}
                  />
                </TouchableOpacity>
              </View>
              <View style={{marginHorizontal: 2, marginVertical: 5}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({loader2: !this.state.loader2}, () =>
                      this.uploadImage('2'),
                    );
                  }}>
                  {this.state.loader2 ? (
                    <View
                      style={{
                        borderColor: Colors.orange,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                        width: 50,
                        borderWidth: 2,
                        borderRadius: 5,
                        marginHorizontal: 5,
                      }}>
                      <ActivityIndicator size={20} color={Colors.orange} />
                    </View>
                  ) : (
                    <Image
                      source={
                        this.state.image2
                          ? {uri: config.imageUrl + this.state.image2}
                          : require('../../Images/chose_image.png')
                      }
                      style={s.imagePicker}
                    />
                  )}

                  <AntDesign
                    onPress={() => {
                      this.setState({
                        image2: null,
                        uploadedImageCount: this.state.uploadedImageCount - 1,
                      });
                    }}
                    style={this.state.loader2 ? s.closeIcon : s.closeIcon2}
                    name="closecircle"
                    size={18}
                  />
                </TouchableOpacity>
              </View>
              <View style={{marginHorizontal: 2, marginVertical: 5}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({loader3: !this.state.loader3}, () =>
                      this.uploadImage('3'),
                    );
                  }}>
                  {this.state.loader3 ? (
                    <View
                      style={{
                        borderColor: Colors.orange,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                        width: 50,
                        borderWidth: 2,
                        borderRadius: 5,
                        marginHorizontal: 5,
                      }}>
                      <ActivityIndicator size={20} color={Colors.orange} />
                    </View>
                  ) : (
                    <Image
                      source={
                        this.state.image3
                          ? {uri: config.imageUrl + this.state.image3}
                          : require('../../Images/chose_image.png')
                      }
                      style={s.imagePicker}
                    />
                  )}

                  <AntDesign
                    onPress={() => {
                      this.setState({
                        image3: null,
                        uploadedImageCount: this.state.uploadedImageCount - 1,
                      });
                    }}
                    style={this.state.loader3 ? s.closeIcon : s.closeIcon2}
                    name="closecircle"
                    size={18}
                  />
                </TouchableOpacity>
              </View>
              <View style={{marginHorizontal: 2, marginVertical: 5}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({loader4: !this.state.loader4}, () =>
                      this.uploadImage('4'),
                    );
                  }}>
                  {this.state.loader4 ? (
                    <View
                      style={{
                        borderColor: Colors.orange,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                        width: 50,
                        borderWidth: 2,
                        borderRadius: 5,
                        marginHorizontal: 5,
                      }}>
                      <ActivityIndicator size={20} color={Colors.orange} />
                    </View>
                  ) : (
                    <Image
                      source={
                        this.state.image4
                          ? {uri: config.imageUrl + this.state.image4}
                          : require('../../Images/chose_image.png')
                      }
                      style={s.imagePicker}
                    />
                  )}

                  <AntDesign
                    onPress={() =>
                      this.setState({
                        image4: null,
                        uploadedImageCount: this.state.uploadedImageCount - 1,
                      })
                    }
                    style={this.state.loader4 ? s.closeIcon : s.closeIcon2}
                    name="closecircle"
                    size={18}
                  />
                </TouchableOpacity>
              </View>
              <View style={{marginHorizontal: 2, marginVertical: 5}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({loader5: !this.state.loader5}, () =>
                      this.uploadImage('5'),
                    );
                  }}>
                  {this.state.loader5 ? (
                    <View
                      style={{
                        borderColor: Colors.orange,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                        width: 50,
                        borderWidth: 2,
                        borderRadius: 5,
                        marginHorizontal: 5,
                      }}>
                      <ActivityIndicator size={20} color={Colors.orange} />
                    </View>
                  ) : (
                    <Image
                      source={
                        this.state.image5
                          ? {uri: config.imageUrl + this.state.image5}
                          : require('../../Images/chose_image.png')
                      }
                      style={s.imagePicker}
                    />
                  )}

                  <AntDesign
                    onPress={() =>
                      this.setState({
                        image5: null,
                        uploadedImageCount: this.state.uploadedImageCount - 1,
                      })
                    }
                    style={this.state.loader5 ? s.closeIcon : s.closeIcon2}
                    name="closecircle"
                    size={18}
                  />
                </TouchableOpacity>
              </View>
              <View style={{marginHorizontal: 2, marginVertical: 5}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({loader6: !this.state.loader6}, () =>
                      this.uploadImage('6'),
                    );
                  }}>
                  {this.state.loader6 ? (
                    <View
                      style={{
                        borderColor: Colors.orange,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                        width: 50,
                        borderWidth: 2,
                        borderRadius: 5,
                        marginHorizontal: 5,
                      }}>
                      <ActivityIndicator size={20} color={Colors.orange} />
                    </View>
                  ) : (
                    <Image
                      source={
                        this.state.image6
                          ? {uri: config.imageUrl + this.state.image6}
                          : require('../../Images/chose_image.png')
                      }
                      style={s.imagePicker}
                    />
                  )}

                  <AntDesign
                    onPress={() =>
                      this.setState({
                        image6: null,
                        uploadedImageCount: this.state.uploadedImageCount - 1,
                      })
                    }
                    style={this.state.loader6 ? s.closeIcon : s.closeIcon2}
                    name="closecircle"
                    size={18}
                  />
                </TouchableOpacity>
              </View>
              <View style={{marginHorizontal: 2, marginVertical: 5}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({loader7: !this.state.loader7}, () =>
                      this.uploadImage('7'),
                    );
                  }}>
                  {this.state.loader7 ? (
                    <View
                      style={{
                        borderColor: Colors.orange,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 51,
                        width: 51,
                        borderWidth: 2,
                        borderRadius: 5,
                        marginHorizontal: 5,
                      }}>
                      <ActivityIndicator size={20} color={Colors.orange} />
                    </View>
                  ) : (
                    <Image
                      source={
                        this.state.image7
                          ? {uri: config.imageUrl + this.state.image7}
                          : require('../../Images/chose_image.png')
                      }
                      style={s.imagePicker}
                    />
                  )}

                  <AntDesign
                    onPress={() =>
                      this.setState({
                        image7: null,
                        uploadedImageCount: this.state.uploadedImageCount - 1,
                      })
                    }
                    style={this.state.loader7 ? s.closeIcon : s.closeIcon2}
                    name="closecircle"
                    size={18}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={{marginTop: 5}}>
              <Input
                fontFamily={FontFamily.default}
                value={this.state.Arbic_captain}
                placeholder= {I18n.translate('captain_name_ar')}
                containerStyle={{...s.Input}}
                textAlign={this.props.language_id == 0? 'left':'right'}
                inputContainerStyle={{...s.Input}}
                placeholderTextColor={Colors.gray1}
                onChangeText={Arbic_captain => this.setState({Arbic_captain})}
              />
              <Input
                fontFamily={FontFamily.default}
                value={this.state.English_captain}
                placeholder={I18n.translate('captain_name_en')}
                containerStyle={s.Input}
                textAlign={this.props.language_id == 0? 'left':'right'}
                inputContainerStyle={s.Input}
                placeholderTextColor={Colors.gray1}
                onChangeText={English_captain =>
                  this.setState({English_captain})
                }
              />
              <Input
                fontFamily={FontFamily.default}
                value={this.state.Contact_number}
                placeholder={I18n.translate('contact_num')}
                containerStyle={s.Input}
                textAlign={this.props.language_id == 0? 'left':'right'}
                keyboardType={'phone-pad'}
                inputContainerStyle={s.Input}
                placeholderTextColor={Colors.gray1}
                onChangeText={Contact_number => this.setState({Contact_number})}
              />
              <View style={{...s.Picker, marginTop: -20}}>
                {/* <Text style={s.PickerText}>Select Trip Type</Text> */}
                {this.state.tripTypeDropdown?.length > 0 && (
                  <Picker
                    style={{fontFamily: FontFamily.default}}
                    mode="dialog"
                    iosHeader="Time Zone"
                    iosIcon={<AntDesign name="down" size={15} />}
                    style={{width: '100%'}}
                    selectedValue={this.state.tripType}
                    onValueChange={(modeValue, modeIndex) =>
                      this.setState({tripType: modeValue})
                    }>
                    <Picker.Item
                      style={{fontFamily: FontFamily.default}}
                      label={I18n.translate('select_trip_type')}
                      color={Colors.gray}
                      value={''}
                    />

                    {this.renderTripTypeValues()}
                  </Picker>
                )}
              </View>

              <View style={{...s.Picker, marginTop: -10}}>
                {/* <Text style={s.PickerText}>Select Boat</Text> */}
                {this.state.boatDropdown?.length > 0 && (
                  <Picker
                    mode="dialog"
                    fontFamily={FontFamily.default}
                    iosHeader="Time Zone"
                    iosIcon={<AntDesign name="down" size={15} />}
                    style={{width: '100%'}}
                    selectedValue={this.state.boat}
                    onValueChange={(modeValue, modeIndex) => {
                      this.setBoatCapacity(modeValue);
                      this.setState({boat: modeValue});
                    }}>
                    <Picker.Item
                      label={I18n.translate('choose_boat')}
                      color={Colors.gray}
                      value={''}
                    />
                    {this.state.boatDropdown !== "NA" && this.state.boatDropdown.map((item, key) => (
                      <Picker.Item
                        style={{fontFamily: FontFamily.default}}
                        label={item.name}
                        value={item.boat_id}
                        key={key}
                      />
                    ))}
                  </Picker>
                )}
              </View>
              <TouchableOpacity
                onPress={() => this.currentlocation()}
                style={{
                  ...s.Picker,
                  flexDirection: 'row',
                  marginTop: 8,
                  justifyContent: 'space-between',
                  paddingBottom: 15,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    ...s.PickerText,
                    fontSize: 16,
                    maxWidth: Dimensions.get('window').width * 0.8,
                    marginStart: 15,
                    color: !this.state.locationAddress
                      ? Colors.gray
                      : Colors.black,
                    fontFamily: FontFamily.default,
                  }}>
                  {(this.state.locationAddress && this.state.locationAddress) ||
                    I18n.translate('choose_boat_location')}
                </Text>
                <Entypo name="location" size={15} style={{marginRight: 15}} />
              </TouchableOpacity>
              {this.state.capacityError && (
                <View style={{marginHorizontal: 15}}>
                  <Text
                    style={{
                      color: 'red',
                      fontSize: 16,
                      fontFamily: FontFamily.default,
                    }}>
                    {`${I18n.translate('exceed_cap')}!`}
                  </Text>
                </View>
              )}
              <TextInput
                value={this.state.max_number_of_people}
                placeholder={I18n.translate('max_num_of_people')}
                keyboardType={'phone-pad'}
                textAlign={this.props.language_id == 0? 'left':'right'}
                //defaultValue={this.state.max_number_of_people}
                style={
                  this.state.capacityError
                    ? [
                        s.Input2,
                        {marginHorizontal: 15, marginBottom: 15, marginTop: -5},
                      ]
                    : [
                        s.Input,
                        {
                          marginHorizontal: 17,
                          borderColor: 'red',
                          borderBottomWidth: 1,
                          marginBottom: 17,
                          marginTop: -5,
                        },
                      ]
                }
                color={this.state.capacityError ? 'red' : '#000'}
                fontSize={16}
                fontFamily={FontFamily.default}
                onChangeText={max_number_of_people => {
                  this.setState({max_number_of_people}, () => {
                    if (
                      parseInt(this.state.max_number_of_people) >
                      parseInt(this.state.boatCapacity)
                    ) {
                      this.setState({capacityError: true});
                    } else {
                      this.setState({capacityError: false});
                    }
                  });
                }}
              />
              <TouchableOpacity
                onPress={() => this.setState({modalVisible: true})}
                style={{
                  ...s.Picker,
                  flexDirection: 'row',
                  paddingBottom: 10,
                  justifyContent: 'space-between',
                }}>
                <Text
                  textBreakStrategy={'simple'}
                  style={
                    this.state.CityName === I18n.translate('select_city')
                      ? {
                          ...s.PickerText,
                          color: Colors.gray,
                          fontFamily: FontFamily.default,
                        }
                      : {
                          ...s.PickerText,
                          color: Colors.black,
                          fontFamily: FontFamily.default,
                        }
                  }>
                  {this.state.CityName}
                </Text>
                <AntDesign
                  name="right"
                  size={15}
                  style={{alignSelf: 'center'}}
                />
              </TouchableOpacity>
              <Text
                style={{
                  marginStart: 10,
                  fontSize: 18,
                  marginBottom: 5,
                  color: '#888',
                  fontFamily: FontFamily.default,
                }}>
                {I18n.translate('description_en')}
              </Text>
              <TextInput
               textAlign={this.props.language_id == 0? 'left':'right'}
                value={this.state.Description_engilsh}
                placeholder={I18n.translate('description_en')}
                style={{
                  ...s.Input,
                  height: 120,
                  borderWidth: 1,
                  fontSize: 18,
                  fontFamily: FontFamily.default,
                  borderColor: Colors.gray1,
                  width: '95%',
                  alignSelf: 'center',
                  marginBottom: 15,
                  //textAlign: 'justify',
                }}
                multiline={true}
                placeholderTextColor={Colors.gray}
                onChangeText={Description_engilsh =>
                  this.setState({Description_engilsh})
                }
              />
              <Text
                style={{
                  marginStart: 10,
                  fontSize: 18,
                  marginBottom: 5,
                  color: '#888',
                  fontFamily: FontFamily.default,
                }}>
                {I18n.translate('description_ar')}
              </Text>
              <TextInput
                textAlign={this.props.language_id == 0? 'left':'right'}
                value={this.state.Description_arbic}
                placeholder={I18n.translate('description_ar')}
                style={{
                  ...s.Input,
                  height: 120,
                  fontFamily: FontFamily.default,
                  borderWidth: 1,
                  fontSize: 18,
                  fontFamily: FontFamily.default,
                  width: '95%',
                  alignSelf: 'center',
                  borderColor: Colors.gray1,
                }}
                multiline={true}
                placeholderTextColor={Colors.gray1}
                onChangeText={Description_arbic =>
                  this.setState({Description_arbic})
                }
              />
              <Input
                value={this.state.Extra_per_hour_price}
                placeholder={I18n.translate('extra_hour')}
                keyboardType={'phone-pad'}
                fontFamily={FontFamily.default}
                containerStyle={s.Input}
                inputContainerStyle={s.Input}
                textAlign={this.props.language_id == 0? 'left':'right'}
                placeholderTextColor={Colors.gray1}
                onChangeText={Extra_per_hour_price =>
                  this.setState({Extra_per_hour_price})
                }
              />
              <Input
                value={this.state.Minimum_hour}
                placeholder={I18n.translate('min_hour')}
                keyboardType={'phone-pad'}
                textAlign={this.props.language_id == 0? 'left':'right'}
                fontFamily={FontFamily.default}
                containerStyle={s.Input}
                inputContainerStyle={s.Input}
                placeholderTextColor={Colors.gray1}
                onChangeText={Minimum_hour => this.setState({Minimum_hour})}
              />
              <Input
                value={this.state.idle_hours}
                placeholder={I18n.translate('idle_hour')}
                fontFamily={FontFamily.default}
                keyboardType={'phone-pad'}
                containerStyle={s.Input}
                textAlign={this.props.language_id == 0? 'left':'right'}
                inputContainerStyle={s.Input}
                placeholderTextColor={Colors.gray1}
                onChangeText={idle_hours => this.setState({idle_hours})}
              />
              {this.state.discountError && (
                <View style={{marginHorizontal: 15}}>
                  <Text
                    style={{
                      color: 'red',
                      fontSize: 16,
                      marginBottom: 8,
                    }}>
                   {I18n.translate('coupon_code_length_alert')}
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: '98%',
                  marginBottom: 15,
                  marginHorizontal: 10,
                  borderBottomWidth: 1,
                  alignSelf: 'center',
                  borderBottomColor: Colors.gray,
                }}>
                <TextInput
                 textAlign={this.props.language_id == 0? 'left':'right'}
                  placeholder={I18n.translate('coupon_discount')}
                  keyboardType={'default'}
                  fontFamily={FontFamily.default}
                  defaultValue={this.state.Coupon_discount}
                  color={this.state.discountError ? 'red' : '#000'}
                  style={{width: width * 0.72, fontSize: 18}}
                  placeholderTextColor={Colors.gray1}
                  onChangeText={Coupon_discount =>
                    this.setState({Coupon_discount}, () => {
                      if (!this.state.Coupon_discount.length) {
                        this.setState({discountError: false});
                        return;
                      }
                      if (
                        this.state.Coupon_discount.length < 6 ||
                        this.state.Coupon_discount.toUpperCase() !==
                          this.state.Coupon_discount ||
                        this.state.Coupon_discount.length > 6
                      ) {
                        this.setState({discountError: true});
                      } else {
                        this.setState({discountError: false});
                      }
                    })
                  }
                />
                <TextInput
                  value={this.state.Coupon_discount_perct}
                  fontFamily={FontFamily.default}
                  placeholder="%"
                  textAlign={this.props.language_id == 0? 'left':'right'}
                  keyboardType={'phone-pad'}
                  style={{
                    width: width * 0.2,
                    borderWidth: 1,
                    borderColor: Colors.gray,
                    height: 40,
                    borderRadius: 10,
                  }}
                  placeholderTextColor={Colors.gray1}
                  onChangeText={Coupon_discount_perct =>
                    this.setState({Coupon_discount_perct})
                  }
                />
              </View>
              <Input
                value={this.state.Discount}
                fontFamily={FontFamily.default}
                placeholder={`${I18n.translate('discount')} %`}
                keyboardType={'phone-pad'}
                containerStyle={s.Input}
                textAlign={this.props.language_id == 0? 'left':'right'}
                inputContainerStyle={s.Input}
                placeholderTextColor={Colors.gray1}
                onChangeText={Discount => this.setState({Discount})}
              />
            </View>
            <View style={{marginBottom: 30}}>
              <TouchableOpacity onPress={() => this.Addad()} style={s.btn1}>
                <Text style={s.btn1Text}>{I18n.translate('next')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <BottomSheetModal
          ref={this.bottomSheetRef}
          snapPoints={snapPoints}
          index={1}
          backdropComponent={BottomSheetBackdrop}
          backgroundComponent={() => <View style={s.contentContainer} />}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              marginHorizontal: 10,
            }}>
            <GooglePlacesAutocomplete
              placeholder="Search"
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                this.allmapdata(data);
              }}
              query={{
                key: 'AIzaSyBwum8vSJGI-HNtsPVSiK9THpmA2IbgDTg',
                language: 'en',
                components: 'country:IN',
              }}
            />

            <TouchableOpacity
              onPress={() => this.currentlocation()}
              style={{
                width: '95%',
                backgroundColor: Colors.orange,
                borderRadius: 10,
                alignSelf: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  paddingVertical: 10,
                  color: '#fff',
                }}>
                Current Location
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  }
  currentlocation = () => {
    this.props.navigation.navigate('MapView', {
      params: {
        location_lat: parseFloat(this.props?.route?.params?.location_lat),
        location_lng: parseFloat(this.props?.route?.params?.location_lng),
        setLocationAddress: () => this.setLocationAddress(),
      },
    });
  };
}

const mapStateToProps = (state)=>({
  language_id: state.data_Reducer.language_id

})



export default connect(mapStateToProps)(AddAd)
const s = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
   
    borderRadius: 10,
    height: 300,
    width: 400,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  Input1: {
    borderBottomColor: Colors.gray,
    marginTop: -7,
  },
  Input: {
    borderBottomColor: Colors.gray,
  },
  Input2: {
    borderBottomColor: 'red',
    borderBottomWidth: 1,
  },
  btn1: {
    height: 48,
    width: '95%',
    backgroundColor: Colors.orange,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 5,
  },
  btn1Text: {
    fontSize: 20,
    fontFamily: FontFamily.semi_bold,
    color: Colors.white,
  },
  Picker: {
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 15,
  },
  PickerText: {
    fontSize: 18,
    marginStart: 5,
  },
  imagePicker: {
    height: width / 9,
    width: width / 9,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  closeIcon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  closeIcon2: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: -5,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  main_view_flag: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-end',
    paddingRight: 20,
    paddingLeft: 20,
    paddingVertical: 10,
    // marginTop: 20,
  },
  flag_text_detail: {
    color: '#333232',
    fontSize: 16,
    fontFamily: 'Ubuntu-Regular',
  },
  Notifications_title: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 20,
    color: '#000',
  },
  search_bar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#000',
    borderTopWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  notification_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: Colors.orange,
    paddingTop: 20,
    paddingBottom: 20,
  },
  contentContainer: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#DAE1E7',
  },
});

