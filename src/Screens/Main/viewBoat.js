import React from "react"
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    ActivityIndicator,
    StatusBar,
    Dimensions,
    TouchableOpacity,
    I18nManager
} from "react-native"
import I18n from '../../Translations/i18'
import { ScrollView } from "react-native-gesture-handler";
import Header from '../../Components/Header';
import { FontFamily } from "../../Constants/Constants";
import { connect } from "react-redux";

class viewBoat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.route.params.item
        };
    }

    render() {
        console.log('details', this.state.item)
        const { item } = this.state
        return (
            <View style={{flex:1}}>
                <StatusBar barStyle="light-content" backgroundColor={"transparent"} translucent/>
                <Header isarbic={this.props.language_id == 1 ? 1 : 0} imgBack={true} backBtn={true} name={I18n.translate('details')} headerHeight={Dimensions.get('window').height * 0.2} />
                <ScrollView style={{ paddingTop: 20,borderTopRightRadius: 25,marginTop: -25,backgroundColor:'#fff', borderTopLeftRadius:25 }} >
                    <View style={styles.card} >
                        <Text style={styles.hText} >{I18n.translate('boat_name')} :</Text>
                        <Text style={styles.sText}>{item.name}</Text>
                    </View>
                    <View style={styles.card} >
                        <Text style={styles.hText} >{I18n.translate('boat_brand')}  :</Text>
                        <Text style={styles.sText}>{item.brand}</Text>
                    </View>
                    <View style={styles.card} >
                        <Text style={styles.hText} >{I18n.translate('boat_num')} :</Text>
                        <Text style={styles.sText}>{item.boat_number}</Text>
                    </View>
                    <View style={styles.card} >
                        <Text style={styles.hText} > {I18n.translate('registration_num')}:</Text>
                        <Text style={styles.sText}>{item.registration_no}</Text>
                    </View>
                    <View style={styles.card} >
                        <Text style={styles.hText} >{I18n.translate('manufacture_year')} :</Text>
                        <Text style={styles.sText}>{item.manufacturing_year}</Text>
                    </View>
                    <View style={styles.card} >
                        <Text style={styles.hText} >{I18n.translate('boat_size')} :</Text>
                        <Text style={styles.sText}>{`${item.boat_length} ft.`}</Text>
                    </View>
                    <View style={styles.card} >
                        <Text style={styles.hText} >{I18n.translate('cabin')} :</Text>
                        <Text style={styles.sText}>{item.cabins}</Text>
                    </View>
                    <View style={styles.card} >
                        <Text style={styles.hText} >{I18n.translate('boat_cap')} :</Text>
                        <Text style={styles.sText}>{item.boat_capacity}</Text>
                    </View>
                    <View style={styles.card} >
                        <Text style={styles.hText} >{I18n.translate('toilet')} :</Text>
                        <Text style={styles.sText}>{item.toilets}</Text>
                    </View>

                </ScrollView>
            </View>
        )
    };
}
const mapStateToProps = (state) => ({
    language_id: state.data_Reducer.language_id,
    permissions: state.data_Reducer.permissions,
  });
  
  export default connect(mapStateToProps)(viewBoat);


const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        elevation: 2,
        borderRadius: 5,
        marginVertical: 5,
        backgroundColor: '#fff'
    },
    hText: {
        fontFamily:FontFamily.default,
        fontSize: 15
    },
    sText: {
        fontFamily:FontFamily.semi_bold,
        //fontWeight: 'bold',
        marginRight: 10
    }
});