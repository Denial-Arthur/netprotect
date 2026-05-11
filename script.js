document.addEventListener('DOMContentLoaded', () => {

    // === ТЕМЫ И A11Y ===
    const htmlEl = document.documentElement;
    if (localStorage.getItem('theme') === 'dark') htmlEl.setAttribute('data-theme', 'dark');
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const isDark = htmlEl.getAttribute('data-theme') === 'dark';
        htmlEl.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });

    let a11yMode = false;
    document.getElementById('a11y-toggle').addEventListener('click', () => {
        a11yMode = !a11yMode;
        htmlEl.setAttribute('data-a11y', a11yMode ? 'true' : 'false');
        showToast(a11yMode ? 'Режим для слабовидящих включен' : 'Обычный режим включен', 'success');
    });

    // === ПОИСК ===
    const searchInput = document.getElementById('threat-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('.threat-card').forEach(card => {
                card.style.display = card.innerText.toLowerCase().includes(query) ? 'block' : 'none';
            });
        });
    }

    // === ГРАФИК ===
    const ctx = document.getElementById('crimeChart');
    if (ctx) {
        new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Фишинг', 'Тел. мошенники', 'Вирусы', 'Кража карт', 'Онлайн-аферы'],
                datasets: [{ data: [35, 30, 15, 10, 10], backgroundColor: ['#0d9488', '#e11d48', '#db2777', '#0f766e', '#ca8a04'], borderWidth: 0 }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Inter' } } } } }
        });
    }

    // === FAQ ===
    document.querySelectorAll('.faq-header').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const content = faqItem.querySelector('.faq-content');
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) { item.classList.remove('active'); item.querySelector('.faq-content').style.maxHeight = null; }
            });
            faqItem.classList.toggle('active');
            content.style.maxHeight = faqItem.classList.contains('active') ? content.scrollHeight + "px" : null;
        });
    });

    // === СЧЕТЧИКИ ===
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                let count = 0;
                const updateCount = () => {
                    if (count < target) { count += target / 50; entry.target.innerText = Math.ceil(count); setTimeout(updateCount, 30); }
                    else { entry.target.innerText = target + (target >= 150 ? '+' : ''); }
                };
                updateCount(); observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.5 }); 
    counters.forEach(counter => observer.observe(counter));

    // Инициализация Квиза
    loadQuizQuestion();
});

// === БАЗА ДАННЫХ ДЛЯ КАРТОЧЕК (Угрозы + Статьи) ===
const modalData = {
    phishing: { title: "Защита от Фишинга", icon: "fa-fish", theme: "theme-phishing", type: "image", content: "images/phishing.jpg.jpg" },
    phone: { title: "Телефонные мошенники", icon: "fa-phone-slash", theme: "theme-phone", type: "image", content: "images/phone_scams.jpg.jpg" },
    viruses: { title: "Вирусы и вредоносное ПО", icon: "fa-bug", theme: "theme-viruses", type: "image", content: "images/viruses.jpg.jpg" },
    cards: { title: "Кража с банковской карты", icon: "fa-credit-card", theme: "theme-cards", type: "image", content: "images/card_theft.jpg.jpg" },
    online: { title: "Онлайн-мошенничество", icon: "fa-laptop-code", theme: "theme-online", type: "image", content: "images/online_scams.jpg.jpg" },
    
    // Статьи (Без картинок, чисто текст)
    article1: { 
        title: "Идеальный пароль", icon: "fa-file-lines", theme: "theme-article", type: "text", 
        content: "<h3>Почему 123456 больше не работает?</h3><p>Хакеры используют программы для автоматического подбора паролей...</p><br><h3>Формула надежного пароля:</h3><ul><li>Минимум 12 символов</li><li>Используйте спецсимволы (#, $, &)</li><li>Не используйте дату рождения или имена питомцев.</li></ul>"
    },
    article2: { 
        title: "Безопасность в соцсетях", icon: "fa-user-secret", theme: "theme-article", type: "text", 
        content: "<h3>Опасность геолокации</h3><p>Выкладывая фото с отпуска в реальном времени, вы сообщаете ворам, что ваша квартира пуста.</p><br><h3>Советы:</h3><ul><li>Закройте профиль от посторонних.</li><li>Скройте список друзей.</li><li>Никогда не публикуйте фото документов (паспорта, билеты).</li></ul>"
    },
    article3: { 
        title: "Дети и интернет", icon: "fa-child", theme: "theme-article", type: "text", 
        content: "<h3>Мошенничество в онлайн-играх</h3><p>Дети часто становятся жертвами обмана, когда им предлагают 'бесплатную игровую валюту' в обмен на номер маминой карты.</p><br><h3>Как защитить:</h3><ul><li>Настройте родительский контроль.</li><li>Запретите привязку карт в Google Play/AppStore.</li><li>Проведите беседу о цифровой гигиене.</li></ul>"
    }
};

