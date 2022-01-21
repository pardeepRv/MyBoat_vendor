import React, { useState } from 'react';
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
            <View style={sb.SEC2}>
                <ScrollView style={{ marginTop: 20, paddingHorizontal: 20 }}>
                    {/*  */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Image style={{ height: 40, width: 40 }} source={{ uri: 'https://source.unsplash.com/1600x900/?face' }} />
                            <Text style={{ marginLeft: 5, fontFamily: FontFamily.semi_bold, fontSize: 16 }}>{route.params.item.review}</Text>
                        </View>
                        <Text style={{ fontSize: 10, fontFamily: FontFamily.default, color: "#999" }}>10:30 PM</Text>
                    </View>
                    {/*  */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                        <Text style={{ fontFamily: FontFamily.semi_bold, fontSize: 12 }}>
                            Total Ratings
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
                        <Text style={{ fontFamily: FontFamily.semi_bold, fontSize: 14 }}>Rating :</Text>
                        <View style={{ marginVertical: 10 }}>
                            {/* Time */}
                            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 5, paddingHorizontal: 40 }}>
                                <Text style={{ fontSize: 13, fontFamily: FontFamily.semi_bold }}>
                                    Time
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
                                    Captain
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
                                    Food
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
                                    Clean
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
                                    Hospitality
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
                                    Equipment
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
                                    Entertainment
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
                        <Text style={{ fontFamily: FontFamily.semi_bold, fontSize: 14 }}>Comment :</Text>
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
                <Card containerStyle={[{ position: "absolute", bottom: 10 }, sb.Btn1]}>
                    <TouchableOpacity onPress={() => gotoBack()}>
                        <View>
                            <Text style={{ fontSize: 20, fontFamily: FontFamily.semi_bold, color: Colors.orange }}>Go Back</Text>
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