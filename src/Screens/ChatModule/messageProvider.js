import { Alert,ToastAndroid ,Platform} from "react-native";
import Toast from 'react-native-simple-toast';
import config from '../../Constants/config';
import { localStorage } from './localStorageProvider';
//--------------------------- Message Provider Start -----------------------
class messageFunctionsProviders {
        toast(message,position){
			if(position=='center')
			{
				Toast.showWithGravity(message, Toast.SHORT, Toast.CENTER);
				
			}
			else if(position=='top')
			{
				Toast.showWithGravity(message, Toast.SHORT, Toast.TOP);
			}
			else if(position=='bottom')
			{
				Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM);
				
			}
			else if(position=='long')
			{
				Toast.showWithGravity(message, Toast.LONG, Toast.BOTTOM);
		    }
			
		}
	 
	alert(title, message, callback) {
		if(callback === false){
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.ok[0], 
					},
				],
				{cancelable: false},
			);
		}else{
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.ok[0], 
						onPress: () => callback,
					},
				],
				{cancelable: false},
			);
		}
		
    }

    confirm(title, message, callbackOk, callbackCancel) {
    	if(callbackCancel === false){
    		Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.cancel[0], 
					},
					{
						text: msgTitle.ok[0], 
						onPress: () =>  this.btnPageLoginCall(),
					},
				],
				{cancelable: false},
			);
    	}else{
    		Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.cancel[0], 
						onPress: () => callbackCancel,
					},
					{
						text: msgTitle.ok[0], 
						onPress: () => callbackOk,
					},
				],
				{cancelable: false},
			);
    	}
		
    }

    later(title, message, callbackOk, callbackCancel, callbackLater) {
		Alert.alert(
			title,
			message,
			[
				{
					text: 'Ask me later', 
					onPress: () => msgTitle.later[0],
				},
				{
					text: 'Cancel', 
					onPress: () => msgTitle.cancel[0],
				},
				{
					text: 'OK', 
					onPress: () => msgTitle.ok[0],
				},
			],
			{cancelable: false},
		);
	}
	loginFirst(props){
        // console.log('navigation',props)
        //  console.log('navigation',props.navigation)
        //   Alert.alert(
		// 	msgTitle.information[config.language],
		// 	msgTitle.account_deactivate_title[config.language],
        //     [
        //         {
        //             text: msgTitle.ok[config.language],
        //             onPress: () => { localStorage.removeItem('user_arr');
        //             localStorage.clear();
        //             props.navigation.navigate('LoginSocial')},
        //         },
        //     ],
        //     { cancelable: false },
        // );
 }

}
export const msgProvider = new messageFunctionsProviders();


//msgProvider.alert('Title', 'hello to all', false);
//msgProvider.alert('Title', 'hello to all', this.btnLoginCallTest());

//msgProvider.confirm('Title', 'hello to all confirm', this.btnConfirmLogin(), false);
//msgProvider.confirm('Title', 'hello to all confirm', this.btnConfirmLogin(), this.btnConfirmLoginCancel());

//msgProvider.later('Title', 'hello to all later', this.btnConfirmLogin());

// btnLoginCallTest = () => {
//   msgProvider.alert('Title', 'btnLoginCallTest call');
// }

// btnConfirmLogin = () => {
//   msgProvider.alert('Title', 'btnConfirmLogin call');
// }

// btnConfirmLoginCancel = () => {
//   msgProvider.alert('Title', 'btnConfirmLoginCancel call');
// }


//--------------------------- Message Provider End -----------------------



//--------------------------- Title Provider Start -----------------------

class messageTitleProvider {
	//----------------- message buttons
// mesage============
ok = ['Ok','حسنا ' ];
cancel = ['Cancel', 'الغاء '];
later = ['Later', 'لا حقا '];

//--------------- message title 
information = ['Information Message','رسالة معلومات ' ];
alert = ['Alert','تنبيه ' ];
confirm = ['Information Message','رسالة معلومات ' ];
validation = ['Information Message', 'رسالة معلومات '];
success = ['Information Message', 'رسالة معلومات '];
error = ['Information Message', 'رسالة معلومات '];
response = ['Response', 'استجابة '];
server=['Connection Error','خطأ في الاتصال '];
internet=['Connection Error','خطأ في الاتصال ']
deactivate_msg=['Account deactived','تم ايقاف الحساب ']
deactivate=[0,]
usernotexit=["User id does not exist",'اسم المستخدم غير موجود ']
account_deactivate_title=['your account deactivated please try again','تم ايقاف الحساب الرجاء المحاولة ']
}

export const msgTitle = new messageTitleProvider();

//--------------------------- Title Provider End -----------------------



//--------------------------- Message Provider Start -----------------------

class messageTextProvider {
	//--------------------- Validation messages ---------------

	//------------------ Login messages ---------------
	emptyEmail = ['Please enter email or phone', 'التحقق من صحة'];
	validEmail=['Please enter valid email']
	emptyPassword = ['Please enter password', 'التحقق من صحة'];
	lengthPassword=['Password length should be minimum 8 character'];
	emptynewPassword=['Please enter new password', 'التحقق من صحة'];
	emptyconfirmPassword=['Please enter new password', 'التحقق من صحة'];
	emptyconfirm=['please enter right password'];

	//-------------------- Registration messages ---------------
	emptyFirstName = ['Please enter first name', 'التحقق من صحة'];
	emptyLastName = ['Please enter last name', 'التحقق من صحة'];
	emptyPhone = ['Please enter phone number', 'التحقق من صحة'];

	//-------------------- Registration messages ---------------
	loginFirst = ['Please login first', 'التحقق من صحة'];
	emptyContactResion = ['Please select contact reason', 'التحقق من صحة'];
	emptyContactMessage = ['Please enter message', 'التحقق من صحة'];
    networkconnection=['Unable to connect. Please check that you are connected to the Internet and try again.','غير قادر على الاتصال. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'];
    servermessage=['An Unexpected error occured , Please try again .If the problem continues , Please do contact us','حدث خطأ غير متوقع ، يرجى المحاولة مرة أخرى. إذا استمرت المشكلة ، يرجى الاتصال بنا'];
	
}

export const msgText = new messageTextProvider();

//--------------------------- Message Provider End -----------------------