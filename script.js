document.addEventListener('DOMContentLoaded', () => {

    // === МОБИЛЬНОЕ МЕНЮ (БУРГЕР) ===
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if(navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Закрываем меню при клике на любую ссылку
        document.querySelectorAll('.nav-link, .mobile-report-btn').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
            });
        });
    }

    // === ИНСТРУМЕНТ 1: АНАЛИЗАТОР ПАРОЛЕЙ ===
    const passInput = document.getElementById('pass-input');
    const passMeter = document.getElementById('pass-meter');
    const passTime = document.getElementById('pass-time');

    function analyzePassword(pass) {
        const len = pass.length;
        if(len === 0) {
            passMeter.style.width = '0%';
            passMeter.style.background = '#ef4444';
            passTime.innerText = 'Время взлома: ---';
            return;
        }

        let timeStr = ''; let color = ''; let width = '';

        if (len < 6) { timeStr = 'Мгновенно'; color = '#ef4444'; width = '10%'; }
        else if (len < 8) { timeStr = '3 минуты'; color = '#f59e0b'; width = '40%'; }
        else if (len < 10) { timeStr = '2 дня'; color = '#f59e0b'; width = '60%'; }
        else if (len < 12) { timeStr = '14 лет'; color = '#10b981'; width = '85%'; }
        else { timeStr = '400+ лет'; color = '#10b981'; width = '100%'; }

        if (/[!@#$%^&*()]/.test(pass) && len >= 10) {
             timeStr = '10 000+ лет'; width = '100%'; color = '#10b981';
        }

        passMeter.style.width = width;
        passMeter.style.background = color;
        passTime.innerText = `Время взлома: ${timeStr}`;
    }

    passInput.addEventListener('input', (e) => analyzePassword(e.target.value));

    window.generatePass = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        let pass = '';
        for (let i = 0; i < 16; i++) { pass += chars.charAt(Math.floor(Math.random() * chars.length)); }
        passInput.value = pass;
        analyzePassword(pass);
    };

    // === ИНСТРУМЕНТ 2: SHA-256 ХЭШ ===
    const hashInput = document.getElementById('hash-input');
    const hashOutput = document.getElementById('hash-output');

    async function generateHash(text) {
        if(text === '') { 
            hashOutput.innerText = 'Здесь появится криптографический хэш...'; 
            hashOutput.classList.add('text-muted');
            hashOutput.style.color = '';
            return; 
        }
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        hashOutput.innerText = hashHex;
        hashOutput.classList.remove('text-muted');
        hashOutput.style.color = 'var(--neon-accent)';
    }

    hashInput.addEventListener('input', (e) => generateHash(e.target.value));


    // === АУДИТ УЯЗВИМОСТИ ===
    const checks = document.querySelectorAll('.audit-check');
    const scoreDisplay = document.getElementById('audit-score');
    const progressBar = document.getElementById('audit-progress');
    const statusBadge = document.getElementById('audit-status');
    const statusText = document.getElementById('audit-text');

    function calculateAudit() {
        const checkedCount = Array.from(checks).filter(cb => cb.checked).length;
        const total = checks.length;
        const percent = Math.round((checkedCount / total) * 100);

        scoreDisplay.innerText = percent + '%';
        progressBar.style.width = percent + '%';

        if (percent <= 40) {
            progressBar.style.background = '#ef4444';
            statusBadge.innerText = 'КРИТИЧЕСКАЯ УЯЗВИМОСТЬ';
            statusBadge.style.color = '#ef4444';
            statusBadge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            statusBadge.style.background = 'rgba(239, 68, 68, 0.1)';
            statusText.innerText = 'Ваши данные могут быть скомпрометированы при первой целенаправленной атаке.';
        } else if (percent <= 80) {
            progressBar.style.background = '#f59e0b';
            statusBadge.innerText = 'БАЗОВЫЙ УРОВЕНЬ ЗАЩИТЫ';
            statusBadge.style.color = '#f59e0b';
            statusBadge.style.borderColor = 'rgba(245, 158, 11, 0.3)';
            statusBadge.style.background = 'rgba(245, 158, 11, 0.1)';
            statusText.innerText = 'Вы защищены от автоматических угроз, но социальная инженерия может сработать.';
        } else {
            progressBar.style.background = '#10b981';
            statusBadge.innerText = 'ВЫСОКИЙ УРОВЕНЬ ЗАЩИТЫ';
            statusBadge.style.color = '#10b981';
            statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            statusBadge.style.background = 'rgba(16, 185, 129, 0.1)';
            statusText.innerText = 'Система защиты настроена корректно. Риск компрометации минимален.';
        }
    }

    checks.forEach(check => check.addEventListener('change', calculateAudit));
    calculateAudit();


    // === СИМУЛЯТОР АТАК (КВИЗ) ===
    const simData = [
        { q: "СМС от банка: «Карта заблокирована. Подтвердите данные по ссылке...»", opts: ["Перейти по ссылке", "Позвонить в банк напрямую"], correct: 1, exp: "Банки никогда не присылают ссылки для разблокировки в СМС." },
        { q: "Звонок от следователя: 'Ваш родственник попал в ДТП, нужны деньги'.", opts: ["Перевести деньги", "Сбросить и позвонить родственнику"], correct: 1, exp: "Это схема психологического давления." },
        { q: "Друг ВКонтакте просит срочно перевести 5000 рублей до завтра.", opts: ["Перевести", "Позвонить ему лично"], correct: 1, exp: "Профиль друга скорее всего был взломан брутфорсом." },
        { q: "Реклама в соцсети обещает 500% прибыли за месяц от инвестиций.", opts: ["Вложить немного", "Проигнорировать"], correct: 1, exp: "Гарантия сверхприбыли — главный признак финансовой пирамиды (скама)." },
        { q: "На почту пришло письмо от 'Госуслуг' о выплате 100 000 рублей.", opts: ["Ввести карту", "Зайти на сайт вручную"], correct: 1, exp: "Фишеры делают точные копии писем от госпорталов." },
        { q: "Сотрудник банка просит код из СМС, чтобы 'отменить подозрительный перевод'.", opts: ["Продиктовать код", "Сбросить звонок"], correct: 1, exp: "Код из СМС — это ваша цифровая подпись. Банк его не просит." },
        { q: "Вы нашли флешку на улице возле офиса.", opts: ["Вставить в ПК", "Оставить на месте"], correct: 1, exp: "Флешки-приманки заражают сети троянами." },
        { q: "При скачивании файла приложение просит доступ к СМС.", opts: ["Разрешить", "Запретить"], correct: 1, exp: "Так приложения воруют коды для перевода денег." },
        { q: "Вам звонит 'сотрудник банка' через WhatsApp.", opts: ["Ответить", "Положить трубку"], correct: 1, exp: "Официальные банки не звонят через мессенджеры." },
        { q: "Сайт предлагает бесплатные бонусы в игре за ввод данных карты.", opts: ["Ввести", "Закрыть сайт"], correct: 1, exp: "Бесплатный сыр только в мышеловке. Это кража данных карты." }
    ];

    let simIndex = 0;
    let simScore = 0;

    const simCounter = document.getElementById('sim-counter');
    const simQuestion = document.getElementById('sim-question');
    const opt0 = document.getElementById('opt-0');
    const opt1 = document.getElementById('opt-1');
    const simOptions = document.getElementById('sim-options');
    const simFeedback = document.getElementById('sim-feedback');
    const simActions = document.getElementById('sim-actions');
    const btnNext = document.getElementById('btn-next');
    const btnRestart = document.getElementById('btn-restart');

    function renderScenario() {
        const s = simData[simIndex];
        simCounter.innerText = `Сценарий ${simIndex + 1} / 10`;
        simQuestion.innerText = s.q;
        opt0.innerText = s.opts[0];
        opt1.innerText = s.opts[1];
        
        simOptions.classList.remove('hidden');
        simFeedback.classList.add('hidden');
        simActions.classList.add('hidden');
    }

    window.processAnswer = (idx) => {
        const s = simData[simIndex];
        const isCorrect = (idx === s.correct);
        if (isCorrect) simScore++;

        simOptions.classList.add('hidden');
        simFeedback.classList.remove('hidden');
        
        simFeedback.className = `sim-feedback ${isCorrect ? 'feed-correct' : 'feed-wrong'}`;
        simFeedback.innerHTML = `<strong>${isCorrect ? 'Верное решение.' : 'Критическая ошибка.'}</strong><br>${s.exp}`;
        
        simActions.classList.remove('hidden');
    }

    window.nextScenario = () => {
        simIndex++;
        if (simIndex < simData.length) {
            renderScenario();
        } else {
            simCounter.innerText = "Анализ завершен";
            simQuestion.innerText = `Эффективность защиты: ${simScore} из 10.`;
            simFeedback.classList.add('hidden');
            btnNext.classList.add('hidden');
            btnRestart.classList.remove('hidden');
        }
    }

    window.resetSimulator = () => {
        simIndex = 0;
        simScore = 0;
        btnRestart.classList.add('hidden');
        btnNext.classList.remove('hidden');
        renderScenario();
    }

    renderScenario();


    // === БАЗА УГРОЗ (Модальные окна с фото) ===
    const threatDB = {
        phishing: { title: "Схема: Фишинг", img: "images/phishing.jpg.jpg", text: "<p><strong>Механика:</strong> Злоумышленники создают точные копии сайтов банков, почтовых сервисов или магазинов. Жертва вводит логин и пароль, думая, что это официальный ресурс.</p><p><strong>Противодействие:</strong> Внимательно проверяйте доменное имя в адресной строке.</p>" },
        phone: { title: "Схема: Телефонный скам", img: "images/phone_scams.jpg.jpg", text: "<p><strong>Механика:</strong> Звонок от имени службы безопасности банка или МВД. Мошенники создают искусственную панику, требуя срочно перевести деньги.</p><p><strong>Противодействие:</strong> Если вас торопят принять финансовое решение — это атака. Немедленно прервите соединение.</p>" },
        viruses: { title: "Схема: Вредоносное ПО", img: "images/viruses.jpg.jpg", text: "<p><strong>Механика:</strong> Загрузка полезного на первый взгляд приложения, внутри которого скрыт троян для перехвата СМС-кодов авторизации.</p><p><strong>Противодействие:</strong> Запретите установку файлов .APK из сторонних источников.</p>" },
        cards: { title: "Схема: Компрометация карт", img: "images/card_theft.jpg.jpg", text: "<p><strong>Механика:</strong> Установка невидимых накладок (скиммеров) на банкоматы для считывания магнитной полосы и записи ПИН-кода.</p><p><strong>Противодействие:</strong> Прикрывайте клавиатуру рукой при вводе ПИН-кода.</p>" },
        online: { title: "Схема: Сетевые аферы", img: "images/online_scams.jpg.jpg", text: "<p><strong>Механика:</strong> На торговой площадке продавец предлагает перейти в сторонний мессенджер для оформления 'безопасной доставки', скидывая фишинговую ссылку.</p><p><strong>Противодействие:</strong> Никогда не уходите из официального чата площадки.</p>" }
    };

    window.openDetails = (id) => {
        const t = threatDB[id];
        if(!t) return;
        document.getElementById('modal-title-text').innerText = t.title;
        document.getElementById('modal-body-text').innerHTML = `<img src="${t.img}" class="modal-img" alt="${t.title}"><br>${t.text}`;
        document.getElementById('modal-window').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeDetails = (e) => {
        if (!e || e.target.id === 'modal-window' || e.target.closest('.btn-close')) {
            document.getElementById('modal-window').classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    // ПОИСК ПО РЕЕСТРУ УГРОЗ
    const searchInput = document.getElementById('search-input');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('.threat-card').forEach(card => {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(query) ? 'flex' : 'none';
            });
        });
    }

    // === FIREBASE И УВЕДОМЛЕНИЯ ===
    function showAlert(msg) {
        const container = document.getElementById('alert-container');
        const alertBox = document.createElement('div');
        alertBox.className = 'alert-msg';
        alertBox.innerText = `> ${msg}`;
        container.appendChild(alertBox);
        setTimeout(() => alertBox.remove(), 4000);
    }

   // === ДИНАМИЧЕСКАЯ ФОРМА И FIREBASE ===
    const incType = document.getElementById('inc-type');
    const groupPhone = document.getElementById('group-phone');
    const groupSite = document.getElementById('group-site');
    const incPhone = document.getElementById('inc-phone');
    const incUrl = document.getElementById('inc-url');
    const incidentForm = document.getElementById('incident-form');

    // 1. Показываем нужные поля в зависимости от выбора категории
    if(incType) {
        incType.addEventListener('change', (e) => {
            const val = e.target.value;
            
            // Прячем всё
            groupPhone.style.display = 'none';
            groupSite.style.display = 'none';
            incPhone.required = false;
            incUrl.required = false;

            // Показываем нужное
            if (val === 'call') {
                groupPhone.style.display = 'block';
                incPhone.required = true;
            } else if (val === 'site') {
                groupSite.style.display = 'block';
                incUrl.required = true;
            }
        });
    }

    // 2. ЖЕСТКАЯ ЗАЩИТА ТЕЛЕФОНА (блокируем ввод любых букв)
    if(incPhone) {
        incPhone.addEventListener('input', function() {
            // Регулярное выражение: всё, что не цифра - удаляется мгновенно
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

    // 3. Бронебойная отправка формы
    if(incidentForm) {
        incidentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Останавливаем перезагрузку страницы
            
            const type = incType.value;
            const desc = document.getElementById('inc-desc').value;
            let source = '';

            // Собираем источник угрозы (Телефон или Ссылка)
            if (type === 'call') {
                const code = document.getElementById('inc-country-code').value;
                source = `${code} ${incPhone.value}`;
            } else if (type === 'site') {
                source = incUrl.value;
            } else {
                source = 'Иной источник';
            }

            // Отправляем в Firebase (проверяем, что db существует)
            if (typeof window.db !== 'undefined') {
                window.db.collection('reports').add({
                    type: type,
                    source: source,
                    description: desc,
                    timestamp: new Date()
                })
                .then(() => {
                    showAlert('Успешно! Инцидент зафиксирован в базе NetProtect.');
                    incidentForm.reset();
                    groupPhone.style.display = 'none';
                    groupSite.style.display = 'none';
                })
                .catch((err) => {
                    console.error("Ошибка Firebase:", err);
                    showAlert('Ошибка БД: проверьте консоль.');
                });
            } else {
                console.log("Данные для отправки (БД отключена):", {type, source, desc});
                showAlert('ЛОКАЛЬНЫЙ РЕЖИМ: Данные выведены в консоль (Firebase не подключен).');
                incidentForm.reset();
                groupPhone.style.display = 'none';
                groupSite.style.display = 'none';
            }
        });
    }

  // === ГЕНЕРАЦИЯ PDF (Оптимизировано для мобильных) ===
    window.exportPDF = () => {
        showAlert('Формирование протокола PDF. Пожалуйста, подождите...');
        const el = document.getElementById('print-protocol');
        
        // Временно показываем элемент, но прячем за пределами экрана, чтобы не ломать верстку
        el.style.display = 'block';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        
        const opt = {
            margin: 0.5,
            filename: 'Protocol_NetProtect.pdf',
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { scale: 1.5, useCORS: true }, // 1.5 оптимально для телефонов
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(el).save().then(() => {
            el.style.display = 'none';
            el.style.position = 'static';
            showAlert('PDF успешно сохранен!');
        }).catch(err => {
            el.style.display = 'none';
            el.style.position = 'static';
            showAlert('Ошибка скачивания. Попробуйте с компьютера.');
            console.error(err);
        });
    };
    // === ЛОГИКА АВТОРИЗАЦИИ ===
    const authBtn = document.getElementById('auth-btn');
    const authModal = document.getElementById('auth-modal');
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const toggleAuthMode = document.getElementById('toggle-auth-mode');
    const googleAuthBtn = document.getElementById('google-auth-btn');

    let isLoginMode = true;

    // Открыть/Закрыть модалку
    if(authBtn) {
        authBtn.addEventListener('click', () => {
            if (window.auth.currentUser) {
                // Если уже вошли - кнопка работает как "Выход"
                window.auth.signOut().then(() => showAlert('Вы успешно вышли из системы.'));
            } else {
                authModal.classList.add('active');
            }
        });
    }

    window.closeAuthModal = (e) => {
        if (!e || e.target.id === 'auth-modal' || e.target.closest('.btn-close')) {
            authModal.classList.remove('active');
        }
    };

    // Переключение Вход / Регистрация
    if(toggleAuthMode) {
        toggleAuthMode.addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            authTitle.innerText = isLoginMode ? 'Вход в систему' : 'Регистрация';
            authSubmitBtn.innerText = isLoginMode ? 'Войти' : 'Создать аккаунт';
            toggleAuthMode.innerText = isLoginMode ? 'Создать' : 'Войти в аккаунт';
        });
    }

    // Вход и Регистрация по Email/Паролю
    if(authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('auth-email').value;
            const pass = document.getElementById('auth-pass').value;

            if (isLoginMode) {
                window.auth.signInWithEmailAndPassword(email, pass)
                    .then(() => {
                        showAlert('Успешная авторизация!');
                        closeAuthModal();
                    })
                    .catch(err => showAlert('Ошибка входа: ' + err.message));
            } else {
                window.auth.createUserWithEmailAndPassword(email, pass)
                    .then(() => {
                        showAlert('Учетная запись создана!');
                        closeAuthModal();
                    })
                    .catch(err => showAlert('Ошибка регистрации: ' + err.message));
            }
        });
    }

    // Вход через Google
    if(googleAuthBtn) {
        googleAuthBtn.addEventListener('click', () => {
            window.auth.signInWithPopup(window.googleProvider)
                .then((result) => {
                    showAlert(`Привет, ${result.user.displayName}!`);
                    closeAuthModal();
                })
                .catch(err => showAlert('Ошибка Google авторизации: ' + err.message));
        });
    }

    // Отслеживание состояния пользователя (вошел/вышел)
    if(typeof window.auth !== 'undefined') {
        window.auth.onAuthStateChanged(user => {
            if (user) {
                document.body.classList.add('user-logged-in');
                authBtn.innerText = 'Выйти';
            } else {
                document.body.classList.remove('user-logged-in');
                authBtn.innerText = 'Войти';
            }
        });
    }
});
