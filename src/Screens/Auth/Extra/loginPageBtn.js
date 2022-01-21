<View style={styles.SEC3}>
                         <View style={{alignItems:"center"}}>
                             <TouchableOpacity style={styles.Btn1} onPress={()=>nav.navigate("Home")}>
                                 <Text style={styles.Btn1Text}>
                                     Login
                                 </Text>
                             </TouchableOpacity>
                             <TouchableOpacity style={styles.Btn1} onPress={()=>nav.navigate("AddBoat")}>
                                 <Text style={styles.Btn1Text} >
                                     Guest
                                 </Text>
                             </TouchableOpacity>
                             <TouchableOpacity style={{marginTop:25}}>
                                 <Text style={styles.contact_admin}>
                                     Contact admin ?
                                 </Text>
                             </TouchableOpacity>
                         </View>
                         <View style={{height:80,borderWidth:1,borderColor:Colors.white,marginTop:-50,marginHorizontal:20}} />
                         <View style={{alignItems:"center",marginHorizontal:20}}>
                             <TouchableOpacity onPress={()=>nav.navigate("SignUp")}>
                                 <Text style={styles.Text1}>Sign Up ?</Text>
                             </TouchableOpacity>
                             <View style={styles.OR}>
                                 <Text style={{fontFamily:FontFamily.bold,color:Colors.orange,fontSize:10}}>OR</Text>
                             </View>
                             <View>
                                 <Text style={styles.Text1}>Sign up with</Text>
                                 <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:24}}>
                                     <TouchableOpacity style={styles.LoginIcon}>
                                         <Icon name="apple" type="fontisto" size={20}  color={Colors.white} />
                                     </TouchableOpacity>
                                     <TouchableOpacity style={styles.LoginIcon}>
                                        <Icon name="google" type="antdesign" size={20} color={Colors.white} />
                                     </TouchableOpacity>
                                 </View>
                             </View>
                         </View>
                     </View>