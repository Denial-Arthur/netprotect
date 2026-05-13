document.addEventListener('DOMContentLoaded', () => {

    // === УВЕДОМЛЕНИЯ (ТОСТЫ) ===
    window.showAlert = (msg) => {
        const container = document.getElementById('alert-container');
        if(!container) return;
        const alertBox = document.createElement('div');
        alertBox.className = 'alert-msg';
        alertBox.innerText = `> ${msg}`;
        container.appendChild(alertBox);
        setTimeout(() => alertBox.remove(), 4000);
    }
    
    // === SPA НАВИГАЦИЯ (ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ) ===
    window.goToDashboard = () => {
        const mainView = document.getElementById('main-view');
        const dashView = document.getElementById('dashboard-view');
        if(mainView) mainView.classList.add('hidden');
        if(dashView) dashView.classList.remove('hidden');
        
        const userProf = document.getElementById('user-profile');
        if(userProf) userProf.classList.remove('active');
        window.scrollTo(0, 0);

        // Загружаем данные пользователя в карточку
        if(typeof window.auth !== 'undefined') {
            const user = window.auth.currentUser;
            if(user) {
                const dashName = document.getElementById('dash-name');
                const dashEmail = document.getElementById('dash-email');
                const dashAvatar = document.getElementById('dash-avatar');
                const userAvatar = document.getElementById('user-avatar');
                
                if(dashName) dashName.innerText = user.displayName || user.email.split('@')[0];
                if(dashEmail) dashEmail.innerText = user.email;
                if(dashAvatar && userAvatar) dashAvatar.src = userAvatar.src;
            }
        }
    };

    window.goToMain = () => {
        const mainView = document.getElementById('main-view');
        const dashView = document.getElementById('dashboard-view');
        if(dashView) dashView.classList.add('hidden');
        if(mainView) mainView.classList.remove('hidden');
    };

    // Надежная привязка кнопок перехода
    const btnDash = document.getElementById('btn-dashboard');
    if (btnDash) btnDash.addEventListener('click', window.goToDashboard);
    
    const btnMainLogo = document.getElementById('btn-main-logo');
    if (btnMainLogo) btnMainLogo.addEventListener('click', window.goToMain);
    
    const btnBackMain = document.getElementById('btn-back-to-main');
    if (btnBackMain) btnBackMain.addEventListener('click', window.goToMain);

    document.querySelectorAll('.nav-go-main').forEach(link => {
        link.addEventListener('click', window.goToMain);
    });

    // === МОБИЛЬНОЕ МЕНЮ (БУРГЕР) ===
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
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

        document.querySelectorAll('.nav-link, .mobile-report-btn').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
            });
        });
    }

    // === АВТОРИЗАЦИЯ: ДВА ОКНА ===
    window.openLogin = () => {
        document.getElementById('register-modal').classList.remove('active');
        document.getElementById('login-modal').classList.add('active');
    };
    
    window.openRegister = () => {
        document.getElementById('login-modal').classList.remove('active');
        document.getElementById('register-modal').classList.add('active');
    };
    
    window.closeAuthModals = (e) => {
        if (!e || e.target.classList.contains('modal-wrapper') || e.target.closest('.btn-close')) {
            document.querySelectorAll('.modal-wrapper').forEach(m => m.classList.remove('active'));
        }
    };

    const authBtnOpen = document.getElementById('auth-btn');
    if(authBtnOpen) authBtnOpen.addEventListener('click', window.openLogin);

    // === ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ И ЗАМОК ФОРМЫ ===
    const userProfile = document.getElementById('user-profile');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const dropdownEmail = document.getElementById('dropdown-email');
    const authBtn = document.getElementById('auth-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const reportLock = document.getElementById('report-lock');
    const incidentForm = document.getElementById('incident-form');

    if(typeof window.auth !== 'undefined') {
        window.auth.onAuthStateChanged(user => {
            if (user) {
                if(authBtn) authBtn.classList.add('hidden');
                if(userProfile) userProfile.classList.remove('hidden');
                
                if(reportLock) reportLock.classList.add('hidden');
                if(incidentForm) incidentForm.classList.remove('hidden');

                const displayName = user.displayName || user.email.split('@')[0];
                if(userName) userName.innerText = displayName;
                if(dropdownEmail) dropdownEmail.innerText = user.email;

                if(userAvatar) {
                    if (user.photoURL) {
                        userAvatar.src = user.photoURL;
                    } else {
                        const initial = displayName.charAt(0).toUpperCase();
                        userAvatar.src = `https://ui-avatars.com/api/?name=${initial}&background=10b981&color=fff`;
                    }
                }

                document.body.classList.add('user-logged-in');
            } else {
                if(authBtn) authBtn.classList.remove('hidden');
                if(userProfile) {
                    userProfile.classList.add('hidden');
                    userProfile.classList.remove('active');
                }
                
                if(reportLock) reportLock.classList.remove('hidden');
                if(incidentForm) incidentForm.classList.add('hidden');
                
                document.body.classList.remove('user-logged-in');
                window.goToMain();
            }
        });
    }

    if(userProfile) {
        userProfile.addEventListener('click', (e) => {
            if(!e.target.closest('.profile-dropdown')) {
                userProfile.classList.toggle('active');
            }
        });
    }

    document.addEventListener('click', (e) => {
        if(userProfile && !userProfile.contains(e.target)) {
            userProfile.classList.remove('active');
        }
    });

    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.auth.signOut().then(() => {
                showAlert('Вы успешно вышли из системы.');
                userProfile.classList.remove('active');
            });
        });
    }

    // === ЛОГИН С КАПЧЕЙ ===
    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if(typeof grecaptcha !== 'undefined') {
                const response = grecaptcha.getResponse();
                if(response.length === 0) {
                    showAlert('Пожалуйста, пройдите проверку на робота!');
                    return;
                }
            }

            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-pass').value;

            window.auth.signInWithEmailAndPassword(email, pass)
                .then(() => {
                    showAlert('С возвращением!');
                    closeAuthModals();
                    if(typeof grecaptcha !== 'undefined') grecaptcha.reset();
                    loginForm.reset();
                })
                .catch(err => showAlert('Ошибка входа: ' + err.message));
        });
    }

    // === РЕГИСТРАЦИЯ ===
    const regForm = document.getElementById('register-form');
    if(regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('reg-email').value;
            const pass = document.getElementById('reg-pass').value;

            window.auth.createUserWithEmailAndPassword(email, pass)
                .then((userCredential) => {
                    userCredential.user.sendEmailVerification();
                    showAlert('Аккаунт создан! Подтвердите почту (письмо отправлено).');
                    closeAuthModals();
                    regForm.reset();
                })
                .catch(err => showAlert('Ошибка регистрации: ' + err.message));
        });
    }

    // === ВХОД ЧЕРЕЗ GOOGLE ===
    const googleAuthBtn = document.getElementById('google-auth-btn');
    if(googleAuthBtn) {
        googleAuthBtn.addEventListener('click', () => {
            window.auth.signInWithPopup(window.googleProvider)
                .then((result) => {
                    showAlert(`Привет, ${result.user.displayName}!`);
                    closeAuthModals();
                })
                .catch(err => showAlert('Ошибка Google: ' + err.message));
        });
    }

    // === ПРОДВИНУТЫЙ АНАЛИЗАТОР ПАРОЛЕЙ (МАТЕМАТИКА ЭНТРОПИИ) ===
    const passInput = document.getElementById('pass-input');
    const passMeter = document.getElementById('pass-meter');
    const passTime = document.getElementById('pass-time');
    const passLengthSlider = document.getElementById('pass-length');
    const passLengthVal = document.getElementById('pass-length-val');
    const btnGeneratePass = document.getElementById('btn-generate-pass');

    function analyzePassword(pass) {
        if (!pass) {
            passMeter.style.width = '0%';
            passMeter.style.background = '#ef4444';
            passTime.innerText = 'Время взлома: ---';
            return;
        }

        // Вычисляем размер алфавита символов
        let pool = 0;
        if (/[a-z]/.test(pass)) pool += 26; // строчные
        if (/[A-Z]/.test(pass)) pool += 26; // заглавные
        if (/[0-9]/.test(pass)) pool += 10; // цифры
        if (/[^a-zA-Z0-9]/.test(pass)) pool += 32; // спецсимволы

        if (pool === 0) pool = 1;
        
        // Математика энтропии: L * log2(R)
        const entropy = pass.length * Math.log2(pool);
        
        // Допустим, скорость перебора = 10 миллиардов паролей в секунду
        const guesses = Math.pow(2, entropy);
        const seconds = guesses / 10000000000;

        let timeStr = '', color = '', width = '';

        if (seconds < 1) { timeStr = 'Мгновенно'; color = '#ef4444'; width = '10%'; }
        else if (seconds < 60) { timeStr = Math.round(seconds) + ' сек.'; color = '#ef4444'; width = '25%'; }
        else if (seconds < 3600) { timeStr = Math.round(seconds/60) + ' мин.'; color = '#f59e0b'; width = '40%'; }
        else if (seconds < 86400) { timeStr = Math.round(seconds/3600) + ' ч.'; color = '#f59e0b'; width = '55%'; }
        else if (seconds < 2592000) { timeStr = Math.round(seconds/86400) + ' дн.'; color = '#f59e0b'; width = '70%'; }
        else if (seconds < 31536000) { timeStr = Math.round(seconds/2592000) + ' мес.'; color = '#10b981'; width = '85%'; }
        else if (seconds < 31536000000) { timeStr = Math.round(seconds/31536000) + ' лет'; color = '#10b981'; width = '95%'; }
        else { timeStr = 'Века (Надежно)'; color = '#10b981'; width = '100%'; }

        passMeter.style.width = width;
        passMeter.style.background = color;
        passTime.innerText = `Время взлома: ${timeStr}`;
    }

    if(passInput) passInput.addEventListener('input', (e) => analyzePassword(e.target.value));

    if(passLengthSlider) {
        passLengthSlider.addEventListener('input', (e) => {
            if(passLengthVal) passLengthVal.innerText = e.target.value;
            window.generatePass();
        });
    }

    if (btnGeneratePass) btnGeneratePass.addEventListener('click', () => window.generatePass());

    window.generatePass = () => {
        const length = passLengthSlider ? parseInt(passLengthSlider.value) : 16;
        const useNum = document.getElementById('pass-num') ? document.getElementById('pass-num').checked : true;
        const useSym = document.getElementById('pass-sym') ? document.getElementById('pass-sym').checked : true;

        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useNum) chars += '0123456789';
        if (useSym) chars += '!@#$%^&*()_+~|}{[]:;?><,./-=';

        let pass = '';
        for (let i = 0; i < length; i++) { 
            pass += chars.charAt(Math.floor(Math.random() * chars.length)); 
        }
        
        if(passInput) { 
            passInput.value = pass; 
            analyzePassword(pass); 
        }
    };

    // === ИНСТРУМЕНТ 2: SHA-256 ХЭШ ===
    const hashInput = document.getElementById('hash-input');
    const hashOutput = document.getElementById('hash-output');

    async function generateHash(text) {
        if(!hashOutput) return;
        if(text === '') { 
            hashOutput.innerText = 'Здесь появится криптографический хэш...';
            hashOutput.classList.add('text-muted'); hashOutput.style.color = ''; return; 
        }
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        hashOutput.innerText = hashHex; 
        hashOutput.classList.remove('text-muted'); hashOutput.style.color = 'var(--neon-accent)';
    }
    if(hashInput) hashInput.addEventListener('input', (e) => generateHash(e.target.value));

    // === АУДИТ УЯЗВИМОСТИ ===
    const checks = document.querySelectorAll('.audit-check');
    const scoreDisplay = document.getElementById('audit-score');
    const progressBar = document.getElementById('audit-progress');
    const statusBadge = document.getElementById('audit-status');
    const statusText = document.getElementById('audit-text');

    function calculateAudit() {
        if(!scoreDisplay) return;
        const checkedCount = Array.from(checks).filter(cb => cb.checked).length;
        const percent = Math.round((checkedCount / checks.length) * 100) || 0;
        
        scoreDisplay.innerText = percent + '%'; progressBar.style.width = percent + '%';

        if (percent <= 40) {
            progressBar.style.background = '#ef4444'; statusBadge.innerText = 'КРИТИЧЕСКАЯ УЯЗВИМОСТЬ';
            statusBadge.style.color = '#ef4444'; statusBadge.style.borderColor = 'rgba(239, 68, 68, 0.3)'; statusBadge.style.background = 'rgba(239, 68, 68, 0.1)';
            statusText.innerText = 'Ваши данные могут быть скомпрометированы при первой целенаправленной атаке.';
        } else if (percent <= 80) {
            progressBar.style.background = '#f59e0b'; statusBadge.innerText = 'БАЗОВЫЙ УРОВЕНЬ ЗАЩИТЫ';
            statusBadge.style.color = '#f59e0b'; statusBadge.style.borderColor = 'rgba(245, 158, 11, 0.3)'; statusBadge.style.background = 'rgba(245, 158, 11, 0.1)';
            statusText.innerText = 'Вы защищены от автоматических угроз, но социальная инженерия может сработать.';
        } else {
            progressBar.style.background = '#10b981'; statusBadge.innerText = 'ВЫСОКИЙ УРОВЕНЬ ЗАЩИТЫ';
            statusBadge.style.color = '#10b981'; statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)'; statusBadge.style.background = 'rgba(16, 185, 129, 0.1)';
            statusText.innerText = 'Система защиты настроена корректно. Риск компрометации минимален.';
        }
    }
    checks.forEach(check => check.addEventListener('change', calculateAudit));
    calculateAudit();

    // === СИМУЛЯТОР АТАК (РАСШИРЕННЫЙ ПУЛ + РАНДОМ) ===
    const allSimData = [
        { q: "СМС от банка: «Карта заблокирована. Подтвердите данные по ссылке...»", opts: ["Перейти по ссылке", "Позвонить в банк"], correct: 1, exp: "Банки никогда не присылают ссылки для разблокировки." },
        { q: "Звонок от следователя: 'Ваш родственник попал в ДТП, нужны деньги'.", opts: ["Перевести деньги", "Сбросить звонок"], correct: 1, exp: "Схема психологического давления." },
        { q: "Друг просит перевести 5000 рублей до завтра в мессенджере.", opts: ["Перевести", "Позвонить лично"], correct: 1, exp: "Аккаунт скорее всего взломан." },
        { q: "Реклама обещает 500% прибыли за месяц от инвестиций.", opts: ["Вложить", "Проигнорировать"], correct: 1, exp: "Гарантия сверхприбыли — скам." },
        { q: "Письмо от 'Госуслуг' о выплате 100 000 рублей.", opts: ["Ввести карту", "Зайти на сайт"], correct: 1, exp: "Фишинг под госпорталы." },
        { q: "Сотрудник просит код из СМС, чтобы 'отменить перевод'.", opts: ["Назвать код", "Сбросить звонок"], correct: 1, exp: "Код из СМС — ваша подпись." },
        { q: "Вы нашли флешку на улице.", opts: ["Вставить в ПК", "Оставить"], correct: 1, exp: "Флешки-приманки заражают ПК." },
        { q: "Фонарик просит доступ к СМС.", opts: ["Разрешить", "Запретить"], correct: 1, exp: "Так воруют коды банков." },
        { q: "Звонок из 'банка' через WhatsApp.", opts: ["Ответить", "Положить трубку"], correct: 1, exp: "Банки не звонят в мессенджеры." },
        { q: "Бонусы в игре за ввод данных карты.", opts: ["Ввести", "Закрыть"], correct: 1, exp: "Кража данных карты." },
        { q: "Открытая сеть Wi-Fi 'Free_Cafe' без пароля.", opts: ["Подключиться", "Использовать 4G"], correct: 1, exp: "Через открытый Wi-Fi легко перехватить трафик." },
        { q: "Всплывающее окно: 'Ваш ПК заражен вирусом! Скачайте антивирус'.", opts: ["Скачать", "Закрыть вкладку"], correct: 1, exp: "Это и есть вирус. Браузер не может сканировать систему." },
        { q: "Неизвестный прислал вам ссылку на фото в ВК.", opts: ["Кликнуть", "Уточнить, что это"], correct: 1, exp: "Ссылка может вести на фишинговый сайт." },
        { q: "Магазин просит фото паспорта для оформления скидки.", opts: ["Отправить", "Отказаться"], correct: 1, exp: "Ваши данные могут продать в Даркнете." },
        { q: "СМС с кодом 2FA, хотя вы никуда не входили.", opts: ["Игнорировать", "Сменить пароль"], correct: 1, exp: "Кто-то уже знает ваш пароль и пытается войти." },
        { q: "Сайт банка выглядит так: http://sber-bank-online.ru", opts: ["Войти", "Закрыть"], correct: 1, exp: "Нет сертификата HTTPS и домен поддельный." },
        { q: "На почту пришел счет за покупку, которую вы не делали (файл .exe).", opts: ["Открыть счет", "Удалить письмо"], correct: 1, exp: "Формат .exe — это исполняемый файл с вирусом." },
        { q: "Начальник в Telegram срочно просит купить подарочные карты.", opts: ["Купить", "Позвонить ему"], correct: 1, exp: "Классический скам с фейковыми аккаунтами боссов." },
        { q: "Приложение 'Калькулятор' запрашивает доступ к контактам.", opts: ["Разрешить", "Запретить"], correct: 1, exp: "Калькулятору не нужны ваши контакты." },
        { q: "Вам предлагают работу тестировщиком, но нужно оплатить 'регистрацию'.", opts: ["Оплатить", "Заблокировать"], correct: 1, exp: "Работодатели платят вам, а не вы им." }
    ];

    let currentSimData = [];
    let simIndex = 0; let simScore = 0;
    
    const simCounter = document.getElementById('sim-counter');
    const simQuestion = document.getElementById('sim-question');
    const opt0 = document.getElementById('opt-0'); const opt1 = document.getElementById('opt-1');
    const simOptions = document.getElementById('sim-options'); const simFeedback = document.getElementById('sim-feedback');
    const simActions = document.getElementById('sim-actions'); 
    
    const btnNext = document.getElementById('btn-next'); 
    if(btnNext) btnNext.addEventListener('click', () => window.nextScenario());
    
    const btnRestart = document.getElementById('btn-restart');
    if(btnRestart) btnRestart.addEventListener('click', () => window.resetSimulator());

    if(opt0) opt0.addEventListener('click', () => window.processAnswer(0));
    if(opt1) opt1.addEventListener('click', () => window.processAnswer(1));

    function initSimulator() {
        // Перетасовываем массив и берем 10 случайных
        currentSimData = allSimData.sort(() => 0.5 - Math.random()).slice(0, 10);
        simIndex = 0; 
        simScore = 0;
        if(btnRestart) btnRestart.classList.add('hidden');
        if(btnNext) btnNext.classList.remove('hidden');
        renderScenario();
    }

    function renderScenario() {
        if(!simQuestion || !opt0 || !opt1) return;
        const s = currentSimData[simIndex];
        simCounter.innerText = `Сценарий ${simIndex + 1} / 10`; 
        simQuestion.innerText = s.q;
        opt0.innerText = s.opts[0]; 
        opt1.innerText = s.opts[1];
        simOptions.classList.remove('hidden'); 
        simFeedback.classList.add('hidden'); 
        simActions.classList.add('hidden');
    }

    window.processAnswer = (idx) => {
        const s = currentSimData[simIndex];
        const isCorrect = (idx === s.correct);
        if (isCorrect) simScore++;
        simOptions.classList.add('hidden'); 
        simFeedback.classList.remove('hidden');
        simFeedback.className = `sim-feedback ${isCorrect ? 'feed-correct' : 'feed-wrong'}`;
        simFeedback.innerHTML = `<strong>${isCorrect ? 'Верное решение.' : 'Критическая ошибка.'}</strong><br>${s.exp}`;
        simActions.classList.remove('hidden');
    };

    window.nextScenario = () => {
        simIndex++;
        if (simIndex < currentSimData.length) { 
            renderScenario(); 
        } else {
            simCounter.innerText = "Анализ завершен";
            simQuestion.innerText = `Эффективность защиты: ${simScore} из 10.`;
            simFeedback.classList.add('hidden'); 
            btnNext.classList.add('hidden'); 
            btnRestart.classList.remove('hidden');
        }
    };

    window.resetSimulator = () => { initSimulator(); };
    
    // Запускаем симулятор при старте
    if(simQuestion) initSimulator();

    // === БАЗА УГРОЗ ===
    const threatDB = {
        phishing: { title: "Схема: Фишинг", img: "images/phishing.jpg.jpg", text: "<p><strong>Механика:</strong> Злоумышленники создают точные копии сайтов банков. Жертва вводит логин и пароль.</p><p><strong>Защита:</strong> Проверяйте доменное имя.</p>" },
        phone: { title: "Схема: Телефонный скам", img: "images/phone_scams.jpg.jpg", text: "<p><strong>Механика:</strong> Звонок от имени службы безопасности. Паника, требование перевести деньги.</p><p><strong>Защита:</strong> Немедленно прервите соединение.</p>" },
        viruses: { title: "Схема: Вредоносное ПО", img: "images/viruses.jpg.jpg", text: "<p><strong>Механика:</strong> Троян для перехвата СМС-кодов.</p><p><strong>Защита:</strong> Запретите файлы .APK из сети.</p>" },
        cards: { title: "Схема: Компрометация карт", img: "images/card_theft.jpg.jpg", text: "<p><strong>Механика:</strong> Скиммеры на банкоматах.</p><p><strong>Защита:</strong> Прикрывайте клавиатуру при вводе ПИН-кода.</p>" },
        online: { title: "Схема: Сетевые аферы", img: "images/online_scams.jpg.jpg", text: "<p><strong>Механика:</strong> Переход в сторонний мессенджер для доставки.</p><p><strong>Защита:</strong> Не уходите из официального чата.</p>" }
    };

    window.openDetails = (id) => {
        const t = threatDB[id]; if(!t) return;
        document.getElementById('modal-title-text').innerText = t.title;
        document.getElementById('modal-body-text').innerHTML = `<img src="${t.img}" class="modal-img" alt="${t.title}"><br>${t.text}`;
        document.getElementById('modal-window').classList.add('active'); document.body.style.overflow = 'hidden';
    };

    window.closeDetails = (e) => {
        if (!e || e.target.id === 'modal-window' || e.target.closest('.btn-close')) { 
            document.getElementById('modal-window').classList.remove('active'); document.body.style.overflow = 'auto'; 
        }
    };
    
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

    // === ФОРМА ИНЦИДЕНТА ===
    const incType = document.getElementById('inc-type');
    const groupPhone = document.getElementById('group-phone'); const groupSite = document.getElementById('group-site');
    const incPhone = document.getElementById('inc-phone'); const incUrl = document.getElementById('inc-url');

    if(incType) {
        incType.addEventListener('change', (e) => {
            const val = e.target.value;
            groupPhone.style.display = 'none'; groupSite.style.display = 'none';
            incPhone.required = false; incUrl.required = false;
            if (val === 'call') { groupPhone.style.display = 'block'; incPhone.required = true; } 
            else if (val === 'site') { groupSite.style.display = 'block'; incUrl.required = true; }
        });
    }

    if(incPhone) incPhone.addEventListener('input', function() { this.value = this.value.replace(/[^0-9]/g, ''); });

    if(incidentForm) {
        incidentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = incType.value; const desc = document.getElementById('inc-desc').value; let source = '';
            
            if (type === 'call') source = `${document.getElementById('inc-country-code').value} ${incPhone.value}`;
            else if (type === 'site') source = incUrl.value;
            else source = 'Иной источник';

            if (typeof window.db !== 'undefined') {
                window.db.collection('reports').add({ type, source, description: desc, timestamp: new Date() })
                .then(() => { showAlert('Успешно! Инцидент зафиксирован.'); incidentForm.reset(); groupPhone.style.display = 'none'; groupSite.style.display = 'none'; })
                .catch((err) => showAlert('Ошибка БД: ' + err.message));
            } else {
                showAlert('ЛОКАЛЬНЫЙ РЕЖИМ (БД отключена).'); incidentForm.reset();
            }
        });
    }

    // === PDF ГЕНЕРАЦИЯ ===
    window.exportPDF = () => {
        showAlert('Формирование протокола PDF...');
        const el = document.getElementById('print-protocol');
        el.style.display = 'block'; el.style.position = 'absolute'; el.style.left = '-9999px';
        const opt = { margin: 0.5, filename: 'Protocol_NetProtect.pdf', image: { type: 'jpeg', quality: 0.95 }, html2canvas: { scale: 1.5, useCORS: true }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
        html2pdf().set(opt).from(el).save().then(() => { el.style.display = 'none'; el.style.position = 'static'; showAlert('PDF сохранен!'); });
    };
});
