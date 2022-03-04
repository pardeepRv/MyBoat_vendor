import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Image
} from 'react-native';
import {
    Icon,
    Input,
    Card,
    AirbnbRating
} from 'react-native-elements';
import Header from '../../Components/Header';
import { back_img3, boat_img1, Colors, FontFamily, Sizes } from '../../Constants/Constants';
import { useNavigation } from '@react-navigation/core';
import config from '../../Constants/config';
import I18n from "../../Translations/i18";


const DetailsRatings = ({ route }) => {
    const Navigator = useNavigation();
    const gotoBack = () => {
        Navigator.goBack();
    }

    // console.log(route.params.item.avg_rating)
    return (

        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <Header
                imgBack={true}
                backBtn={true} />
            <View style={[sb.SEC2,{height:400,flex:1}]}>
                <ScrollView style={{ marginTop: 20, paddingHorizontal: 20,}}>
                    {/*  */}
                    <Text style={{
                        fontSize: 12, fontFamily:
                            FontFamily.default, color: "#999", right: 3, alignSelf: 'flex-end'
                    }}>
                        {route.params.item.createtime}</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            {/* <Image style={{ height: 40, width: 40 }} 
                            source={{ uri: 'https://source.unsplash.com/1600x900/?face' 
                        }}
                            /> */}

                            {
                            route.params.item && route.params.item.user_image ?
                              <Image
                                style={{ height: 40, width: 40 }}
                                source={{
                                  uri: config.imageUrl + route.params.item.user_image
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

                            <Text style={{
                                width: Sizes.width - 100, marginLeft: 5,
                                fontFamily: FontFamily.semi_bold,
                            }}>{route.params.item.review}</Text>
                        </View>

                    </View>
                    {/*  */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                        <Text style={{ fontFamily: FontFamily.semi_bold, fontSize: 12 }}>
                            {I18n.translate('total_rating')}
                        </Text>
                        <AirbnbRating
                            showRating={false}
                            size={14}
                            count={5}
                            defaultRating={route.params.item.avg_rating}
                            isDisabled
                            selectedColor="#FFCC39"
                            starContainerStyle={{
                                elevation: 5,
                                // alignSelf:"flex-start"
                                marginLeft: 15
                            }} />
                    </View>
                    {/*  */}
                    <View style={sb.DIVIDER} />
                    {/*  */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontFamily: FontFamily.semi_bold, fontSize: 14 }}>{I18n.translate('rating')} :</Text>
                        <View style={{ marginVertical: 10 }}>
                            {/* Time */}
                            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 5, paddingHorizontal: 40 }}>
                                <Text style={{ fontSize: 13, fontFamily: FontFamily.semi_bold }}>
                                {I18n.translate('time')}
                                </Text>
                                <AirbnbRating
                                    showRating={false}
                                    size={15}
                                    count={5}
                                    defaultRating={4.5}
                                    isDisabled
                                    selectedColor="#FFCC39"
                                    starContainerStyle={{
                                        elevation: 5,
                                        // alignSelf:"flex-start"
                                        marginLeft: 15
                                    }} />
                            </View>
                            {/* Captain */}
                            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 5, paddingHorizontal: 40 }}>
                                <Text style={{ fontSize: 13, fontFamily: FontFamily.semi_bold }}>
                                {I18n.translate('captain')}
                                </Text>
                                <AirbnbRating
                                    showRating={false}
                                    size={15}
                                    count={5}
                                    defaultRating={4.5}
                                    isDisabled
                                    selectedColor="#FFCC39"
                                    starContainerStyle={{
                                        elevation: 5,
                                        // alignSelf:"flex-start"
                                        marginLeft: 15
                                    }} />
                            </View>
                            {/*Food */}
                            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 5, paddingHorizontal: 40 }}>
                                <Text style={{ fontSize: 13, fontFamily: FontFamily.semi_bold }}>
                                {I18n.translate('food')}
                                </Text>
                                <AirbnbRating
                                    showRating={false}
                                    size={15}
                                    count={5}
                                    defaultRating={4.5}
                                    isDisabled
                                    selectedColor="#FFCC39"
                                    starContainerStyle={{
                                        elevation: 5,
                                        // alignSelf:"flex-start"
                                        marginLeft: 15
                                    }} />
                            </View>
                            {/* Clean */}
                            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 5, paddingHorizontal: 40 }}>
                                <Text style={{ fontSize: 13, fontFamily: FontFamily.semi_bold }}>
                                {I18n.translate('clean')}
                                </Text>
                                <AirbnbRating
                                    showRating={false}
                                    size={15}
                                    count={5}
                                    defaultRating={4.5}
                                    isDisabled
                                    selectedColor="#FFCC39"
                                    starContainerStyle={{
                                        elevation: 5,
                                        // alignSelf:"flex-start"
                                        marginLeft: 15
                                    }} />
                            </View>
                            {/* Hospitality */}
                            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 5, paddingHorizontal: 40 }}>
                                <Text style={{ fontSize: 13, fontFamily: FontFamily.semi_bold }}>
                                   
                                    {I18n.translate('hospitality')}
                                </Text>
                                <AirbnbRating
                                    showRating={false}
                                    size={15}
                                    count={5}
                                    defaultRating={4.5}
                                    isDisabled
                                    selectedColor="#FFCC39"
                                    starContainerStyle={{
                                        elevation: 5,
                                        // alignSelf:"flex-start"
                                        marginLeft: 15
                                    }} />
                            </View>
                            {/* Equipment */}
                            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 5, paddingHorizontal: 40 }}>
                                <Text style={{ fontSize: 13, fontFamily: FontFamily.semi_bold }}>
                                    {/* Equipment */}
                                    {I18n.translate('equipment')}
                                </Text>
                                <AirbnbRating
                                    showRating={false}
                                    size={15}
                                    count={5}
                                    defaultRating={4.5}
                                    isDisabled
                                    selectedColor="#FFCC39"
                                    starContainerStyle={{
                                        elevation: 5,
                                        // alignSelf:"flex-start"
                                        marginLeft: 15
                                    }} />
                            </View>
                            {/* Entertainment */}
                            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 5, paddingHorizontal: 40 }}>
                                <Text style={{ fontSize: 13, fontFamily: FontFamily.semi_bold }}>
                                    {/* Entertainment */}
                                    {I18n.translate('entertainment')}
                                </Text>
                                <AirbnbRating
                                    showRating={false}
                                    size={15}
                                    count={5}
                                    defaultRating={4.5}
                                    isDisabled
                                    selectedColor="#FFCC39"
                                    starContainerStyle={{
                                        elevation: 5,
                                        // alignSelf:"flex-start"
                                        marginLeft: 15
                                    }} />
                            </View>
                            {/*  */}
                        </View>
                    </View>
                    {/*  */}
                    <View style={sb.DIVIDER} />
                    {/*  */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontFamily: FontFamily.semi_bold, fontSize: 14 }}>{I18n.translate('comment')} :</Text>
                        <View style={{ paddingHorizontal: 20, marginTop: 6 }}>
                            <Text style={{ fontFamily: FontFamily.default, fontSize: 10, lineHeight: 16, color: "#999" }}>
                                Lorem Ipsum is simply dummy text of the printing. Lorem Ipsum is
                                simply dummy text of the printing. Lorem Ipsum is simply dummy
                                text of the printing.{"\n"}
                            </Text>
                        </View>
                        {/*  */}
                        {/* btn */}

                    </View>

                </ScrollView>
                <Card containerStyle={[{ bottom: 20 ,}, sb.Btn1]}>
                    <TouchableOpacity onPress={() => gotoBack()}>
                        <View>
                            <Text style={{
                                fontSize: 20, fontFamily: FontFamily.semi_bold,
                                color: Colors.orange
                            }}> {I18n.translate('go_back')} </Text>
                        </View>
                    </TouchableOpacity>
                </Card>
                
            </View>
        </View>
    )
}
const sb = StyleSheet.create({
    SEC2: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 30,
        borderTopEndRadius: 30,
        marginTop: -40,
        flex: 1
    },
    DIVIDER: {
        borderWidth: 0.5,
        borderColor: "rgba(0, 0, 0, 0.5)"
    },
    Btn1: {
        height: 48,
        width: "95%",
        backgroundColor: Colors.white,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        elevation: 5,
        alignSelf: "center",
        padding: 0
    },
})
export default DetailsRatings;