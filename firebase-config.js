// 1. Данные твоего приложения (строго из твоего скриншота)
const firebaseConfig = {
  apiKey: "AIzaSyD2FUrBxIFxNm9jDUoTolfNfIWLU8nVwAg",
  authDomain: "netprotect-web.firebaseapp.com",
  projectId: "netprotect-web",
  storageBucket: "netprotect-web.firebasestorage.app",
  messagingSenderId: "865774775037",
  appId: "1:865774775037:web:58d342e779b55079726c94"
};

// 2. Инициализация через глобальный объект window
firebase.initializeApp(firebaseConfig);

window.db = firebase.firestore();
window.auth = firebase.auth();
window.googleProvider = new firebase.auth.GoogleAuthProvider();
