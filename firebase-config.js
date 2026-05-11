const firebaseConfig = {
    apiKey: "AIzaSyCmk5NdffI5vp5dOyQM3kDGAkEt7byeBGA",
    authDomain: "netprotect-final.firebaseapp.com",
    projectId: "netprotect-final",
    storageBucket: "netprotect-final.firebasestorage.app",
    messagingSenderId: "1058990579218",
    appId: "1:1058990579218:web:007b5d39dd101fbeeb82cb"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log('✅ Firebase подключен. База данных готова к приему жалоб.');
