// === КОНФИГУРАЦИЯ ===
const CONFIG = {
    infographics: {
        phishing: 'images/phishing.jpg.jpg',
        online: 'images/online_scams.jpg.jpg',
        phone: 'images/phone_scams.jpg.jpg',
        viruses: 'images/viruses.jpg.jpg',
        cards: 'images/card_theft.jpg.jpg'
    },
    glossaryTerms: [
        { term: "Фишинг", definition: "Мошенничество с целью получения доступа к личным данным через поддельные сайты" },
        { term: "CVV/CVC", definition: "Трёхзначный код безопасности на обратной стороне банковской карты" },
        { term: "2FA", definition: "Двухфакторная аутентификация — дополнительный уровень защиты аккаунта" },
        { term: "Малварь", definition: "Вредоносное программное обеспечение (вирусы, трояны, шпионские программы)" },
        { term: "Социальная инженерия", definition: "Метод манипуляции людьми для получения конфиденциальной информации" },
        { term: "Скимминг", definition: "Способ кражи данных банковской карты с помощью специальных устройств" },
        { term: "Троян", definition: "Вредоносная программа, маскирующаяся под легитимное ПО" },
        { term: "Ботнет", definition: "Сеть заражённых компьютеров, управляемая злоумышленником" },
        { term: "Спам", definition: "Массовая рассылка нежелательных сообщений" },
        { term: "Брандмауэр", definition: "Система защиты сети от несанкционированного доступа" }
    ]
};

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация тёмной темы
    initTheme();

    // Инициализация навигации
    initNavigation();

    // Загрузка инфографики
    loadInfographics();

    // Обновление статистики
    updateStats();

    // Загрузка глоссария
    loadGlossary();

    console.log('✅ script.js загружен');
    console.log('🌙 Тёмная тема активирована');
    console.log('🔐 Все функции безопасности активированы');
});

// === ТЁМНАЯ ТЕМА ===
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    // Проверяем сохранённую тему или системную
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Обработчик переключения
    themeToggle?.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Анимация иконки
        if (themeIcon) {
            themeIcon.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                themeIcon.style.transform = 'rotate(0deg)';
            }, 300);
        }
        
        console.log('🌙 Тема переключена на:', newTheme);
    });
}

// === НАВИГАЦИЯ ===
function initNavigation() {
    // Обработка кликов по основной навигации
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var pageId = this.dataset.page;
            showPage(pageId);
        });
    });

    // Обработка кликов по боковой навигации
    document.querySelectorAll('.sidebar-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var pageId = this.dataset.page;
            showPage(pageId);
        });
    });

    // Обработка кликов по карточкам
    document.querySelectorAll('.card').forEach(function(card) {
        card.addEventListener('click', function() {
            var pageId = this.dataset.page;
            showPage(pageId);
        });
    });

    // Обработка hash в URL при загрузке
    var hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showPage(hash);
    }

    // Обработка кнопок назад/вперёд в браузере
    window.addEventListener('popstate', function() {
        var hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            showPage(hash);
        } else {
            showPage('home');
        }
    });
}

function showPage(pageId) {
    // Скрыть все секции
    document.querySelectorAll('.article-section').forEach(function(section) {
        section.classList.remove('active');
    });

    // Показать нужную
    var targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Обновить активные ссылки
    document.querySelectorAll('.nav-link, .sidebar-link').forEach(function(link) {
        link.classList.remove('active');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });

    // Прокрутка вверх
    window.scrollTo(0, 0);

    // Обновить URL
    history.pushState(null, null, '#' + pageId);

    console.log('📄 Переход на страницу:', pageId);
}

// === ЗАГРУЗКА ИНФОГРАФИКИ ===
function loadInfographics() {
    console.log('🖼️ Загрузка инфографики...');
    
    for (var key in CONFIG.infographics) {
        if (CONFIG.infographics.hasOwnProperty(key)) {
            var path = CONFIG.infographics[key];
            var img = document.getElementById(key + '-image');
            
            if (img) {
                // Получаем URL из Firebase Storage
                if (typeof storage !== 'undefined') {
                    storage.ref(path).getDownloadURL()
                        .then(function(url) {
                            img.src = url;
                            img.onload = function() {
                                img.classList.add('loaded');
                            };
                        })
                        .catch(function(error) {
                            console.error('Ошибка загрузки изображения:', error);
                        });
                }
            }
        }
    }
}

// === СТАТИСТИКА ===
function updateStats() {
    var statSections = document.getElementById('stat-sections');
    var statInfographics = document.getElementById('stat-infographics');
    
    if (statSections) statSections.textContent = '7';
    if (statInfographics) statInfographics.textContent = '5';
    
    console.log('📊 Статистика обновлена');
}

// === ГЕНЕРАТОР ПАРОЛЕЙ ===
function generatePassword() {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    document.getElementById('generated-password').textContent = password;
    checkPasswordStrength(password);
}

