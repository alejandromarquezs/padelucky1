// Inicializar Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCjpLyfV-wo9uM6K14N0q9DzsabKIIX4gA",
    authDomain: "padelucky-e80e6.firebaseapp.com",
    projectId: "padelucky-e80e6",
    storageBucket: "padelucky-e80e6.appspot.com",
    messagingSenderId: "87499387761",
    appId: "1:87499387761:web:e446eb19d6505e924afcd0",
    measurementId: "G-HZRERWE8TS"
};

firebase.initializeApp(firebaseConfig);

// Referencia a la base de datos
const db = firebase.database();
