// === ЛОКАЛЬНАЯ АВТОРИЗАЦИЯ (АВТОНОМНЫЙ РЕЖИМ ДЛЯ ДИПЛОМА) ===
console.log('🚀 Запущена локальная система авторизации (План Б)');

// Получаем текущего пользователя из памяти браузера при загрузке
let currentUser = JSON.parse(localStorage.getItem('mockUser'));

document.addEventListener('DOMContentLoaded', function() {
    updateUserInterface(currentUser);
});

// Обновление интерфейса
function updateUserInterface(user) {
    var authButtons = document.getElementById('auth-buttons');
    var userInfo = document.getElementById('user-info');
    var emailAuthRequired = document.getElementById('email-auth-required');
    var emailLinkBlock = document.getElementById('email-link-block');
    
    if (user) {
        if (authButtons) authButtons.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'block';
            var avatarUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=3182ce&color=fff';
            userInfo.innerHTML = 
                '<div class="user-avatar"><img src="' + avatarUrl + '" alt="Avatar"></div>' +
                '<div class="user-details">' +
                    '<p class="user-name">' + user.name + '</p>' +
                    '<p class="user-email">' + user.email + '</p>' +
                    '<button onclick="signOut()" class="btn-logout"><i class="fas fa-sign-out-alt"></i> Выйти</button>' +
                '</div>';
        }
        if (emailAuthRequired) emailAuthRequired.style.display = 'none';
        if (emailLinkBlock) emailLinkBlock.style.display = 'block';
    } else {
        if (authButtons) authButtons.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (emailAuthRequired) emailAuthRequired.style.display = 'block';
        if (emailLinkBlock) emailLinkBlock.style.display = 'none';
    }
}

// === РЕГИСТРАЦИЯ ===
function signUpWithEmail() {
    var email = document.getElementById('email-input').value;
    var password = document.getElementById('password-input').value;
    var name = document.getElementById('name-input').value;

    if (!email || !password || !name) {
        showNotification('Заполните все поля (Имя, Email, Пароль)', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Пароль должен быть не менее 6 символов', 'error');
        return;
    }

    // Сохраняем пользователя в "базу данных" браузера
    const newUser = { email: email, password: password, name: name };
    localStorage.setItem('mockUserDB', JSON.stringify(newUser)); // База
    localStorage.setItem('mockUser', JSON.stringify(newUser));   // Текущая сессия
    currentUser = newUser;

    document.getElementById('email-input').value = '';
    document.getElementById('password-input').value = '';
    document.getElementById('name-input').value = '';

    showNotification('Регистрация успешна!', 'success');
    updateUserInterface(currentUser);
}

// === ВХОД ===
function signInWithEmail() {
    var email = document.getElementById('email-input').value;
    var password = document.getElementById('password-input').value;

    if (!email || !password) {
        showNotification('Введите email и пароль', 'error');
        return;
    }

    // Ищем пользователя в "базе данных"
    const savedUser = JSON.parse(localStorage.getItem('mockUserDB'));

    if (savedUser && savedUser.email === email && savedUser.password === password) {
        localStorage.setItem('mockUser', JSON.stringify(savedUser));
        currentUser = savedUser;
        showNotification('Вы успешно вошли!', 'success');
        document.getElementById('email-input').value = '';
        document.getElementById('password-input').value = '';
        updateUserInterface(currentUser);
    } else {
        showNotification('Неверный email или пароль (или вы не зарегистрированы)', 'error');
    }
}

// === ВЫХОД ===
function signOut() {
    localStorage.removeItem('mockUser');
    currentUser = null;
    showNotification('Вы вышли из аккаунта', 'success');
    updateUserInterface(null);
}

// === ВХОД ПО ТЕЛЕФОНУ (Имитация) ===
function signInWithPhone() {
    var phone = document.getElementById('phone-number').value;
    if (!phone || phone.length < 10) {
        showNotification('Введите корректный номер', 'error');
        return;
    }
    document.getElementById('phone-verify-section').style.display = 'block';
    showNotification('SMS код: 123456 (для проверки)', 'info');
}

function verifyPhoneCode() {
    var code = document.getElementById('verification-code').value;
    if (code === '123456') {
        const phoneUser = { email: document.getElementById('phone-number').value, name: 'Пользователь (Телефон)' };
        localStorage.setItem('mockUser', JSON.stringify(phoneUser));
        currentUser = phoneUser;
        document.getElementById('phone-verify-section').style.display = 'none';
        showNotification('Успешный вход!', 'success');
        updateUserInterface(currentUser);
    } else {
        showNotification('Неверный код', 'error');
    }
}

// === ОТПРАВКА ЖАЛОБЫ ===
function submitAppeal() {
    var name = document.getElementById('appeal-name').value;
    var email = document.getElementById('appeal-email').value;
    var message = document.getElementById('appeal-message').value;

    if (!name || !email || !message) {
        showNotification('Заполните обязательные поля', 'error');
        return;
    }

    if (!currentUser) {
        showNotification('Пожалуйста, войдите в аккаунт для отправки обращения', 'error');
        scrollToElement('home');
        return;
    }

    // Имитация задержки отправки на сервер
    setTimeout(() => {
        showNotification('Ваше обращение успешно отправлено и добавлено в базу!', 'success');
        document.getElementById('appeal-form').reset();
    }, 800);
}

// === СИСТЕМА УВЕДОМЛЕНИЙ ===
function showNotification(message, type) {
    if (type === undefined) type = 'info';
    
    var notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    
    var iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    else if (type === 'error') iconClass = 'fa-exclamation-circle';
    
    notification.innerHTML = '<i class="fas ' + iconClass + '"></i><span>' + message + '</span>';
    document.body.appendChild(notification);
    
    setTimeout(function() { notification.classList.add('show'); }, 100);
    setTimeout(function() {
        notification.classList.remove('show');
        setTimeout(function() { notification.remove(); }, 300);
    }, 3000);
}

// Защита Email
document.addEventListener('DOMContentLoaded', function() {
    var emailLink = document.getElementById('protected-email-link');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            if (!currentUser) {
                e.preventDefault();
                showNotification('Пожалуйста, войдите в аккаунт чтобы написать нам', 'error');
                return false;
            }
        });
    }
});

window.signInWithEmail = signInWithEmail;
window.signUpWithEmail = signUpWithEmail;
window.signInWithPhone = signInWithPhone;
window.verifyPhoneCode = verifyPhoneCode;
window.signOut = signOut;
window.submitAppeal = submitAppeal;
