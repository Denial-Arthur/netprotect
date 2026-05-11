document.addEventListener('DOMContentLoaded', () => {
    // === ТЕМЫ И РЕЖИМЫ ===
    const htmlEl = document.documentElement;
    
    // Тёмная тема
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const isDark = htmlEl.getAttribute('data-theme') === 'dark';
        htmlEl.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });

    // Режим для слабовидящих
    let a11y = false;
    document.getElementById('a11y-toggle').addEventListener('click', () => {
        a11y = !a11y;
        htmlEl.setAttribute('data-a11y', a11y ? 'true' : 'false');
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

    loadQuizQuestion();
});

// === КВИЗ (10 вопросов) ===
const quizQuestions = [
    { q: "СМС: «Карта заблокирована. Перейдите по ссылке для проверки...»", a1: "Проверить по ссылке", a2: "Позвонить в банк напрямую", correct: 1, exp: "Банки не присылают ссылки для разблокировки." },
    { q: "Звонок от 'следователя': 'Родственник попал в ДТП, нужны деньги'.", a1: "Перевести деньги", a2: "Сбросить и перезвонить родственнику", correct: 1, exp: "Это схема психологического давления." },
    { q: "Друг просит занять денег в соцсети.", a1: "Перевести сразу", a2: "Позвонить ему лично", correct: 1, exp: "Аккаунт мог быть взломан." },
    { q: "Реклама обещает 500% прибыли за месяц.", a1: "Вложить", a2: "Проигнорировать", correct: 1, exp: "Явный признак пирамиды." },
    { q: "Файл 'Документ.exe' пришел по почте.", a1: "Открыть", a2: "Удалить", correct: 1, exp: "Вирусы часто маскируются под документы." },
    { q: "Покупатель просит CVV-код вашей карты.", a1: "Назвать", a2: "Отказать", correct: 1, exp: "CVV нужен только для списания денег." },
    { q: "Вы нашли чужую флешку.", a1: "Посмотреть содержимое", a2: "Передать охране", correct: 1, exp: "Флешки могут содержать трояны." },
    { q: "Приложение просит доступ к СМС.", a1: "Разрешить", a2: "Запретить", correct: 1, exp: "Так крадут банковские коды." },
    { q: "Банк звонит через мессенджер.", a1: "Ответить", a2: "Сбросить", correct: 1, exp: "Официальные банки так не делают." },
    { q: "Бесплатные игровые бонусы за ввод данных карты.", a1: "Ввести", a2: "Закрыть сайт", correct: 1, exp: "Это фишинг для кражи карты." }
];

let currentQ = 0, score = 0;

function loadQuizQuestion() {
    const q = quizQuestions[currentQ];
    document.getElementById('quiz-progress').innerText = `Ситуация ${currentQ + 1} из 10`;
    document.getElementById('quiz-question').innerText = q.q;
    document.getElementById('btn-ans-0').innerText = q.a1;
    document.getElementById('btn-ans-1').innerText = q.a2;
}

function answerQuiz(idx) {
    const q = quizQuestions[currentQ];
    const isCorrect = (idx === q.correct);
    if(isCorrect) score++;

    const exp = document.getElementById('quiz-explanation');
    exp.classList.remove('hidden');
    exp.className = isCorrect ? "result-box res-safe" : "result-box res-danger";
    exp.innerHTML = `<strong>${isCorrect ? 'Верно!' : 'Ошибка.'}</strong> ${q.exp}`;
    
    document.getElementById('quiz-options').style.display = 'none';
    document.getElementById('quiz-controls').classList.remove('hidden');
    document.getElementById('quiz-next-btn').classList.remove('hidden');
}

function nextQuizQuestion() {
    currentQ++;
    document.getElementById('quiz-explanation').classList.add('hidden');
    document.getElementById('quiz-options').style.display = 'grid';
    document.getElementById('quiz-controls').classList.add('hidden');
    
    if (currentQ < quizQuestions.length) loadQuizQuestion();
    else finishQuiz();
}

function finishQuiz() {
    document.getElementById('quiz-progress').innerText = "Тест завершен";
    document.getElementById('quiz-question').innerText = `Результат: ${score} из 10.`;
    document.getElementById('quiz-options').style.display = 'none';
    document.getElementById('quiz-next-btn').classList.add('hidden');
    document.getElementById('quiz-restart-btn').classList.remove('hidden');
}

function restartQuiz() {
    currentQ = 0; score = 0;
    document.getElementById('quiz-restart-btn').classList.add('hidden');
    document.getElementById('quiz-options').style.display = 'grid';
    loadQuizQuestion();
}

// === МОДАЛКИ ===
const modalData = {
    phishing: { title: "Протокол: Фишинг", theme: "theme-phishing", type: "text", content: "<p>Проверяйте URL сайта и наличие замочка SSL.</p>" },
    article1: { title: "Крипто-защита", theme: "theme-article", type: "text", content: "<p>Надежный пароль — 12+ символов.</p>", source: "https://habr.com" }
};

function openModal(id) {
    const data = modalData[id];
    if(!data) return;
    document.getElementById('modal-content').className = 'modal-container ' + data.theme;
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-text').innerHTML = data.content;
    document.getElementById('modal-text').style.display = 'block';
    if(data.source) document.getElementById('modal-link-container').innerHTML = `<a href="${data.source}" target="_blank" class="btn btn-outline">Читать источник</a>`;
    document.getElementById('threat-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() { document.getElementById('threat-modal').classList.remove('active'); document.body.style.overflow = 'auto'; }

// Firebase & PDF
function submitReportToFirebase(e) {
    e.preventDefault();
    db.collection('reports').add({
        type: document.getElementById('report-type').value,
        id: document.getElementById('report-link').value,
        at: new Date()
    }).then(() => { alert('Отправлено!'); e.target.reset(); });
}
function downloadPDF() {
    const el = document.getElementById('pdf-content'); el.style.display = 'block';
    html2pdf().from(el).set({ filename: 'NetProtect.pdf' }).save().then(() => el.style.display = 'none');
}
