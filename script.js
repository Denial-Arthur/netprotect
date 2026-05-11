document.addEventListener('DOMContentLoaded', () => {
    // Темная тема
    const htmlEl = document.documentElement;
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const isDark = htmlEl.getAttribute('data-theme') === 'dark';
        htmlEl.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });

    // График
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

    loadQuizQuestion();
});

// КВИЗ (10 вопросов)
const quizQuestions = [
    { q: "Вам пришло СМС: «Ваша карта заблокирована. Перейдите по ссылке...»", a1: "Перейти по ссылке", a2: "Позвонить в банк напрямую", correct: 1, exp: "Банки никогда не рассылают ссылки для разблокировки в СМС." },
    { q: "Звонок от 'следователя': 'Ваш родственник попал в ДТП, нужны деньги'.", a1: "Срочно перевести деньги", a2: "Сбросить и перезвонить родственнику", correct: 1, exp: "Это стандартная схема психологического давления." },
    { q: "Друг просит в соцсети занять денег 'до завтра'.", a1: "Перевести сразу", a2: "Позвонить другу лично", correct: 1, exp: "Аккаунт друга мог быть взломан." },
    { q: "Реклама обещает 500% доходности в месяц от инвестиций.", a1: "Вложить немного", a2: "Проигнорировать", correct: 1, exp: "Это классическая финансовая пирамида." },
    { q: "Вам прислали файл 'План_выплат.exe' по почте.", a1: "Открыть", a2: "Удалить письмо", correct: 1, exp: "Файлы .exe часто содержат вирусы." },
    { q: "Покупатель на Авито просит назвать CVV код.", a1: "Назвать", a2: "Отказать", correct: 1, exp: "Для перевода вам денег CVV не нужен." },
    { q: "Вы нашли флешку на улице.", a1: "Вставить в ноутбук", a2: "Передать в охрану", correct: 1, exp: "Через флешки распространяются трояны." },
    { q: "Приложение просит доступ ко всем вашим СМС.", a1: "Разрешить", a2: "Отказать", correct: 1, exp: "Вредоносное ПО может красть коды банков." },
    { q: "Сотрудник банка звонит через WhatsApp.", a1: "Слушать", a2: "Положить трубку", correct: 1, exp: "Официальные банки не звонят в мессенджеры." },
    { q: "Сайт предлагает бесплатные 'гемы' в игре за ввод данных карты.", a1: "Ввести данные", a2: "Закрыть сайт", correct: 1, exp: "Это кража платежных данных." }
];

let currentQuestion = 0;
let score = 0;

function loadQuizQuestion() {
    const q = quizQuestions[currentQuestion];
    document.getElementById('quiz-progress').innerText = `Ситуация ${currentQuestion + 1} из 10`;
    document.getElementById('quiz-question').innerText = q.q;
    document.getElementById('btn-ans-0').innerText = q.a1;
    document.getElementById('btn-ans-1').innerText = q.a2;
}

function answerQuiz(idx) {
    const q = quizQuestions[currentQuestion];
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
    currentQuestion++;
    document.getElementById('quiz-explanation').classList.add('hidden');
    document.getElementById('quiz-options').style.display = 'grid';
    document.getElementById('quiz-controls').classList.add('hidden');
    
    if (currentQuestion < quizQuestions.length) loadQuizQuestion();
    else finishQuiz();
}

function finishQuiz() {
    document.getElementById('quiz-progress').innerText = "Тест завершен";
    document.getElementById('quiz-question').innerText = `Ваш результат: ${score} из 10.`;
    document.getElementById('quiz-options').style.display = 'none';
    document.getElementById('quiz-next-btn').classList.add('hidden');
    document.getElementById('quiz-restart-btn').classList.remove('hidden');
}

function restartQuiz() {
    currentQuestion = 0; score = 0;
    document.getElementById('quiz-restart-btn').classList.add('hidden');
    loadQuizQuestion();
}

// МОДАЛКИ (Статьи + Ссылки)
const modalData = {
    phishing: { title: "Протокол: Фишинг", theme: "theme-phishing", type: "text", content: "<p>Не вводите данные на сайтах без SSL сертификата...</p>" },
    article1: { 
        title: "Крипто-защита", theme: "theme-article", type: "text", 
        content: "<p>Надежный пароль — это минимум 12 символов. Используйте менеджеры паролей...</p>",
        source: "https://habr.com/ru/articles/520110/" 
    }
};

function openModal(id) {
    const data = modalData[id];
    if(!data) return;
    document.getElementById('modal-content').className = 'modal-container ' + data.theme;
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-text').innerHTML = data.content;
    document.getElementById('modal-text').style.display = 'block';
    
    if(data.source) {
        document.getElementById('modal-link-container').innerHTML = `<a href="${data.source}" target="_blank" class="btn btn-outline">Читать оригинал</a>`;
    } else {
        document.getElementById('modal-link-container').innerHTML = '';
    }
    
    document.getElementById('threat-modal').classList.add('active');
}

function closeModal() { document.getElementById('threat-modal').classList.remove('active'); }

// PDF
function downloadPDF() {
    const el = document.getElementById('pdf-content');
    el.style.display = 'block';
    html2pdf().from(el).set({ filename: 'NetProtect_Protocol.pdf' }).save().then(() => el.style.display = 'none');
}

// Firebase
function submitReportToFirebase(e) {
    e.preventDefault();
    db.collection('reports').add({
        type: document.getElementById('report-type').value,
        id: document.getElementById('report-link').value,
        desc: document.getElementById('report-desc').value,
        at: new Date()
    }).then(() => {
        alert('Жалоба зафиксирована!');
        e.target.reset();
    });
}
