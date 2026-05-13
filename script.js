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
    
    // ==========================================
    // === ИГРОВОЙ ДВИЖОК И СТАТИСТИКА (NEW) ====
    // ==========================================
    let userStats = {
        maxSimScore: 0,
        auditScore: 0,
        hashesCreated: 0,
        passwordsGenerated: 0,
        threatsViewed: [],
        reportsSent: 0,
        hasSuperPassword: false
    };

    function loadStats(uid) {
        const saved = localStorage.getItem(`np_stats_${uid}`);
        if(saved) userStats = JSON.parse(saved);
        updateDashboardUI();
    }

    function saveStats() {
        if(typeof window.auth !== 'undefined' && window.auth.currentUser) {
            localStorage.setItem(`np_stats_${window.auth.currentUser.uid}`, JSON.stringify(userStats));
            updateDashboardUI();
        }
    }

    function updateDashboardUI() {
        const stSim = document.getElementById('stat-sim');
        const stAudit = document.getElementById('stat-audit');
        const stCrypto = document.getElementById('stat-crypto');
        const stThreats = document.getElementById('stat-threats');

        if(stSim) stSim.innerText = `${userStats.maxSimScore}/10`;
        if(stAudit) stAudit.innerText = `${userStats.auditScore}%`;
        if(stCrypto) stCrypto.innerText = userStats.hashesCreated;
        if(stThreats) stThreats.innerText = `${userStats.threatsViewed.length}/5`;

        const unlock = (id) => {
            const el = document.getElementById(id);
            if(el) el.classList.remove('locked');
        };

        if(userStats.auditScore >= 80) unlock('ach-audit');
        if(userStats.hasSuperPassword) unlock('ach-pass');
        if(userStats.hashesCreated >= 3) unlock('ach-crypto');
        if(userStats.threatsViewed.length >= 5) unlock('ach-detective');
        if(userStats.maxSimScore === 10) unlock('ach-expert');
        if(userStats.reportsSent >= 1) unlock('ach-report');
    }

    // === SPA НАВИГАЦИЯ ===
    window.goToDashboard = () => {
        const mainView = document.getElementById('main-view');
        const dashView = document.getElementById('dashboard-view');
        if(mainView) mainView.classList.add('hidden');
        if(dashView) dashView.classList.remove('hidden');
        
        const userProf = document.getElementById('user-profile');
        if(userProf) userProf.classList.remove('active');
        window.scrollTo(0, 0);

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
                
                loadStats(user.uid);
            }
        }
    };

    window.goToMain = () => {
        const mainView = document.getElementById('main-view');
        const dashView = document.getElementById('dashboard-view');
        if(dashView) dashView.classList.add('hidden');
        if(mainView) mainView.classList.remove('hidden');
    };

    const btnDash = document.getElementById('btn-dashboard');
    if (btnDash) btnDash.addEventListener('click', window.goToDashboard);
    const btnMainLogo = document.getElementById('btn-main-logo');
    if (btnMainLogo) btnMainLogo.addEventListener('click', window.goToMain);
    const btnBackMain = document.getElementById('btn-back-to-main');
    if (btnBackMain) btnBackMain.addEventListener('click', window.goToMain);
    document.querySelectorAll('.nav-go-main').forEach(link => { link.addEventListener('click', window.goToMain); });

    // === МОБИЛЬНОЕ МЕНЮ ===
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            icon.className = navMenu.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });
        document.querySelectorAll('.nav-link, .mobile-report-btn').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }

    // === АВТОРИЗАЦИЯ ОКОШКИ ===
    window.openLogin = () => { document.getElementById('register-modal').classList.remove('active'); document.getElementById('login-modal').classList.add('active'); };
    window.openRegister = () => { document.getElementById('login-modal').classList.remove('active'); document.getElementById('register-modal').classList.add('active'); };
    window.closeAuthModals = (e) => {
        if (!e || e.target.classList.contains('modal-wrapper') || e.target.closest('.btn-close')) {
            document.querySelectorAll('.modal-wrapper').forEach(m => m.classList.remove('active'));
        }
    };
    const authBtnOpen = document.getElementById('auth-btn');
    if(authBtnOpen) authBtnOpen.addEventListener('click', window.openLogin);
    const btnLoginFromForm = document.getElementById('btn-login-from-form');
    if(btnLoginFromForm) btnLoginFromForm.addEventListener('click', window.openLogin);
    const btnOpenReg = document.getElementById('btn-open-register');
    if(btnOpenReg) btnOpenReg.addEventListener('click', window.openRegister);
    const btnOpenLoginFromReg = document.getElementById('btn-open-login-from-reg');
    if(btnOpenLoginFromReg) btnOpenLoginFromReg.addEventListener('click', window.openLogin);

    // === ПРОФИЛЬ И FIREBASE ===
    const userProfile = document.getElementById('user-profile');
    const authBtn = document.getElementById('auth-btn');
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
                document.getElementById('user-name').innerText = displayName;
                document.getElementById('dropdown-email').innerText = user.email;

                const avatar = document.getElementById('user-avatar');
                if(avatar) avatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${displayName.charAt(0).toUpperCase()}&background=10b981&color=fff`;

                document.body.classList.add('user-logged-in');
                loadStats(user.uid);
            } else {
                if(authBtn) authBtn.classList.remove('hidden');
                if(userProfile) { userProfile.classList.add('hidden'); userProfile.classList.remove('active'); }
                if(reportLock) reportLock.classList.remove('hidden');
                if(incidentForm) incidentForm.classList.add('hidden');
                
                document.body.classList.remove('user-logged-in');
                window.goToMain();
            }
        });
    }

    if(userProfile) userProfile.addEventListener('click', (e) => { if(!e.target.closest('.profile-dropdown')) userProfile.classList.toggle('active'); });
    document.addEventListener('click', (e) => { if(userProfile && !userProfile.contains(e.target)) userProfile.classList.remove('active'); });

    document.getElementById('logout-btn').addEventListener('click', () => {
        window.auth.signOut().then(() => { showAlert('Вы успешно вышли из системы.'); userProfile.classList.remove('active'); });
    });

    // ВХОД EMAIL
    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length === 0) { showAlert('Пожалуйста, пройдите проверку на робота!'); return; }
            window.auth.signInWithEmailAndPassword(document.getElementById('login-email').value, document.getElementById('login-pass').value)
                .then(() => { showAlert('С возвращением!'); closeAuthModals(); if(typeof grecaptcha !== 'undefined') grecaptcha.reset(); loginForm.reset(); })
                .catch(err => showAlert('Ошибка входа: ' + err.message));
        });
    }

    // РЕГИСТРАЦИЯ
    const regForm = document.getElementById('register-form');
    if(regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.auth.createUserWithEmailAndPassword(document.getElementById('reg-email').value, document.getElementById('reg-pass').value)
                .then((res) => { res.user.sendEmailVerification(); showAlert('Аккаунт создан! Подтвердите почту.'); closeAuthModals(); regForm.reset(); })
                .catch(err => showAlert('Ошибка регистрации: ' + err.message));
        });
    }

    // GOOGLE
    const googleAuthBtn = document.getElementById('google-auth-btn');
    if(googleAuthBtn) {
        googleAuthBtn.addEventListener('click', () => {
            window.auth.signInWithPopup(window.googleProvider).then((res) => { showAlert(`Привет, ${res.user.displayName}!`); closeAuthModals(); }).catch(err => showAlert('Ошибка Google: ' + err.message));
        });
    }

    // === ИНСТРУМЕНТ 1: АНАЛИЗАТОР ПАРОЛЕЙ ===
    const passInput = document.getElementById('pass-input');
    const passLengthSlider = document.getElementById('pass-length');

    function analyzePassword(pass) {
        const passMeter = document.getElementById('pass-meter');
        const passTime = document.getElementById('pass-time');
        if (!pass) { passMeter.style.width = '0%'; passMeter.style.background = '#ef4444'; passTime.innerText = 'Время взлома: ---'; return; }

        let pool = 0;
        if (/[a-z]/.test(pass)) pool += 26;
        if (/[A-Z]/.test(pass)) pool += 26;
        if (/[0-9]/.test(pass)) pool += 10;
        if (/[^a-zA-Z0-9]/.test(pass)) pool += 32;
        if (pool === 0) pool = 1;
        
        const entropy = pass.length * Math.log2(pool);
        const seconds = Math.pow(2, entropy) / 10000000000;

        let timeStr = '', color = '', width = '';
        if (seconds < 1) { timeStr = 'Мгновенно'; color = '#ef4444'; width = '10%'; }
        else if (seconds < 60) { timeStr = Math.round(seconds) + ' сек.'; color = '#ef4444'; width = '25%'; }
        else if (seconds < 3600) { timeStr = Math.round(seconds/60) + ' мин.'; color = '#f59e0b'; width = '40%'; }
        else if (seconds < 86400) { timeStr = Math.round(seconds/3600) + ' ч.'; color = '#f59e0b'; width = '55%'; }
        else if (seconds < 2592000) { timeStr = Math.round(seconds/86400) + ' дн.'; color = '#f59e0b'; width = '70%'; }
        else if (seconds < 31536000) { timeStr = Math.round(seconds/2592000) + ' мес.'; color = '#10b981'; width = '85%'; }
        else if (seconds < 31536000000) { timeStr = Math.round(seconds/31536000) + ' лет'; color = '#10b981'; width = '95%'; }
        else { timeStr = 'Века (Надежно)'; color = '#10b981'; width = '100%'; }

        if(seconds > 31536000000) { userStats.hasSuperPassword = true; saveStats(); }

        passMeter.style.width = width; passMeter.style.background = color; passTime.innerText = `Время взлома: ${timeStr}`;
    }

    if(passInput) passInput.addEventListener('input', (e) => analyzePassword(e.target.value));
    if(passLengthSlider) { passLengthSlider.addEventListener('input', (e) => { document.getElementById('pass-length-val').innerText = e.target.value; window.generatePass(); }); }

    const btnGeneratePass = document.getElementById('btn-generate-pass');
    if (btnGeneratePass) btnGeneratePass.addEventListener('click', () => window.generatePass());

    window.generatePass = () => {
        const length = passLengthSlider ? parseInt(passLengthSlider.value) : 16;
        const useNum = document.getElementById('pass-num') ? document.getElementById('pass-num').checked : true;
        const useSym = document.getElementById('pass-sym') ? document.getElementById('pass-sym').checked : true;
        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useNum) chars += '0123456789';
        if (useSym) chars += '!@#$%^&*()_+~|}{[]:;?><,./-=';
        let pass = '';
        for (let i = 0; i < length; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length)); 
        
        if(passInput) { passInput.value = pass; analyzePassword(pass); }
        
        userStats.passwordsGenerated++; saveStats();
    };

    // === ИНСТРУМЕНТ 2: SHA-256 ХЭШ ===
    const hashInp = document.getElementById('hash-input');
    if (hashInp) {
        hashInp.addEventListener('input', async (e) => {
            const hashOutput = document.getElementById('hash-output');
            if(e.target.value === '') { hashOutput.innerText = 'Здесь появится криптографический хэш...'; hashOutput.classList.add('text-muted'); hashOutput.style.color = ''; return; }
            const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(e.target.value));
            hashOutput.innerText = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
            hashOutput.classList.remove('text-muted'); hashOutput.style.color = 'var(--neon-accent)';
            
            if(e.target.value.length > 3) { userStats.hashesCreated++; saveStats(); }
        });
    }

    // === АУДИТ УЯЗВИМОСТИ ===
    const checks = document.querySelectorAll('.audit-check');
    function calculateAudit() {
        const scoreDisplay = document.getElementById('audit-score');
        if(!scoreDisplay) return;
        const checkedCount = Array.from(checks).filter(cb => cb.checked).length;
        const percent = Math.round((checkedCount / checks.length) * 100) || 0;
        document.getElementById('audit-score').innerText = percent + '%'; document.getElementById('audit-progress').style.width = percent + '%';
        
        const badge = document.getElementById('audit-status');
        if (percent <= 40) { document.getElementById('audit-progress').style.background = '#ef4444'; badge.innerText = 'КРИТИЧЕСКАЯ УЯЗВИМОСТЬ'; badge.style.color = '#ef4444'; } 
        else if (percent <= 80) { document.getElementById('audit-progress').style.background = '#f59e0b'; badge.innerText = 'БАЗОВЫЙ УРОВЕНЬ ЗАЩИТЫ'; badge.style.color = '#f59e0b'; } 
        else { document.getElementById('audit-progress').style.background = '#10b981'; badge.innerText = 'ВЫСОКИЙ УРОВЕНЬ ЗАЩИТЫ'; badge.style.color = '#10b981'; }

        userStats.auditScore = percent; saveStats();
    }
    checks.forEach(check => check.addEventListener('change', calculateAudit));
    calculateAudit();

    // === СИМУЛЯТОР АТАК ===
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
        { q: "СМС с кодом 2FA, хотя вы никуда не входили.", opts: ["Игнорировать", "Сменить пароль"], correct: 1, exp: "Кто-то уже знает ваш пароль и пытается войти." }
    ];

    let currentSimData = []; let simIndex = 0; let simScore = 0;
    const simFeedback = document.getElementById('sim-feedback');
    const simActions = document.getElementById('sim-actions'); 
    
    const bNext = document.getElementById('btn-next'); if(bNext) bNext.addEventListener('click', () => window.nextScenario());
    const bRest = document.getElementById('btn-restart'); if(bRest) bRest.addEventListener('click', () => window.resetSimulator());
    const o0 = document.getElementById('opt-0'); if(o0) o0.addEventListener('click', () => window.processAnswer(0));
    const o1 = document.getElementById('opt-1'); if(o1) o1.addEventListener('click', () => window.processAnswer(1));

    function initSimulator() {
        currentSimData = allSimData.sort(() => 0.5 - Math.random()).slice(0, 10);
        simIndex = 0; simScore = 0;
        const br = document.getElementById('btn-restart'); if(br) br.classList.add('hidden');
        const bn = document.getElementById('btn-next'); if(bn) bn.classList.remove('hidden');
        renderScenario();
    }

    function renderScenario() {
        const sq = document.getElementById('sim-question'); if(!sq) return;
        const s = currentSimData[simIndex];
        document.getElementById('sim-counter').innerText = `Сценарий ${simIndex + 1} / 10`; 
        sq.innerText = s.q;
        document.getElementById('opt-0').innerText = s.opts[0]; document.getElementById('opt-1').innerText = s.opts[1];
        document.getElementById('sim-options').classList.remove('hidden'); simFeedback.classList.add('hidden'); simActions.classList.add('hidden');
    }

    window.processAnswer = (idx) => {
        const isCorrect = (idx === currentSimData[simIndex].correct);
        if (isCorrect) simScore++;
        document.getElementById('sim-options').classList.add('hidden'); simFeedback.classList.remove('hidden');
        simFeedback.className = `sim-feedback ${isCorrect ? 'feed-correct' : 'feed-wrong'}`;
        simFeedback.innerHTML = `<strong>${isCorrect ? 'Верное решение.' : 'Критическая ошибка.'}</strong><br>${currentSimData[simIndex].exp}`;
        simActions.classList.remove('hidden');
    };

    window.nextScenario = () => {
        simIndex++;
        if (simIndex < currentSimData.length) { renderScenario(); } 
        else {
            document.getElementById('sim-counter').innerText = "Анализ завершен";
            document.getElementById('sim-question').innerText = `Эффективность защиты: ${simScore} из 10.`;
            simFeedback.classList.add('hidden'); document.getElementById('btn-next').classList.add('hidden'); document.getElementById('btn-restart').classList.remove('hidden');
            if (simScore > userStats.maxSimScore) { userStats.maxSimScore = simScore; saveStats(); }
        }
    };
    window.resetSimulator = () => { initSimulator(); };
    if(document.getElementById('sim-question')) initSimulator();

    // === БАЗА УГРОЗ ===
    window.openDetails = (id) => {
        const threatDB = {
            phishing: { title: "Схема: Фишинг", img: "images/phishing.jpg.jpg", text: "<p><strong>Механика:</strong> Злоумышленники создают точные копии сайтов банков.</p>" },
            phone: { title: "Схема: Телефонный скам", img: "images/phone_scams.jpg.jpg", text: "<p><strong>Механика:</strong> Звонок от имени службы безопасности.</p>" },
            viruses: { title: "Схема: Вредоносное ПО", img: "images/viruses.jpg.jpg", text: "<p><strong>Механика:</strong> Троян для перехвата СМС-кодов.</p>" },
            cards: { title: "Схема: Компрометация карт", img: "images/card_theft.jpg.jpg", text: "<p><strong>Механика:</strong> Скиммеры на банкоматах.</p>" },
            online: { title: "Схема: Сетевые аферы", img: "images/online_scams.jpg.jpg", text: "<p><strong>Механика:</strong> Переход в сторонний мессенджер для доставки.</p>" }
        };
        const t = threatDB[id]; if(!t) return;
        document.getElementById('modal-title-text').innerText = t.title;
        document.getElementById('modal-body-text').innerHTML = `<img src="${t.img}" class="modal-img"><br>${t.text}`;
        document.getElementById('modal-window').classList.add('active'); document.body.style.overflow = 'hidden';

        if(!userStats.threatsViewed.includes(id)) { userStats.threatsViewed.push(id); saveStats(); }
    };
    window.closeDetails = (e) => { if (!e || e.target.id === 'modal-window' || e.target.closest('.btn-close')) { document.getElementById('modal-window').classList.remove('active'); document.body.style.overflow = 'auto'; } };
    const sInput = document.getElementById('search-input');
    if(sInput) sInput.addEventListener('input', (e) => { const query = e.target.value.toLowerCase(); document.querySelectorAll('.threat-card').forEach(card => { card.style.display = card.innerText.toLowerCase().includes(query) ? 'flex' : 'none'; }); });

    // === ФОРМА ИНЦИДЕНТА ===
    const incType = document.getElementById('inc-type');
    if(incType) {
        incType.addEventListener('change', (e) => {
            document.getElementById('group-phone').style.display = e.target.value === 'call' ? 'block' : 'none';
            document.getElementById('group-site').style.display = e.target.value === 'site' ? 'block' : 'none';
        });
    }
    const iPh = document.getElementById('inc-phone');
    if(iPh) iPh.addEventListener('input', function() { this.value = this.value.replace(/[^0-9]/g, ''); });

    if(incidentForm) {
        incidentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('inc-type').value; const desc = document.getElementById('inc-desc').value; let source = '';
            if (type === 'call') source = `${document.getElementById('inc-country-code').value} ${document.getElementById('inc-phone').value}`; else if (type === 'site') source = document.getElementById('inc-url').value; else source = 'Иной источник';

            if (typeof window.db !== 'undefined') {
                window.db.collection('reports').add({ type, source, description: desc, timestamp: new Date() })
                .then(() => { 
                    showAlert('Успешно! Инцидент зафиксирован.'); incidentForm.reset(); 
                    userStats.reportsSent++; saveStats();
                }).catch((err) => showAlert('Ошибка БД: ' + err.message));
            }
        });
    }

    // === PDF ГЕНЕРАЦИЯ ===
    window.exportPDF = () => {
        showAlert('Формирование протокола PDF...');
        const el = document.getElementById('print-protocol'); el.style.display = 'block'; el.style.position = 'absolute'; el.style.left = '-9999px';
        html2pdf().set({ margin: 0.5, filename: 'Protocol.pdf', html2canvas: { scale: 1.5, useCORS: true } }).from(el).save().then(() => { el.style.display = 'none'; el.style.position = 'static'; showAlert('PDF сохранен!'); });
    };
});
