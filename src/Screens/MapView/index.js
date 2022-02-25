import React, {Component} from 'react';
import {
  View,
  Image,
  StatusBar,
  Text,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  PermissionsAndroid,
  BackHandler,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {debounce} from 'lodash';
import MapView from 'react-native-maps';
import {mapMarker} from './assets';
import I18n from '../../Translations/i18'
import styles from './styles';
import Geolocation from 'react-native-geolocation-service';
import {CommonActions} from '@react-navigation/native';
import Geocode from 'react-geocode';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Icon2 from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../../Constants/Constants';
import config from '../../Constants/config';
const latitudeDelta = 0.005;
const longitudeDelta = 0.005;
let changedLat = 0.0;
let changedLng = 0.0;
let address = '';
class HomeLocator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude:
          (props?.route?.params?.params?.location_lat &&
            props?.route?.params?.params?.location_lat) ||
          0,
        longitude:
          (props?.route?.params?.params?.location_lng &&
            props?.route?.params?.params?.location_lng) ||
          0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      isPanding: false,
      props_location: false,
      openModal: false,
      locationcode: '',
      locationLat: '',
      placeholder: '',
      locationLng: '',
      loading: true,

      location_pincode: '',
    };
    (this.mapView = React.createRef()),
      (this.onPanDrag = debounce(this.onPanDrag, 10000, {
        leading: true,
        trailing: false,
      }));
  }
  componentDidMount() {
    if (
      this.state.region.latitude &&
      this.state.region.longitude &&
      this.state.region.latitude !== '' &&
      this.state.region.longitude !== ''
    ) {
      let latitude = this.state.region.latitude;
      let longitude = this.state.region.longitude;
      setTimeout(() => {
        this.mapView.current.animateToRegion(
          {
            longitude: parseFloat(longitude),
            latitude: parseFloat(latitude),
            latitudeDelta: 0.4,
            longitudeDelta: 0.4,
          },
          1000,
        );
      }, 500);
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.allloaction();
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    Geolocation.clearWatch(this.watchID);
  }

  handleBackButton = () => {
    this.props.navigation.goBack();
    return true;
  };
  async requestLocationPermission() {
    try {
      if (Platform.OS === 'ios') {
        // Geolocation.requestAuthorization();
        const auth = await Geolocation.requestAuthorization("whenInUse");
        console.log("authTest",auth)
        if(auth === "granted") {
          this.callLocation();
        }
        
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.callLocation();
        } else {
          alert('Permission Denied');
        }
      }
    } catch (err) {
      alert('err', err);
      console.warn(err);
    }
  }
  allloaction() {
    Geocode.setApiKey('AIzaSyBwum8vSJGI-HNtsPVSiK9THpmA2IbgDTg');

    this.requestLocationPermission();
  }
  callLocation() {
    Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);

        const regions = {
          latitude: parseFloat(currentLatitude),
          longitude: parseFloat(currentLongitude),
          latitudeDelta,
          longitudeDelta,
        };
        if (this.state.region.latitude && this.state.region.longitude) {
          regions.latitude = this.state.region.latitude;
          regions.longitude = this.state.region.longitude;
        }
        this.setState({region: regions, loading: false});
      },
      error => alert(error.message),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition(position => {
      const currentLongitude = JSON.stringify(position.coords.longitude);

      const currentLatitude = JSON.stringify(position.coords.latitude);
      //getting the Latitude from the location json
      this.setState({region: {longitude: currentLongitude}});

      //Setting state Longitude to re re-render the Longitude Text
      this.setState({region: {latitude: currentLatitude}});
      const regions = {
        latitude: parseFloat(currentLatitude),
        longitude: parseFloat(currentLongitude),
        latitudeDelta,
        longitudeDelta,
      };
    });
  }

  onRegionChangeComplete = async region => {
    changedLat = region.latitude;
    changedLng = region.longitude;
    this.setPosition(changedLat, changedLng);
  };
  setPosition = (changedLat, changedLng) => {
    Geocode.fromLatLng(changedLat, changedLng).then(
      response => {
        address = response.results[0].formatted_address;
        this.pincodeGenerate(address);
        this.setState({
          locationcode: address,
          locationLat: response.results[0].geometry.location.lat,
          locationLng: response.results[0].geometry.location.lng,
        });
      },
      error => {
        console.error(error);
      },
    );
  };
  onPanDrag = () => {
    const {isPanding} = this.state;
    if (isPanding) {
      return;
    }
    this.setState({
      isPanding: true,
      props_location: false,
    });
  };
  pincodeGenerate = address => {
    var str = address;
    var res = str.slice(-13, -7);
    this.setState({
      location_pincode: res,
    });
  };
  savelocation = () => {
    let locationdata = JSON.stringify({
      lng: this.state.locationLng,
      lat: this.state.locationLat,
    });
    AsyncStorage.setItem('locationAddress', this.state.locationcode);
    AsyncStorage.setItem('location', locationdata);
    this.props.route.params.params.setLocationAddress();
    this.props.navigation.goBack();
  };
  allmapdata(data) {
    Geocode.fromAddress(data.description).then(
      response => {
        const {lat, lng} = response.results[0].geometry.location;
        this.setState(
          {
            region: {
              latitude: lat,
              longitude: lng,
              latitudeDelta,
              longitudeDelta,
            },
          },
          () => {
            this.mapView.current.animateToRegion(
              {
                longitude: this.state.region.longitude,
                latitude: this.state.region.latitude,
                latitudeDelta: 0.4,
                longitudeDelta: 0.4,
              },
              1000,
            );
          },
        );
      },

      error => {
        console.error(error);
      },
    );
  }
  render() {
    const {
      region,
      loading,
      isPanding,
      text,
      openModal,
      locationcode,
      locationLng,
      locationLat,
    } = this.state;
    if (loading) {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <SafeAreaView style={{backgroundColor: Colors.orange}}>
          <StatusBar
            translucent
            barStyle={'light-content'}
            backgroundColor={Colors.orange}
          />
          <View style={{height: '100%', width: '100%'}}>
            <View
              style={{
                height: Dimensions.get('window').height * 0.3,

                top: StatusBar.currentHeight,
                left: 0,
                right: 0,

                position: 'absolute',
                zIndex: 1,
                padding: 10,
              }}>
              <GooglePlacesAutocomplete
                placeholder={locationcode ? locationcode :I18n.translate('search_places')}
                onPress={(data, details = null) => {
                  this.allmapdata(data);
                }}
                styles={{
                  textInputContainer: {
                      //backgroundColor: '#ccc',
                      //alignSelf: 'center',
                      //alignItems: 'flex-end',
                      //textAlign:'left',
                  },
                  textInput: {
                      marginLeft: 7,
                      marginRight: 20,
                      textAlign: this.props.language_id == 0? 'left':'right',
                      //backgroundColor: '#ccc',
                      height: 37,
                     // borderRadius: 10,
                     // color: '#000',
                      fontSize: 16,
                  },
                 

                
              }}
                query={{
                  key: 'AIzaSyBwum8vSJGI-HNtsPVSiK9THpmA2IbgDTg',
                  language: 'en',
                }}
              />
            </View>
            <View style={styles.container}>
              <View accessible={true} style={styles.mapWrapper}>
                <MapView
                  ref={this.mapView}
                  initialRegion={region}
                  style={styles.map}
                  showsUserLocation={true}
                  followUserLocation={true}
                  loadingEnabled={true}
                  onPanDrag={this.onPanDrag}
                  onRegionChangeComplete={this.onRegionChangeComplete}
                  showsScale={true}
                  showsCompass={true}
                  showsPointsOfInterest={true}
                  showsBuildings={true}
                  userLocationPriority={'high'}
                  showsMyLocationButton={true}
                />
              </View>

              <View
                style={[
                  styles.markerFixed,
                  isPanding ? styles.isPanding : null,
                ]}
                pointerEvents="none">
                <Image
                  style={styles.marker}
                  resizeMode="contain"
                  source={mapMarker}
                />
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#BF213E',
                width: '100%',
                height: 60,
                position: 'absolute',
                bottom: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: Colors.orange,
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={this.savelocation}>
                <Text
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 15,
                    margin: 1,
                  }}>
                  {' '}
                  SUBMIT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          </SafeAreaView>
      );
    }
  }
}
const mapStateToProps = (state)=>({
  language_id: state.data_Reducer.language_id

})


export default connect(mapStateToProps)(HomeLocator)
