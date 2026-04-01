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
    // Инициализация тёмной темы
    initTheme();

    // Инициализация навигации
    initNavigation();

    // Загрузка инфографики
    loadInfographics();

    // Обновление статистики
    updateStats();

    console.log('✅ script.js загружен');
    console.log('🌙 Тёмная тема активирована');
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
    
    if (statSections) statSections.textContent = '5';
    if (statInfographics) statInfographics.textContent = '5';
    
    console.log('📊 Статистика обновлена');
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

// === ЛОГИРОВАНИЕ ===
console.log('⚙️ CONFIG загружен');
console.log('📊 Разделов:', Object.keys(CONFIG.infographics).length);
