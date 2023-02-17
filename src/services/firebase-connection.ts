
import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyChooRo0bLSXnudTYC6H-6qz7GisuD8yJ4",
    authDomain: "teste-recados.firebaseapp.com",
    projectId: "teste-recados",
    storageBucket: "teste-recados.appspot.com",
    messagingSenderId: "626850254052",
    appId: "1:626850254052:web:0edb48ed6447384546b0f1"
};


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;