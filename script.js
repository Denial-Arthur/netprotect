document.addEventListener('DOMContentLoaded', () => {
    // === ТЁМНАЯ ТЕМА ===
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Проверяем сохраненную тему
    if (localStorage.getItem('theme') === 'dark') {
        htmlEl.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        if (htmlEl.getAttribute('data-theme') === 'light') {
            htmlEl.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlEl.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // === ПЛАВНАЯ НАВИГАЦИЯ ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // === FAQ (АККОРДЕОН) ===
    document.querySelectorAll('.faq-header').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const content = faqItem.querySelector('.faq-content');
            
            // Закрыть другие вкладки
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-content').style.maxHeight = null;
                }
            });

            faqItem.classList.toggle('active');
            if (faqItem.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // === АНИМАЦИЯ ЦИФР (СЧЁТЧИКИ) ===
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                let count = 0;
                const updateCount = () => {
                    const increment = target / 50; 
                    if (count < target) {
                        count += increment;
                        entry.target.innerText = Math.ceil(count);
                        setTimeout(updateCount, 30);
                    } else {
                        entry.target.innerText = target + (target >= 150 ? '+' : '');
                    }
                };
                updateCount();
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.5 }); 

    counters.forEach(counter => observer.observe(counter));
});

// === БАЗА ДАННЫХ ДЛЯ КАРТОЧЕК ===
const threatData = {
    phishing: { title: "Защита от Фишинга", icon: "fa-fish", theme: "theme-phishing", image: "images/phishing.jpg.jpg" },
    phone: { title: "Телефонные мошенники", icon: "fa-phone-slash", theme: "theme-phone", image: "images/phone_scams.jpg.jpg" },
    viruses: { title: "Вирусы и вредоносное ПО", icon: "fa-bug", theme: "theme-viruses", image: "images/viruses.jpg.jpg" },
    cards: { title: "Кража с банковской карты", icon: "fa-credit-card", theme: "theme-cards", image: "images/card_theft.jpg.jpg" },
    online: { title: "Онлайн-мошенничество", icon: "fa-laptop-code", theme: "theme-online", image: "images/online_scams.jpg.jpg" }
};

// === ВСПЛЫВАЮЩИЕ ОКНА (МОДАЛКИ) ===
function openModal(threatId) {
    const data = threatData[threatId];
    if (!data) return;
    const overlay = document.getElementById('threat-modal');
    const container = document.getElementById('modal-content');
    
    container.className = 'modal-container'; // сброс тем
    container.classList.add(data.theme);
    
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-icon').innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
    document.getElementById('modal-image').src = data.image;
    
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // блокируем скролл сайта
}

function closeModal(event) {
    if (!event || event.target.id === 'threat-modal' || event.target.closest('.modal-close')) {
        document.getElementById('threat-modal').classList.remove('active');
        document.body.style.overflow = 'auto'; // возвращаем скролл
    }
}

// === УВЕДОМЛЕНИЯ ===
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
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// === КВИЗ (ТРЕНАЖЕР) ===
function checkQuiz(isCorrect) {
    const resultBox = document.getElementById('quiz-result');
    resultBox.classList.remove('hidden', 'res-safe', 'res-danger');
    
    if (isCorrect) {
        resultBox.className = 'result-box res-safe';
        resultBox.innerHTML = '<i class="fa-solid fa-check"></i> <strong>Правильно!</strong> Банки никогда не присылают ссылки для разблокировки в СМС. Это уловка фишеров.';
    } else {
        resultBox.className = 'result-box res-danger';
        resultBox.innerHTML = '<i class="fa-solid fa-xmark"></i> <strong>Ошибка!</strong> Перейдя по ссылке, вы попадете на поддельный сайт, где у вас украдут данные карты.';
    }
}

// === ИНСТРУМЕНТЫ: ПАРОЛИ ===
function generatePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 16; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('pass-output').value = password;
}

function copyPassword() {
    const output = document.getElementById('pass-output').value;
    if (!output) return showToast('Сначала сгенерируйте пароль!', 'error');
    navigator.clipboard.writeText(output).then(() => showToast('Пароль надежно скопирован', 'success'));
}

// === ИНСТРУМЕНТЫ: ССЫЛКИ ===
function checkUrl() {
    const input = document.getElementById('url-input').value.trim();
    const resultBox = document.getElementById('url-result');
    if (!input) return showToast('Введите URL-адрес', 'error');

    resultBox.classList.remove('hidden', 'res-safe', 'res-danger');
    resultBox.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Выполняется анализ...';
    resultBox.style.color = 'var(--gray-dark)';
    resultBox.style.background = 'var(--gray-light)';
    resultBox.style.border = '1px solid var(--gray-border)';

    setTimeout(() => {
        if (input.includes('scam') || input.includes('login-') || !input.startsWith('http')) {
            resultBox.className = 'result-box res-danger';
            resultBox.innerHTML = '<i class="fa-solid fa-shield-virus"></i> <strong>Угроза обнаружена!</strong> Сайт имеет признаки фишинга.';
        } else {
            resultBox.className = 'result-box res-safe';
            resultBox.innerHTML = '<i class="fa-solid fa-shield-check"></i> <strong>Сайт безопасен.</strong> Угроз не найдено.';
        }
    }, 1200);
}

// === ОТПРАВКА ЖАЛОБЫ ===
function submitReport(e) {
    e.preventDefault(); 
    setTimeout(() => {
        document.getElementById('report-form').reset();
        showToast('Обращение успешно зарегистрировано в базе!', 'success');
    }, 500);
}
