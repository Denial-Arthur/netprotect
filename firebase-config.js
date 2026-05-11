// 1. Твои уникальные настройки Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD2FuRBxIFxNm9jDUoTolfNFIWLU8nVwAg",
  authDomain: "netprotect-web.firebaseapp.com",
  projectId: "netprotect-web",
  storageBucket: "netprotect-web.firebasestorage.app",
  messagingSenderId: "865774775037",
  appId: "1:865774775037:web:58d342e779b55079726c94"
};

// 2. Инициализация самого Firebase
firebase.initializeApp(firebaseConfig);

// 3. Подключение базы данных Firestore (Делаем глобальной!)
window.db = firebase.firestore();

// (Задел на будущее: подключение авторизации)
// window.auth = firebase.auth();
window.auth = firebase.auth();
window.googleProvider = new firebase.auth.GoogleAuthProvider();
