document.addEventListener('DOMContentLoaded', () => {
    // === ТЕМЫ И РЕЖИМЫ ===
    const htmlEl = document.documentElement;
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const isDark = htmlEl.getAttribute('data-theme') === 'dark';
        htmlEl.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });

    // === ГРАФИК ===
    const ctx = document.getElementById('crimeChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Фишинг', 'Звонки', 'Вирусы', 'Карты', 'Онлайн'],
                datasets: [{ data: [35, 30, 15, 10, 10], backgroundColor: ['#0d9488', '#e11d48', '#db2777', '#0f766e', '#ca8a04'], borderWidth: 0 }]
            },
            options: { plugins: { legend: { position: 'bottom' } } }
        });
    }

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

    loadQuizQuestion();
});

// === КВИЗ НА 10 ВОПРОСОВ ===
const quizQuestions = [
    { q: "Вам пришло СМС: «Ваша карта заблокирована. Перейдите по ссылке для проверки...»", a1: "Перейти по ссылке", a2: "Позвонить в банк напрямую", correct: 1, exp: "Банки никогда не присылают ссылки для разблокировки аккаунтов в СМС." },
    { q: "Звонок от 'следователя': 'Ваш родственник попал в ДТП, нужны деньги'.", a1: "Срочно перевести деньги", a2: "Сбросить и позвонить родственнику", correct: 1, exp: "Это схема психологического давления." },
    { q: "Друг ВКонтакте просит срочно перевести 5000 рублей до завтра.", a1: "Перевести сразу", a2: "Позвонить ему лично", correct: 1, exp: "Профиль друга мог быть взломан." },
    { q: "Реклама в соцсети обещает 500% прибыли за месяц от инвестиций.", a1: "Вложить небольшую сумму", a2: "Проигнорировать", correct: 1, exp: "Гарантия сверхприбыли — признак пирамиды." },
    { q: "На почту пришло письмо от 'Госуслуг' о выплате 100 000 рублей.", a1: "Ввести данные карты", a2: "Зайти на сайт вручную", correct: 1, exp: "Фишеры маскируются под госпорталы." },
    { q: "Сотрудник банка просит код из СМС, чтобы 'отменить подозрительный перевод'.", a1: "Продиктовать код", a2: "Сбросить звонок", correct: 1, exp: "Код из СМС — это подпись. Банк его не запрашивает." },
    { q: "Вы нашли флешку на улице возле офиса.", a1: "Вставить в ноутбук", a2: "Передать в охрану", correct: 1, exp: "Флешки могут содержать трояны." },
    { q: "При скачивании файла приложение просит доступ ко всем вашим СМС.", a1: "Разрешить", a2: "Запретить", correct: 1, exp: "Так воруют банковские коды." },
    { q: "Вам звонит 'сотрудник банка' через Telegram.", a1: "Слушать и выполнять", a2: "Положить трубку", correct: 1, exp: "Официальные банки не звонят через мессенджеры." },
    { q: "Сайт предлагает бесплатные бонусы в игре за ввод данных карты.", a1: "Ввести данные", a2: "Закрыть сайт", correct: 1, exp: "Это фишинг для кражи карты." }
];

let currentQuestion = 0, score = 0;

function loadQuizQuestion() {
    const q = quizQuestions[currentQuestion];
    document.getElementById('quiz-progress').innerText = `Вопрос ${currentQuestion + 1} из 10`;
    document.getElementById('quiz-question').innerText = q.q;
    document.getElementById('btn-ans-0').innerText = q.a1;
    document.getElementById('btn-ans-1').innerText = q.a2;
}

function answerQuiz(idx) {
    const q = quizQuestions[currentQuestion];
    const isCorrect = (idx === q.correct);
    if(isCorrect) score++;

    document.getElementById('quiz-options').style.display = 'none';
    const exp = document.getElementById('quiz-explanation');
    exp.classList.remove('hidden');
    exp.className = isCorrect ? "result-box res-safe" : "result-box res-danger";
    exp.innerHTML = `<strong>${isCorrect ? 'Верно!' : 'Ошибка.'}</strong> ${q.exp}`;
    
    document.getElementById('quiz-controls').classList.remove('hidden');
    document.getElementById('quiz-next-btn').classList.remove('hidden');
}

