document.addEventListener('DOMContentLoaded', () => {
    // Темная тема и Доступность
    const htmlEl = document.documentElement;
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const isDark = htmlEl.getAttribute('data-theme') === 'dark';
        htmlEl.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });

    document.getElementById('a11y-toggle').addEventListener('click', () => {
        const isA11y = htmlEl.getAttribute('data-a11y') === 'true';
        htmlEl.setAttribute('data-a11y', isA11y ? 'false' : 'true');
    });

    // График
    const ctx = document.getElementById('crimeChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Фишинг', 'Звонки', 'Вирусы', 'Карты', 'Онлайн'],
                datasets: [{ data: [35, 30, 15, 10, 10], backgroundColor: ['#00838f', '#c62828', '#ad1457', '#2e7d32', '#f9a825'] }]
            },
            options: { plugins: { legend: { position: 'bottom' } } }
        });
    }

    // Инициализация квиза
    loadQuizQuestion();
});

// КВИЗ (10 сценариев)
const quizQuestions = [
    { q: "Вам пришло СМС: «Ваша карта заблокирована. Перейдите по ссылке для разблокировки...»", a1: "Проверить карту по ссылке", a2: "Позвонить в банк по номеру на карте", correct: 1, exp: "Официальные банки никогда не присылают ссылки для разблокировки аккаунтов в СМС." },
    { q: "Звонок от 'следователя': 'Ваш близкий человек совершил преступление, нужна взятка'.", a1: "Срочно перевести деньги", a2: "Сбросить и позвонить родственнику", correct: 1, exp: "Это стандартная схема психологического давления. Настоящая полиция не требует взяток." },
    { q: "В соцсетях предлагают 'бесплатный аудит безопасности' вашего аккаунта.", a1: "Предоставить пароль для проверки", a2: "Заблокировать аккаунт отправителя", correct: 1, exp: "Никто не проводит бесплатные аудиты через личные сообщения. Это кража аккаунтов." },
    { q: "Вы нашли флеш-карту в общественном месте.", a1: "Вставить в ноутбук и найти владельца", a2: "Передать в охрану/службу безопасности", correct: 1, exp: "Флешки могут содержать вирусы-автозапуски (Trojan.Autorun)." },
    { q: "Покупатель на Авито просит продиктовать код из СМС 'для оформления доставки'.", a1: "Назвать код", a2: "Отказать в сделке", correct: 1, exp: "Код из СМС — это ключ к вашим деньгам. Для перевода средств покупателю он не нужен." },
    { q: "Приложение просит доступ к вашим СМС и Контактам для 'оптимизации работы'.", a1: "Разрешить всё", a2: "Ограничить права доступа", correct: 1, exp: "Вредоносное ПО ворует коды подтверждения банков через доступ к СМС." },
    { q: "Сотрудник банка звонит через Telegram и говорит о 'подозрительной активности'.", a1: "Выполнить требования", a2: "Положить трубку", correct: 1, exp: "Официальные банки не звонят клиентам через мессенджеры." },
    { q: "Вас приглашают в 'инвест-клуб' с доходностью 500% в месяц.", a1: "Вложиться, пока рынок растет", a2: "Проигнорировать", correct: 1, exp: "Гарантированная сверхдоходность — явный признак финансовой пирамиды." },
    { q: "Вам прислали файл 'План_выплат.exe' по электронной почте.", a1: "Открыть и изучить", a2: "Удалить письмо без открытия", correct: 1, exp: "Исполняемые файлы (.exe) в письмах почти всегда являются вирусами." },
    { q: "Реклама обещает выплаты всем гражданам РФ, нужен только ввод данных карты.", a1: "Ввести данные", a2: "Закрыть сайт", correct: 1, exp: "Официальные выплаты оформляются только через Госуслуги или в офисах банков." }
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
    if (isCorrect) score++;

    const exp = document.getElementById('quiz-explanation');
    exp.classList.remove('hidden');
    exp.className = isCorrect ? "result-message res-safe" : "result-message res-danger";
    exp.innerHTML = `<strong>${isCorrect ? 'ПРАВИЛЬНО!' : 'ОШИБКА.'}</strong> ${q.exp}`;
    
    document.getElementById('quiz-options').style.display = 'none';
    document.getElementById('quiz-controls').classList.remove('hidden');
    document.getElementById('quiz-next-btn').classList.remove('hidden');
}

function nextQuizQuestion() {
    currentQuestion++;
    document.getElementById('quiz-explanation').classList.add('hidden');
    document.getElementById('quiz-options').style.display = 'flex';
    document.getElementById('quiz-controls').classList.add('hidden');
    
    if (currentQuestion < quizQuestions.length) loadQuizQuestion();
    else finishQuiz();
}

function finishQuiz() {
    document.getElementById('quiz-progress').innerText = "Тестирование завершено";
    document.getElementById('quiz-question').innerText = `Коэффициент защиты: ${(score/10*100).toFixed(0)}%. Результат: ${score} из 10.`;
    document.getElementById('quiz-options').style.display = 'none';
    document.getElementById('quiz-next-btn').classList.add('hidden');
    document.getElementById('quiz-restart-btn').classList.remove('hidden');
}

function restartQuiz() {
    currentQuestion = 0; score = 0;
    document.getElementById('quiz-restart-btn').classList.add('hidden');
    loadQuizQuestion();
}

// Функции Firebase и PDF
function submitReportToFirebase(e) {
    e.preventDefault();
    db.collection('reports').add({
        type: document.getElementById('report-type').value,
        id: document.getElementById('report-link').value,
        desc: document.getElementById('report-desc').value,
        at: new Date()
    }).then(() => {
        showToast('Инцидент зафиксирован в системе!', 'success');
        e.target.reset();
    });
}

function downloadPDF() {
    const el = document.getElementById('pdf-content');
    el.style.display = 'block';
    html2pdf().from(el).set({ filename: 'NetProtect_Protocol.pdf' }).save().then(() => el.style.display = 'none');
}

function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast success';
    t.innerText = msg;
    document.getElementById('toast-container').appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

// Модальное окно
const modalData = {
    phishing: { title: "Протокол: Фишинг", icon: "fa-fish", content: "Методы защиты: 1. Проверка SSL-сертификата. 2. Сверка доменных имен." },
    article1: { title: "Крипто-защита", icon: "fa-lock", content: "Рекомендуется использование менеджеров паролей и аппаратных ключей (Yubikey)." }
};

function openModal(id) {
    const data = modalData[id];
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-text').innerText = data.content;
    document.getElementById('modal-text').style.display = 'block';
    document.getElementById('threat-modal').classList.add('active');
}

function closeModal() { document.getElementById('threat-modal').classList.remove('active'); }
