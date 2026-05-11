// === БАЗА ДАННЫХ ДЛЯ КАРТОЧЕК УГРОЗ ===
const threatData = {
    phishing: {
        title: "Защита от Фишинга",
        icon: "fa-fish",
        theme: "theme-phishing",
        image: "images/phishing.jpg.jpg"
    },
    phone: {
        title: "Телефонные мошенники",
        icon: "fa-phone-slash",
        theme: "theme-phone",
        image: "images/phone_scams.jpg.jpg"
    },
    viruses: {
        title: "Вирусы и вредоносное ПО",
        icon: "fa-bug",
        theme: "theme-viruses",
        image: "images/viruses.jpg.jpg"
    },
    cards: {
        title: "Кража с банковской карты",
        icon: "fa-credit-card",
        theme: "theme-cards",
        image: "images/card_theft.jpg.jpg"
    },
    online: {
        title: "Онлайн-мошенничество",
        icon: "fa-laptop-code",
        theme: "theme-online",
        image: "images/online_scams.jpg.jpg"
    }
};

// === ЛОГИКА ВСПЛЫВАЮЩИХ ОКОН (МОДАЛОК) ===
function openModal(threatId) {
    const data = threatData[threatId];
    if (!data) return;

    const overlay = document.getElementById('threat-modal');
    const container = document.getElementById('modal-content');
    
    // Очищаем старые цветовые темы
    container.className = 'modal-container';
    
    // Заполняем окно правильными данными и цветом
    container.classList.add(data.theme);
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-icon').innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
    
    // Подгружаем картинку
    document.getElementById('modal-image').src = data.image;

    // Показываем окно
    overlay.classList.add('active');
    
    // Блокируем скролл основной страницы, чтобы пользователь скроллил только картинку
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    // Закрываем, если кликнули на крестик ИЛИ на темный фон вокруг картинки
    if (!event || event.target.id === 'threat-modal' || event.target.closest('.modal-close')) {
        document.getElementById('threat-modal').classList.remove('active');
        document.body.style.overflow = 'auto'; // Возвращаем скролл сайту
    }
}

// === ПЛАВНАЯ НАВИГАЦИЯ ДЛЯ МЕНЮ ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// === СИСТЕМА УВЕДОМЛЕНИЙ (TOASTS) ===
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-exclamation"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// === ИНСТРУМЕНТЫ: ГЕНЕРАТОР ПАРОЛЕЙ ===
function generatePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 16; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('pass-output').value = password;
}

function copyPassword() {
    const output = document.getElementById('pass-output').value;
    if (!output) {
        showToast('Сначала сгенерируйте пароль!', 'error');
        return;
    }
    navigator.clipboard.writeText(output).then(() => {
        showToast('Пароль надежно скопирован', 'success');
    });
}

// === ИНСТРУМЕНТЫ: АНАЛИЗАТОР ССЫЛОК ===
function checkUrl() {
    const input = document.getElementById('url-input').value.trim();
    const resultBox = document.getElementById('url-result');
    
    if (!input) {
        showToast('Пожалуйста, введите URL-адрес', 'error');
        return;
    }

    resultBox.classList.remove('hidden', 'res-safe', 'res-danger');
    resultBox.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Выполняется анализ...';
    resultBox.style.color = 'var(--gray-dark)';
    resultBox.style.background = 'var(--gray-light)';
    resultBox.style.border = '1px solid var(--gray-border)';

    // Имитация сканирования
    setTimeout(() => {
        const isPhishing = input.includes('scam') || input.includes('login-') || !input.startsWith('http');
        
        if (isPhishing) {
            resultBox.className = 'result-box res-danger';
            resultBox.innerHTML = '<i class="fa-solid fa-shield-virus"></i> <strong>Угроза обнаружена!</strong> Сайт имеет признаки фишинга.';
            showToast('Обнаружена угроза', 'error');
        } else {
            resultBox.className = 'result-box res-safe';
            resultBox.innerHTML = '<i class="fa-solid fa-shield-check"></i> <strong>Сайт безопасен.</strong> Угроз в базах не обнаружено.';
            showToast('Проверка успешно завершена', 'success');
        }
    }, 1200);
}

// === ОТПРАВКА ЖАЛОБЫ ===
function submitReport(e) {
    e.preventDefault(); 
    
    setTimeout(() => {
        document.getElementById('report-form').reset();
        showToast('Обращение успешно зарегистрировано в базе NetProtect!', 'success');
    }, 500);
}