function openModal(id) {
    const data = modalData[id];
    if (!data) return;
    
    document.getElementById('modal-content').className = 'modal-container ' + data.theme;
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-icon').innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
    
    const imgEl = document.getElementById('modal-image');
    const textEl = document.getElementById('modal-text');
    
    if (data.type === 'image') {
        imgEl.src = data.content;
        imgEl.style.display = 'block';
        textEl.style.display = 'none';
    } else {
        textEl.innerHTML = data.content;
        textEl.style.display = 'block';
        imgEl.style.display = 'none';
    }
    
    document.getElementById('threat-modal').classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function closeModal(e) {
    if (!e || e.target.id === 'threat-modal' || e.target.closest('.modal-close')) {
        document.getElementById('threat-modal').classList.remove('active');
        document.body.style.overflow = 'auto'; 
    }
}

// === КВИЗ НА 10 ВОПРОСОВ ===
const quizQuestions = [
    { q: "Вам пришло СМС: «Ваша карта заблокирована. Для разблокировки перейдите по ссылке...»", a1: "Перейти по ссылке для проверки", a2: "Проигнорировать и позвонить в банк", correct: 1, exp: "Банки никогда не присылают ссылки для разблокировки в СМС." },
    { q: "Вам звонит 'сотрудник полиции' и говорит, что на ваше имя пытаются взять кредит.", a1: "Следовать его инструкциям", a2: "Положить трубку", correct: 1, exp: "Настоящая полиция не решает финансовые вопросы по телефону." },
    { q: "Друг ВКонтакте просит срочно перевести 5000 рублей до завтра.", a1: "Перевести деньги по номеру", a2: "Позвонить другу лично", correct: 1, exp: "Страницу друга могли взломать. Обязательно проверяйте информацию по телефону." },
    { q: "В интернет-магазине продается новый iPhone со скидкой 70%, оплата только переводом на карту.", a1: "Купить, пока не разобрали", a2: "Поискать другой магазин", correct: 1, exp: "Слишком низкая цена и оплата переводом физлицу — 100% признаки мошенников." },
    { q: "На почту пришло письмо от 'Госуслуг' о начислении выплаты в 100 000 рублей.", a1: "Ввести данные карты для получения", a2: "Зайти на сайт Госуслуг вручную", correct: 1, exp: "Фишеры часто маскируются под госпорталы. Никогда не кликайте ссылки из таких писем." },
    { q: "Сотрудник банка по телефону просит назвать код из СМС, чтобы 'отменить подозрительный перевод'.", a1: "Продиктовать код", a2: "Сбросить звонок", correct: 1, exp: "Код из СМС — это подпись. Если вы его назовете, вы подтвердите перевод мошенникам." },
    { q: "Вы нашли флешку возле офиса.", a1: "Вставить в рабочий ПК, чтобы найти владельца", a2: "Отдать системному администратору", correct: 1, exp: "Через 'потерянные' флешки часто заражают корпоративные компьютеры вирусами." },
    { q: "При скачивании файла выскочило окно: 'Ваш компьютер заражен вирусом! Скачайте антивирус'.", a1: "Скачать предложенный антивирус", a2: "Закрыть вкладку браузера", correct: 1, exp: "Это scareware (программа-пугалка). Под видом антивируса вы скачаете реальный троян." },
    { q: "Для перевода вам денег покупатель с Авито просит назвать три цифры с обратной стороны карты.", a1: "Назвать (CVV-код)", a2: "Отказать в сделке", correct: 1, exp: "Для перевода вам денег нужен ТОЛЬКО номер телефона или номер карты. CVV нужен для СПИСАНИЯ." },
    { q: "Реклама предлагает инвестировать в новую криптовалюту с гарантированным доходом 500% в месяц.", a1: "Вложить небольшую сумму", a2: "Проигнорировать", correct: 1, exp: "Гарантия сверхприбыли — классический признак финансовой пирамиды или скама." }
];

let currentQuestion = 0;
let score = 0;

function loadQuizQuestion() {
    const q = quizQuestions[currentQuestion];
    document.getElementById('quiz-progress').innerText = `Ситуация ${currentQuestion + 1} из 10`;
    document.getElementById('quiz-question').innerHTML = q.q;
    document.getElementById('btn-ans-0').innerText = q.a1;
    document.getElementById('btn-ans-1').innerText = q.a2;
    
    document.getElementById('quiz-options').style.display = 'flex';
    document.getElementById('quiz-explanation').classList.add('hidden');
    document.getElementById('quiz-next-btn').classList.add('hidden');
}

function answerQuiz(selectedIndex) {
    const q = quizQuestions[currentQuestion];
    const isCorrect = (selectedIndex === q.correct);
    if (isCorrect) score++;

    document.getElementById('quiz-options').style.display = 'none';
    const expBox = document.getElementById('quiz-explanation');
    expBox.classList.remove('hidden', 'res-safe', 'res-danger');
    
    if (isCorrect) {
        expBox.className = 'result-box res-safe';
        expBox.innerHTML = `<i class="fa-solid fa-check"></i> <strong>Верное решение!</strong> ${q.exp}`;
    } else {
        expBox.className = 'result-box res-danger';
        expBox.innerHTML = `<i class="fa-solid fa-xmark"></i> <strong>Ошибка.</strong> ${q.exp}`;
    }
    document.getElementById('quiz-next-btn').classList.remove('hidden');
}

function nextQuizQuestion() {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
        loadQuizQuestion();
    } else {
        // Конец квиза
        document.getElementById('quiz-progress').innerText = "Тест завершен!";
        document.getElementById('quiz-question').innerHTML = `Ваш результат: ${score} из 10`;
        document.getElementById('quiz-options').style.display = 'none';
        document.getElementById('quiz-next-btn').classList.add('hidden');
        
        const expBox = document.getElementById('quiz-explanation');
        expBox.classList.remove('hidden', 'res-safe', 'res-danger');
        
        if (score >= 8) {
            expBox.className = 'result-box res-safe';
            expBox.innerHTML = "<strong>Отличный уровень безопасности!</strong> Вы умеете распознавать уловки мошенников.";
        } else {
            expBox.className = 'result-box res-danger';
            expBox.innerHTML = "<strong>Вам стоит быть осторожнее.</strong> Рекомендуем ознакомиться со статьями и базой угроз на нашем сайте.";
        }
    }
}

