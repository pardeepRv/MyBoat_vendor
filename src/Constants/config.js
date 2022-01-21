import {useState} from 'react';
import {Platform} from 'react-native';
/** New Parameters = 
 * email, 
 * login_type (0 for App, 1 for Facebook, 2 for Google, 3 for twitter, 4 for Instagram, 5 for apple), 
 * user_type_post (0=admin, 1=user, 2=Client), 
 * device_type (browser, Android, IOS), 
 * f_name , 
 * l_name, 
 * user_name, 
 * business_name , 
 * dob, 
 * city ( check city_master table for codes for each city), 
 * language_id (0=English, 1=Arabic), 
 * country_code (for mobile number), 
 * phone_number, 
 * password, 
 * gender (0 for none, 1 for male, 2 for female), 
 * player_id

**/
// const [lan,setlan]=useState("English")
let config = {
  apiUrl: 'https://freshandfine.xyz/app/webservice',
  imageUrl: 'https://freshandfine.xyz/app/webservice/images/',
  device_type: Platform.OS,
  login_type: 0, //login_type (0 for App, 1 for Facebook, 2 for Google, 3 for twitter, 4 for Instagram, 5 for apple)
  player_id: 123456,
  language_id: 0,
  country_code: 965,
  user_type_post: 2,
  onesignalappid : 'c4baf33f-e0bf-410c-8fd4-894b0ca2aa1a'
}
export default config ;
