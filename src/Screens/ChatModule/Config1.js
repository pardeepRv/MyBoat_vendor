import Firebase from 'firebase';
let config = {
    apiKey: "AIzaSyBwum8vSJGI-HNtsPVSiK9THpmA2IbgDTg",
    authDomain: "myboat-54b2a.firebaseapp.com",
    databaseURL: "https://myboat-54b2a-default-rtdb.firebaseio.com",
    projectId: "myboat-54b2a",
    storageBucket: "myboat-54b2a.appspot.com",
    messagingSenderId: "1076734868236",
    appId: "1:1076734868236:web:6a7bfcac34d92c9c406729"
    };
let firebase = Firebase.initializeApp(config);
export default firebase