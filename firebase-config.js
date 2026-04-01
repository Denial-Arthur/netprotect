// Firebase конфигурация (НОВЫЙ ПРОЕКТ)
const firebaseConfig = {
    apiKey: "AIzaSyAzj5ovFUszQ3qCBAsLx5pzJYivL-9Nx0c",
    authDomain: "finsecurity-new.firebaseapp.com",
    projectId: "finsecurity-new",
    storageBucket: "finsecurity-new.firebasestorage.app",
    messagingSenderId: "770841345635",
    appId: "1:770841345635:web:26f4d2c6e8232af1ba4256"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

// Инициализация сервисов
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

console.log('✅ Firebase инициализирован');
console.log('🔑 API Key:', firebaseConfig.apiKey);
console.log('🌐 Auth Domain:', firebaseConfig.authDomain);
console.log('📦 Project ID:', firebaseConfig.projectId);
console.log('🔐 Защита активирована');
console.log('🌙 Тёмная тема готова');
console.log('🔐 Генератор паролей готов');
console.log('✅ Чек-лист безопасности готов');
console.log('🔍 Проверка ссылок готова');
console.log('📸 QR сканер готов');
console.log('📰 Лента новостей готова');
console.log('📚 Глоссарий готов');
console.log('📊 Калькулятор риска готов');