function copyPassword() {
    const password = document.getElementById('generated-password').textContent;
    if (password === 'Нажмите "Сгенерировать"') {
        showNotification('Сначала сгенерируйте пароль!', 'error');
        return;
    }
    navigator.clipboard.writeText(password);
    showNotification('Пароль скопирован!', 'success');
}

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const strengthText = ['Слабый', 'Средний', 'Хороший', 'Отличный'][strength];
    const strengthColor = ['#fc8181', '#f6ad55', '#68d391', '#48bb78'][strength];
    
    document.getElementById('password-strength').innerHTML = 
        `<strong style="color: ${strengthColor}">Надёжность: ${strengthText}</strong>`;
}

// === ПРОВЕРКА ССЫЛОК ===
function checkLink() {
    const url = document.getElementById('link-to-check').value;
    const result = document.getElementById('link-result');
    
    if (!url) {
        showNotification('Введите URL для проверки', 'error');
        return;
    }
    
    result.className = 'link-result checking';
    result.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Проверка...';
    
    // Простая проверка (в реальности нужен API)
    setTimeout(() => {
        const isSafe = !url.includes('phishing') && !url.includes('scam') && url.startsWith('https');
        
        if (isSafe) {
            result.className = 'link-result safe';
            result.innerHTML = '<i class="fas fa-check-circle"></i> Ссылка безопасна';
            showNotification('Ссылка проверена - безопасно!', 'success');
        } else {
            result.className = 'link-result danger';
            result.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Подозрительная ссылка!';
            showNotification('Внимание! Ссылка может быть опасной', 'error');
        }
    }, 1500);
}

// === ГЛОССАРИЙ ===
function loadGlossary() {
    const list = document.getElementById('glossary-list');
    if (!list) return;
    
    list.innerHTML = CONFIG.glossaryTerms.map(item => `
        <div class="glossary-item">
            <h3>${item.term}</h3>
            <p>${item.definition}</p>
        </div>
    `).join('');
}

function searchGlossary() {
    const query = document.getElementById('glossary-search').value.toLowerCase();
    const items = document.querySelectorAll('.glossary-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
    });
}

// === КАЛЬКУЛЯТОР РИСКА ===
function calculateRisk(event) {
    event.preventDefault();
    
    const form = document.getElementById('risk-form');
    const result = document.getElementById('risk-result');
    const scoreEl = document.getElementById('risk-score');
    const recommendationsEl = document.getElementById('risk-recommendations');
    
    let totalScore = 0;
    for (let i = 1; i <= 5; i++) {
        const selected = form.querySelector(`input[name="q${i}"]:checked`);
        if (selected) totalScore += parseInt(selected.value);
    }
    
    let riskLevel, riskClass, recommendations;
    
    if (totalScore <= 20) {
        riskLevel = 'Низкий риск';
        riskClass = 'low';
        recommendations = `
            <h4><i class="fas fa-check-circle"></i> Отлично!</h4>
            <p>Вы хорошо защищены. Продолжайте соблюдать правила безопасности:</p>
            <ul>
                <li>Регулярно обновляйте пароли</li>
                <li>Используйте 2FA везде где возможно</li>
                <li>Следите за новыми схемами мошенничества</li>
            </ul>
        `;
    } else if (totalScore <= 40) {
        riskLevel = 'Средний риск';
        riskClass = 'medium';
        recommendations = `
            <h4><i class="fas fa-exclamation-triangle"></i> Будьте внимательнее</h4>
            <p>Рекомендуем улучшить защиту:</p>
            <ul>
                <li>Включите двухфакторную аутентификацию</li>
                <li>Установите антивирус на все устройства</li>
                <li>Не переходите по подозрительным ссылкам</li>
            </ul>
        `;
    } else {
        riskLevel = 'Высокий риск';
        riskClass = 'high';
        recommendations = `
            <h4><i class="fas fa-radiation"></i> Срочно улучшите защиту!</h4>
            <p>Вы очень уязвимы для мошенников:</p>
            <ul>
                <li>Немедленно установите антивирус</li>
                <li>Смените все пароли на сложные</li>
                <li>Включите 2FA на всех аккаунтах</li>
                <li>Не делитесь персональными данными в соцсетях</li>
            </ul>
        `;
    }
    
    scoreEl.textContent = riskLevel;
    scoreEl.className = 'risk-score ' + riskClass;
    recommendationsEl.innerHTML = recommendations;
    result.style.display = 'block';
    
    showNotification('Риск рассчитан!', 'success');
}

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

// Плавная прокрутка к элементу
function scrollToElement(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Проверка устройства
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// === ГЛОБАЛЬНЫЕ ФУНКЦИИ ===
window.showPage = showPage;
window.scrollToElement = scrollToElement;
window.isMobile = isMobile;
window.generatePassword = generatePassword;
window.copyPassword = copyPassword;
window.checkLink = checkLink;
window.searchGlossary = searchGlossary;
window.calculateRisk = calculateRisk;

// === ЛОГИРОВАНИЕ ===
console.log('⚙️ CONFIG загружен');
console.log('📊 Разделов:', Object.keys(CONFIG.infographics).length);
console.log('📚 Терминов в глоссарии:', CONFIG.glossaryTerms.length);
