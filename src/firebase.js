import firebase from 'firebase/app'
import "firebase/auth"
import 'firebase/firestore'
import "firebase/database"
import "firebase/storage"

var firebaseConfig = {
    apiKey: "AIzaSyCc7fSccQuNPIQ_PFwpieMqPyv4LWM3JSk",
    authDomain: "slack-chat-app-a6d02.firebaseapp.com",
    databaseURL: "https://slack-chat-app-a6d02.firebaseio.com",
    projectId: "slack-chat-app-a6d02",
    storageBucket: "slack-chat-app-a6d02.appspot.com",
    messagingSenderId: "468586105020",
    appId: "1:468586105020:web:81edeb857c7f274e6c68b9"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase