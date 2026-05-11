// Firebase конфигурация (НОВЫЙ ПРОЕКТ netprotect-final)
const firebaseConfig = {
    apiKey: "AIzaSyCmk5NdffI5vp5dOyQM3kDGAkEt7byeBGA",
    authDomain: "netprotect-final.firebaseapp.com",
    projectId: "netprotect-final",
    storageBucket: "netprotect-final.firebasestorage.app",
    messagingSenderId: "1058990579218",
    appId: "1:1058990579218:web:007b5d39dd101fbeeb82cb"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

// Инициализация сервисов
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

console.log('✅ Firebase инициализирован (НОВЫЕ КЛЮЧИ!)');
console.log('🔑 API Key:', firebaseConfig.apiKey);
