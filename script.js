// === КОНФИГУРАЦИЯ ===
const CONFIG = {
    infographics: {
        phishing: 'images/phishing.jpg.jpg',
        online: 'images/online_scams.jpg.jpg',
        phone: 'images/phone_scams.jpg.jpg',
        viruses: 'images/viruses.jpg.jpg',
        cards: 'images/card_theft.jpg.jpg'
    }
};

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    // Установка текущей даты
    var dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Инициализация навигации
    initNavigation();

    // Загрузка инфографики
    loadInfographics();

    // Обновление статистики
    updateStats();

    console.log('✅ script.js загружен');
});

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
    
    if (statSections) statSections.textContent = '5';
    if (statInfographics) statInfographics.textContent = '5';
    
    console.log('📊 Статистика обновлена');
}

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

// Форматирование даты
function formatDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;
    
    return day + '.' + month + '.' + year;
}

// Форматирование времени
function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    
    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    
    return hours + ':' + minutes;
}

// Проверка устройства
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

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

// === ГЛОБАЛЬНЫЕ ФУНКЦИИ ===
window.showPage = showPage;
window.scrollToElement = scrollToElement;
window.isMobile = isMobile;
window.formatDate = formatDate;
window.formatTime = formatTime;

// === ЛОГИРОВАНИЕ ===
console.log('⚙️ CONFIG загружен');
console.log('📊 Разделов:', Object.keys(CONFIG.infographics).length);
