// === ЛОГИКА ТРЕНАЖЕРА (10 сценариев + Начать заново) ===
const quizQuestions = [
    { q: "Вам пришло СМС: «Ваша карта заблокирована. Для разблокировки перейдите по ссылке...»", a1: "Перейти по ссылке", a2: "Позвонить в банк напрямую", correct: 1, exp: "Банки никогда не рассылают ссылки для разблокировки." },
    { q: "Звонок от 'следователя': 'Ваш родственник попал в ДТП, нужны деньги для закрытия дела'.", a1: "Срочно перевести деньги", a2: "Сбросить и позвонить родственнику", correct: 1, exp: "Это классическая схема 'Мама, я попал в беду'." },
    { q: "Реклама в соцсети: 'Газпром дарит 50 000 рублей каждому гражданину! Пройдите опрос'.", a1: "Пройти опрос и ввести данные карты", a2: "Закрыть страницу, это мошенники", correct: 1, exp: "Крупные компании не раздают деньги за опросы на сомнительных сайтах." },
    // ... добавь еще 7 вопросов по этой структуре ...
];

let currentQuestion = 0;
let score = 0;

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('quiz-restart-btn').classList.add('hidden');
    document.getElementById('quiz-controls').classList.add('hidden');
    loadQuizQuestion();
}

function answerQuiz(idx) {
    const q = quizQuestions[currentQuestion];
    const isCorrect = (idx === q.correct);
    if(isCorrect) score++;

    document.getElementById('quiz-options').style.display = 'none';
    const exp = document.getElementById('quiz-explanation');
    exp.classList.remove('hidden');
    exp.className = isCorrect ? "result-message res-safe" : "result-message res-danger";
    exp.innerHTML = `<strong>${isCorrect ? 'Верно!' : 'Ошибка!'}</strong> ${q.exp}`;
    
    document.getElementById('quiz-controls').classList.remove('hidden');
    document.getElementById('quiz-next-btn').classList.remove('hidden');
}

function nextQuizQuestion() {
    currentQuestion++;
    if(currentQuestion < quizQuestions.length) {
        loadQuizQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    document.getElementById('quiz-progress').innerText = "Тестирование завершено";
    document.getElementById('quiz-question').innerText = `Ваш результат защиты: ${score} из ${quizQuestions.length}`;
    document.getElementById('quiz-options').style.display = 'none';
    document.getElementById('quiz-next-btn').classList.add('hidden');
    document.getElementById('quiz-restart-btn').classList.remove('hidden');
}

// === СТАТЬИ И ССЫЛКИ ===
const modalData = {
    article1: { 
        title: "Криптографическая защита", icon: "fa-lock", theme: "theme-article", type: "text", 
        content: "<p>Надежный пароль — это первая линия обороны. Используйте генераторы случайных чисел и менеджеры паролей...</p>",
        source: "https://habr.com/ru/articles/520110/"
    },
    // ... остальные статьи ...
};

function openModal(id) {
    const data = modalData[id];
    // ... логика открытия окна ...
    if(data.source) {
        document.getElementById('modal-link-container').innerHTML = `<a href="${data.source}" target="_blank" class="btn btn-outline">Читать оригинал на источнике</a>`;
    }
}

// ... ОСТАЛЬНЫЕ ФУНКЦИИ (Firebase, PDF, Поиск) остаются как были ...
