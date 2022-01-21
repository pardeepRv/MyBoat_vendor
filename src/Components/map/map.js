import React, { Component } from 'react'
import { StatusBar, Text, View, Keyboard, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, SafeAreaView, PermissionsAndroid, Platform } from 'react-native'
// import { config } from './Provider/configProvider';
// import { localStorage } from './Provider/localStorageProvider';
// import { Lang_chg } from './Provider/Language_provider'
// import Loader from './Loader';
import config from '../../Constants/config';
// import color from './Colors';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import Geolocation from '@react-native-community/geolocation';
import Icon2 from 'react-native-vector-icons/Entypo'

export default class Map_show extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_id: 0,
            loading: false,
            isConnected: false,
            aboutus: '',
            latitude: 22.802353,
            longitude: 75.279556,
            latdelta: '0.0922',
            longdelta: '0.0421',
            addressbar2: '',
            addressselected: '',
            address_selected: '',
            input_search: 'mapaddress',
        }
    }

    componentDidMount() {
        // if (maplat != 'NA' && maplat != null && maplat != '') {
        //     this.setState({
        //         latitude: parseFloat(maplat),
        //         longitude: parseFloat(maplong),
        //         address_selected: 'mapaddress'
        //     })

        // } else {
        //     this.getlatlong();
        // }
    }
    // callLocation = async (that) => {
    //     localStorage.getItemObject('position').then((position) => {
    //         console.log('position', position)
    //         if (position != null) {
    //             var pointcheck1 = 0
    //             this.getalldata(position)
    //             Geolocation.getCurrentPosition(
    //                 //Will give you the current location
    //                 (position) => {
    //                     // localStorage.setItemObject('position', position)
    //                     pointcheck1 = 1
    //                 },
    //                 (error) => {
    //                     let position = { 'coords': { 'latitude': this.state.latitude, 'longitude': this.state.longitude } }

    //                     this.getalldata(position)
    //                 },
    //                 { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
    //             );
    //             that.watchID = Geolocation.watchPosition((position) => {
    //                 //Will give you the location on location change
    //                 console.log('data', position);

    //                 if (pointcheck1 != 1) {
    //                     // localStorage.setItemObject('position', position)
    //                     this.getalldata(position)
    //                 }

    //             });

    //         }
    //         else {
    //             console.log('helo gkjodi')
    //             var pointcheck = 0
    //             Geolocation.getCurrentPosition(
    //                 //Will give you the current location
    //                 (position) => {
    //                     // localStorage.setItemObject('position', position)
    //                     this.getalldata(position)
    //                     pointcheck = 1
    //                 },
    //                 (error) => {
    //                     let position = { 'coords': { 'latitude': this.state.latitude, 'longitude': this.state.longitude } }

    //                     this.getalldata(position)
    //                 },
    //                 { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
    //             );
    //             that.watchID = Geolocation.watchPosition((position) => {
    //                 //Will give you the location on location change
    //                 console.log('data', position);

    //                 if (pointcheck != 1) {
    //                     // localStorage.setItemObject('position', position)
    //                     this.getalldata(position)
    //                 }

    //             });
    //         }
    //     })
    // }

    getlatlong = async () => {
        let permission = 'given'
        if (permission != 'denied') {
            var that = this;
            //Checking for the permission just after component loaded
            if (Platform.OS === 'ios') {
                // this.callLocation(that);
            } else {
                // this.callLocation(that);
                async function requestLocationPermission() {
                    try {
                        const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                            'title': 'Location Access Required',
                            'message': 'This App needs to Access your location'
                        }
                        )
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            // that.callLocation(that);
                        } else {
                            let position = { 'coords': { 'latitude': that.state.latitude, 'longitude': that.state.longitude } }
                            // localStorage.setItemString('permission', 'denied')
                            that.getalldata(position)
                        }
                    } catch (err) { console.warn(err) }
                }
                requestLocationPermission();
            }
        } else {
            let position = { 'coords': { 'latitude': this.state.latitude, 'longitude': this.state.longitude } }
            this.getalldata(position)
        }
    }

    getalldata = (position) => {
        let longitude = position.coords.longitude
        let latitude = position.coords.latitude
        this.setState({ latitude: latitude, longitude: longitude })
    }

    backpress = () => {
        this.props.navigation.goBack();
    }


    getCoordinates = (region) => {
        return ({
            latitude: parseFloat(this.state.latitude),
            longitude: parseFloat(this.state.longitude),
            latitudeDelta: parseFloat(this.state.latdelta),
            longitudeDelta: parseFloat(this.state.longdelta),
        });
    }

    getadddressfromlatlong = (event) => {
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.latitude + ',' + event.longitude + '&key=' + 'AIzaSyBwum8vSJGI-HNtsPVSiK9THpmA2IbgDTg')
            .then((response) => response.json())
            .then((resp) => {
                // console.log('ADDRESS GEOCODE is BACK!! => ', resp);
                if (resp.results.length > 0) {
                    //  console.log('ADDRESS GEOCODE is BACK!! => ', resp.results[0]);
                    let responseJson = resp.results[0]
                    let city = 'unknown';
                    for (let i = 0; i < responseJson.address_components.length; i++) {
                        if (responseJson.address_components[i].types[0] == "locality") {
                            city = responseJson.address_components[i].long_name
                        }
                    }
                    //let details = responseJson
                    // let data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city }
                    // let data3 = { 'lat': details.geometry.location.lat, 'lon': details.geometry.location.lng, 'isp': details.formatted_address, 'city': city }
                    // localStorage.setItemObject('currenLatlong', data3)
                    // // mapaddress = data2
                    // console.log('city',city)
                    //this.GooglePlacesRef && this.GooglePlacesRef.setAddressText(details.formatted_address)
                    this.setState({ latdelta: event.latitudeDelta, longdelta: event.longitudeDelta, latitude: event.latitude, longitude: event.longitude, addressselected: details.formatted_address, address_selected: details.formatted_address })
                }
            })
    }

    _btnSubmitData = () => {

        mapaddress = this.state.address_selected;
        maplat = this.state.latitude;
        maplong = this.state.longitude;
        this.backpress();
    }

    render() {
        return (
            <View style={{ flex: 1, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: '#f0f0f0' }} />
                <View style={styles.terms_main_view}>
                    {/* <Loader loading={this.state.loading} /> */}
                    <MapView
                        followsUserLocation={true}
                        style={{ flex: 1 }}
                        region={
                            this.getCoordinates(this)
                        }
                        zoomEnabled={true}
                        provider={PROVIDER_GOOGLE}
                        minZoomLevel={2}
                        maxZoomLevel={15}
                        rotateEnabled={true}
                        pitchEnabled={true}
                        showsUserLocation={true}
                        userLocationPriority='high'
                        moveOnMarkerPress={true}
                        showsMyLocationButton={true}
                        showsScale={true}
                        showsCompass={true}
                        showsPointsOfInterest={true}
                        showsBuildings={true}
                        onMapReady={this.onMapReady}
                        onRegionChangeComplete={(event) => { this.getadddressfromlatlong(event) }}//
                        draggable
                        ref={this.setMapRef}
                    >

                        <Marker
                            coordinate={{
                                latitude: parseFloat(this.state.latitude),
                                longitude: parseFloat(this.state.longitude),
                                latitudeDelta: parseFloat(this.state.latdelta),
                                longitudeDelta: parseFloat(this.state.longdelta),
                            }}
                            isPreselected={true}
                        />
                    </MapView>


                    <View style={{ position: 'absolute', width: '100%', backgroundColor: '#ffffff' }}>

                        <View style={{ flex: 1 }}>
                            <View style={styles.notification_header}>
                                <TouchableOpacity activeOpacity={.7} style={styles.back_buttn_top} onPress={() => { this.backpress() }}>
                                    {/* <Image resizeMode="contain" style={styles.hole_top_l1} source={require('./icons/left_arrow.png')}></Image> */}
                                </TouchableOpacity>
                                {/* <Text style={[styles.Notifications_title, { fontWeight: config.font_weight, }]}>{Lang_chg.txt_select_address[config.language]}</Text> */}
                                <TouchableOpacity onPress={this._btnSubmitData}>
                                    <Text>Submit</Text>
                                </TouchableOpacity>
                            </View>
                            <GooglePlacesAutocomplete
                                
                                placeholder={'hii'}
                                minLength={1} // minimum length of text to search
                                autoFocus={false}
                                returnKeyType={'search'}
                                listViewDisplayed={this.state.addressbar2} // true/false/undefined
                                fetchDetails={true}
                                ref={(instance) => { this.GooglePlacesRef = instance }}
                                renderDescription={row => row.description} // custom description render
                                onPress={(data, details = null) => {

                                    this.setState({ addressbar: true, latitude: details.geometry.location.lat, longitude: details.geometry.location.lng, address_selected: details.formatted_address })
                                }}

                                query={{
                                    key: 'AIzaSyBwum8vSJGI-HNtsPVSiK9THpmA2IbgDTg',
                                    language: 'en', // language of the results

                                }}
                                styles={{
                                    textInputContainer: {
                                        backgroundColor: '#ccc',
                                        alignSelf: 'center',
                                        alignItems: 'flex-end',
                                    },
                                    textInput: {
                                        marginLeft: 7,
                                        marginRight: 20,
                                        //textAlign: 'right',
                                        backgroundColor: '#ccc',
                                        height: 37,
                                        borderRadius: 10,
                                        color: '#000',
                                        fontSize: 16,
                                    },

                                    description: {

                                    },
                                    container: {
                                        borderRadius: 10
                                    },
                                }}
                                currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                                // currentLocationLabel="Current location"
                                filterReverseGeocodingByTypes={[
                                    'locality',
                                    'administrative_area_level_3',
                                    'postal_code',
                                    'sublocality',
                                    'country'
                                ]}
                                renderLeftButton={() =>
                                    <Icon2 name='location' size={20} color='#d15400' style={{ alignSelf: 'center', marginLeft: 10 }} />}
                                renderRightButton={() => (
                                    <TouchableOpacity
                                        style={{ alignSelf: 'center', paddingLeft: 10 }}
                                    // onPress={() => {
                                    //     this.GooglePlacesRef.setAddressText("");
                                    //     this.setState({ addressselected: Lang_chg.txt_search[config.language], input_search: Lang_chg.txt_search_location[config.language] })
                                    // }}
                                    >
                                        <Icon2 name='circle-with-cross' size={25} color='#d15400' style={{ alignSelf: 'center', paddingRight: 5 }} />
                                    </TouchableOpacity>)}
                            />
                        </View>
                    </View>

                </View>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    terms_main_view: {
        backgroundColor: '#000',
        height: '100%',
        flex: 1,
    },
    notification_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: '#000',
        paddingTop: 15,
        paddingBottom: 15,

    },
    hole_top_l1: {
        width: 20,
        height: 20,
    },
    Notifications_title: {
        fontFamily: "Ubuntu-Regular",
        fontSize: 20,
        color: '#000',
    },
    back_buttn_top: {

        padding: 5
    },

})