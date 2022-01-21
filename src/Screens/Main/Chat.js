import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Image,
    I18nManager,
    TextInput
} from 'react-native';
import {
    Icon,
    Input,
    Card
} from 'react-native-elements';
import {Colors, FontFamily, Sizes } from '../../Constants/Constants';
import { useNavigation } from '@react-navigation/core';
import PersonalChat from '../../Data/PersonalChat';

const CustomHeader=({avatarImg,name,status})=>{
    const navigation =useNavigation();
    const gotoBack=()=>{
        navigation.goBack()
    }
    return(
        <View style={{height:200,backgroundColor:Colors.orange}}>
            <View style={{flexDirection:"row",justifyContent:"space-between",width:"90%",marginTop:30,alignSelf:"center",backgroundColor:"transparent",alignItems:"center"}}>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <TouchableOpacity onPress={()=>gotoBack()}>
                        <Icon name="arrow-back" type="ionicons" size={30} color={Colors.white} />
                    </TouchableOpacity>
                    <View style={{flexDirection:"row",marginLeft:10}}>
                        <Image
                         style={{height:50,width:50,borderRadius:13}}
                         source={{uri:avatarImg}} />
                         <View style={{marginLeft:5}}>
                             <Text style={{fontFamily:FontFamily.semi_bold,fontSize:16,color:Colors.white}}>
                                 {name}
                             </Text>
                             <Text style={{fontSize:12,fontFamily:FontFamily.default,color:Colors.white}}>
                                 {status}
                             </Text>
                         </View>
                    </View>
                </View>
                <TouchableOpacity>
                    <Icon name="dots-three-vertical" type="entypo" size={25} color={Colors.white} />
                </TouchableOpacity>
                </View>
        </View>
    )
}

const Chats=({route})=>{
    const [PriScrData,setPriScrData]=useState(route.params.item);
    console.log(PriScrData.avtar)
    return(
        <View style={{flex:1,backgroundColor:Colors.white}}>
            <CustomHeader 
             avatarImg={PriScrData.avtar}
             name={PriScrData.name}
             status={PriScrData.status}
             />
             <View style={sb.SEC2}>
               <View style={{marginTop:30,padding:10}}>
                   {/* IN MASSAGE */}
                   <View style={{flexDirection:"row",alignSelf:"flex-start",marginVertical:7}}>
                   <Image style={{height:30,width:30,borderRadius:7}} source={{uri:PriScrData.avtar}} />
                   <View style={{width:"85%",marginLeft:7,backgroundColor:"rgba(0, 0, 0, 0.04)",padding:20,borderRadius:12}}>
                       <Text style={{fontFamily:FontFamily.default,fontSize:12}}>
                            Really love your most recent photo. I’ve been trying to capture the same thing for a few months and would love some tips!
                       </Text>
                   </View>
                   </View>
                   {/* OUT MASSAGE */}
                   <View style={{flexDirection:"row",alignSelf:"flex-end"}}>
                   {/* <Image style={{height:30,width:30,borderRadius:7}} source={{uri:PriScrData.avtar}} /> */}
                   <View style={{width:"85%",marginLeft:7,backgroundColor:"rgba(254, 225, 206, 0.45)",padding:20,borderRadius:12}}>
                       <Text style={{fontFamily:FontFamily.default,fontSize:12}}>
                       A fast 50mm like f1.8 would help with the bokeh. I’ve been using primes as they tend to get a bit sharper images.
                       </Text>
                   </View>
                   </View>
                   {/*  */}
                   <View style={{flexDirection:"row",alignSelf:"flex-start",marginVertical:7}}>
                   <Image style={{height:30,width:30,borderRadius:7}} source={{uri:PriScrData.avtar}} />
                   <View style={{width:"85%",marginLeft:7,backgroundColor:"rgba(0, 0, 0, 0.04)",padding:20,borderRadius:12}}>
                       <Text style={{fontFamily:FontFamily.default,fontSize:12}}>
                       Thank you! That was very helpful!
                       </Text>
                   </View>
                   </View>
               </View>
               {/*  */}
               <View style={{
                   flexDirection:"row",
                   alignItems:"center",
                   width:"100%",
                   justifyContent:"space-around",
                   height:50,
                   position:"absolute",
                   alignSelf:"center",
                   bottom:0,
                   backgroundColor:"#fff",
                //    elevation:5
                borderTopWidth:1,
                borderColor:"#999"
                   }}>
                   <TouchableOpacity style={{
                       height:26,
                       width:26,
                       backgroundColor:Colors.white,
                       elevation:5,
                       alignItems:"center",
                       justifyContent:"center"
                       }}>
                       <Icon name="plus" type="antdesign" size={20} />
                   </TouchableOpacity>
                   <TextInput
                    style={{width:"70%"}}
                    multiline
                    placeholder="Text type here ..."
                    />
                   <View style={{borderWidth:0.5,width:1,height:"100%",alignSelf:"center"}} />
                   <View style={{}}>
                       <Icon name="send" color="#999" />
                   </View>
               </View>
             </View>
        </View>
    )
}

const sb=StyleSheet.create({
    SEC2:{
        backgroundColor:Colors.white,
        marginTop:-110,
        borderTopLeftRadius:30,
        borderTopEndRadius:30,
        flex:1
    },
    
})
const styles = StyleSheet.create({
    container:{
      flex:1
    },
    list:{
      paddingHorizontal: 17,
    },
    footer:{
      flexDirection: 'row',
      height:60,
      backgroundColor: '#eeeeee',
      paddingHorizontal:10,
      padding:5,
    },
    btnSend:{
      backgroundColor:"#00BFFF",
      width:40,
      height:40,
      borderRadius:360,
      alignItems:'center',
      justifyContent:'center',
    },
    iconSend:{
      width:30,
      height:30,
      alignSelf:'center',
    },
    inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      height:40,
      flexDirection: 'row',
      alignItems:'center',
      flex:1,
      marginRight:10,
    },
    inputs:{
      height:40,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
    },
    balloon: {
      maxWidth: 250,
      padding: 15,
      borderRadius: 20,
    },
    itemIn: {
      alignSelf: 'flex-start'
    },
    itemOut: {
      alignSelf: 'flex-end'
    },
    time: {
      alignSelf: 'flex-end',
      margin: 15,
      fontSize:12,
      color:"#808080",
    },
    item: {
      marginVertical: 14,
      flex: 1,
      flexDirection: 'row',
      backgroundColor:"#eeeeee",
      borderRadius:300,
      padding:5,
    },
  });
export default Chats;