function nextQuizQuestion() {
    currentQuestion++;
    document.getElementById('quiz-explanation').classList.add('hidden');
    document.getElementById('quiz-options').style.display = 'grid';
    document.getElementById('quiz-controls').classList.add('hidden');
    
    if (currentQuestion < quizQuestions.length) loadQuizQuestion();
    else finishQuiz();
}

function finishQuiz() {
    document.getElementById('quiz-progress').innerText = "Тест завершен";
    document.getElementById('quiz-question').innerText = `Ваш результат защиты: ${score} из 10.`;
    document.getElementById('quiz-options').style.display = 'none';
    document.getElementById('quiz-next-btn').classList.add('hidden');
    document.getElementById('quiz-restart-btn').classList.remove('hidden');
}

function restartQuiz() {
    currentQuestion = 0; score = 0;
    document.getElementById('quiz-restart-btn').classList.add('hidden');
    document.getElementById('quiz-options').style.display = 'grid';
    loadQuizQuestion();
}

// === МОДАЛКИ (Исправлено по претензиям 4 и 5) ===
const modalData = {
    // Угрозы
    phishing: { title: "Протокол: Фишинг", theme: "theme-phishing", type: "text", content: "<p>Не вводите данные на сайтах без SSL-сертификата (замочка) и сомнительных доменных имен.</p>" },
    phone: { title: "Вишинг", theme: "theme-phone", type: "text", content: "<p>Просто повесьте трубку и позвоните в банк самостоятельно.</p>" },
    
    // Статьи (Добавлены ссылки на оригиналы)
    article1: { 
        title: "Идеальный пароль", theme: "theme-article", type: "text", 
        content: "<h3>Почему 123456 не работает?</h3><p>Хакеры используют словари и автоматические брутфорс-атаки.</p><br><h3>Формула надежности:</h3><ul><li>Минимум 12 символов</li><li>Используйте спецсимволы (#, $, &)</li></ul>",
        source: "https://habr.com/ru/articles/520110/" 
    },
    article2: { 
        title: "Безопасность соцсетей", theme: "theme-article", type: "text", 
        content: "<h3>Минимизация цифрового следа</h3><p>Закройте свой профиль от посторонних. Не делитесь геолокацией...</p>",
        source: "https://cbr.ru" 
    },
    article3: { title: "Дети и интернет", theme: "theme-article", type: "text", content: "<h3>Цифровая гигиена</h3><p>Как защитить ребенка от кибербуллинга и мошенничества.</p>", source: "https://66.mvd.ru" }
};

function openModal(id) {
    const data = modalData[id];
    if(!data) return;
    
    document.getElementById('modal-content').className = 'modal-container ' + data.theme;
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-icon').innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
    document.getElementById('modal-text').innerHTML = data.content;
    document.getElementById('modal-text').style.display = 'block';
    
    if(data.source) {
        document.getElementById('modal-link-container').innerHTML = `<a href="${data.source}" target="_blank" class="btn btn-outline">Читать оригинал</a>`;
    } else {
        document.getElementById('modal-link-container').innerHTML = '';
    }
    
    document.getElementById('threat-modal').classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function closeModal() { 
    document.getElementById('threat-modal').classList.remove('active'); 
    document.body.style.overflow = 'auto'; 
}

// === FIREBASE И PDF ===
function submitReportToFirebase(e) {
    e.preventDefault();
    db.collection('reports').add({
        type: document.getElementById('report-type').value,
        id: document.getElementById('report-link').value,
        at: new Date()
    }).then(() => { alert('Отправлено в NetProtect!'); e.target.reset(); });
}

function downloadPDF() {
    const el = document.getElementById('pdf-content'); el.style.display = 'block';
    html2pdf().from(el).set({ filename: 'NetProtect_Protocol.pdf', html2canvas: { scale: 2 }, jsPDF: { format: 'letter', orientation: 'portrait' } }).save().then(() => el.style.display = 'none');
}