// === FIREBASE: ОТПРАВКА ЖАЛОБЫ ===
function submitReportToFirebase(e) {
    e.preventDefault(); 
    
    if (typeof db === 'undefined') {
        showToast('Ошибка подключения к базе данных', 'error');
        return;
    }

    const type = document.getElementById('report-type').value;
    const link = document.getElementById('report-link').value;
    const desc = document.getElementById('report-desc').value;

    showToast('Отправка данных...', 'info');

    db.collection('reports').add({
        type: type,
        linkOrPhone: link,
        description: desc,
        timestamp: new Date()
    })
    .then(() => {
        showToast('Жалоба успешно занесена в базу NetProtect!', 'success');
        document.getElementById('report-form').reset();
    })
    .catch((error) => {
        showToast('Ошибка отправки: ' + error.message, 'error');
    });
}

// Утилиты (Пароли, Ссылки, PDF) остаются без изменений
function generatePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let p = ""; for (let i = 0; i < 16; i++) p += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('pass-output').value = p;
}
function copyPassword() {
    const p = document.getElementById('pass-output').value;
    if (!p) return showToast('Сгенерируйте пароль!', 'error');
    navigator.clipboard.writeText(p).then(() => showToast('Скопировано', 'success'));
}
function checkUrl() {
    const i = document.getElementById('url-input').value.trim();
    const r = document.getElementById('url-result');
    if (!i) return showToast('Введите URL', 'error');
    r.classList.remove('hidden', 'res-safe', 'res-danger');
    r.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Анализ...';
    setTimeout(() => {
        if (i.includes('scam') || i.includes('login-') || !i.startsWith('http')) {
            r.className = 'result-box res-danger'; r.innerHTML = '<i class="fa-solid fa-shield-virus"></i> Угроза!';
        } else {
            r.className = 'result-box res-safe'; r.innerHTML = '<i class="fa-solid fa-shield-check"></i> Безопасно.';
        }
    }, 1200);
}
function showToast(msg, type = 'success') {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `${type === 'success' ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-exclamation"></i>'} <span>${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
}
function downloadPDF() {
    showToast('Генерация PDF...', 'success');
    const el = document.getElementById('pdf-content');
    el.style.display = 'block'; 
    html2pdf().from(el).set({ filename: 'NetProtect-Памятка.pdf', jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } }).save().then(() => {
        el.style.display = 'none'; showToast('Скачано!', 'success');
    });
}
