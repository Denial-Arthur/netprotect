document.addEventListener('DOMContentLoaded', () => {

    // === УВЕДОМЛЕНИЯ (ТОСТЫ) ===
    function showAlert(msg) {
        const container = document.getElementById('alert-container');
        if(!container) return;
        const alertBox = document.createElement('div');
        alertBox.className = 'alert-msg';
        alertBox.innerText = `> ${msg}`;
        container.appendChild(alertBox);
        setTimeout(() => alertBox.remove(), 4000);
    }

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

        // Закрываем меню при клике на любую ссылку
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
                // ПОЛЬЗОВАТЕЛЬ ВОШЕЛ В СИСТЕМУ
                if(authBtn) authBtn.classList.add('hidden');
                if(userProfile) userProfile.classList.remove('hidden');
                
                // Открываем форму для жалоб
                if(reportLock) reportLock.classList.add('hidden');
                if(incidentForm) incidentForm.classList.remove('hidden');

                // Ставим имя (из Google или генерируем из почты)
                const displayName = user.displayName || user.email.split('@')[0];
                if(userName) userName.innerText = displayName;
                if(dropdownEmail) dropdownEmail.innerText = user.email;

                // Ставим аватарку (из Google или генерируем картинку по первой букве)
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
                // ПОЛЬЗОВАТЕЛЬ — ГОСТЬ
                if(authBtn) authBtn.classList.remove('hidden');
                if(userProfile) {
                    userProfile.classList.add('hidden');
                    userProfile.classList.remove('active');
                }
                
                // Закрываем форму жалоб замком
                if(reportLock) reportLock.classList.remove('hidden');
                if(incidentForm) incidentForm.classList.add('hidden');
                
                document.body.classList.remove('user-logged-in');
            }
        });
    }

    // Логика выпадающего меню профиля (Dropdown)
    if(userProfile) {
        userProfile.addEventListener('click', (e) => {
            if(!e.target.closest('.profile-dropdown')) {
                userProfile.classList.toggle('active');
            }
        });
    }

    // Закрытие меню при клике в пустое место
    document.addEventListener('click', (e) => {
        if(userProfile && !userProfile.contains(e.target)) {
            userProfile.classList.remove('active');
        }
    });

    // Кнопка выхода из системы
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
            
            // Проверка Google reCAPTCHA
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

    // === ИНСТРУМЕНТ 1: АНАЛИЗАТОР ПАРОЛЕЙ ===
    const passInput = document.getElementById('pass-input');
    const passMeter = document.getElementById('pass-meter');
    const passTime = document.getElementById('pass-time');

    function analyzePassword(pass) {
        const len = pass.length;
        if(len === 0) {
            passMeter.style.width = '0%'; passMeter.style.background = '#ef4444'; passTime.innerText = 'Время взлома: ---'; return;
        }
        let timeStr = ''; let color = ''; let width = '';
        if (len < 6) { timeStr = 'Мгновенно'; color = '#ef4444'; width = '10%'; }
        else if (len < 8) { timeStr = '3 минуты'; color = '#f59e0b'; width = '40%'; }
        else if (len < 10) { timeStr = '2 дня'; color = '#f59e0b'; width = '60%'; }
        else if (len < 12) { timeStr = '14 лет'; color = '#10b981'; width = '85%'; }
        else { timeStr = '400+ лет'; color = '#10b981'; width = '100%'; }
        
        // Усложняем, если есть спецсимволы
        if (/[!@#$%^&*()]/.test(pass) && len >= 10) { timeStr = '10 000+ лет'; width = '100%'; color = '#10b981'; }
        
        passMeter.style.width = width; passMeter.style.background = color; passTime.innerText = `Время взлома: ${timeStr}`;
    }
    if(passInput) passInput.addEventListener('input', (e) => analyzePassword(e.target.value));

    window.generatePass = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        let pass = '';
        for (let i = 0; i < 16; i++) { pass += chars.charAt(Math.floor(Math.random() * chars.length)); }
        if(passInput) { passInput.value = pass; analyzePassword(pass); }
    };

    // === ИНСТРУМЕНТ 2: SHA-256 ХЭШ ===
    const hashInput = document.getElementById('hash-input');
    const hashOutput = document.getElementById('hash-output');
    
    async function generateHash(text) {
        if(!hashOutput) return;
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
        
        scoreDisplay.innerText = percent + '%'; 
        progressBar.style.width = percent + '%';
        
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

    // === СИМУЛЯТОР АТАК ===
    const simData = [
        { q: "СМС от банка: «Карта заблокирована. Подтвердите данные по ссылке...»", opts: ["Перейти по ссылке", "Позвонить в банк"], correct: 1, exp: "Банки никогда не присылают ссылки для разблокировки." },
        { q: "Звонок от следователя: 'Ваш родственник попал в ДТП, нужны деньги'.", opts: ["Перевести деньги", "Сбросить звонок"], correct: 1, exp: "Схема психологического давления." },
        { q: "Друг просит перевести 5000 рублей до завтра в мессенджере.", opts: ["Перевести", "Позвонить лично"], correct: 1, exp: "Аккаунт скорее всего взломан." },
        { q: "Реклама обещает 500% прибыли за месяц от инвестиций.", opts: ["Вложить", "Проигнорировать"], correct: 1, exp: "Гарантия сверхприбыли — скам." },
        { q: "Письмо от 'Госуслуг' о выплате 100 000 рублей.", opts: ["Ввести карту", "Зайти на сайт"], correct: 1, exp: "Фишинг под госпорталы." },
        { q: "Сотрудник просит код из СМС, чтобы 'отменить перевод'.", opts: ["Назвать код", "Сбросить звонок"], correct: 1, exp: "Код из СМС — ваша подпись." },
        { q: "Вы нашли флешку на улице.", opts: ["Вставить в ПК", "Оставить"], correct: 1, exp: "Флешки-приманки заражают ПК." },
        { q: "Фонарик просит доступ к СМС.", opts: ["Разрешить", "Запретить"], correct: 1, exp: "Так воруют коды банков." },
        { q: "Звонок из 'банка' через WhatsApp.", opts: ["Ответить", "Положить трубку"], correct: 1, exp: "Банки не звонят в мессенджеры." },
        { q: "Бонусы в игре за ввод данных карты.", opts: ["Ввести", "Закрыть"], correct: 1, exp: "Кража данных карты." }
    ];

    let simIndex = 0; let simScore = 0;
    const simCounter = document.getElementById('sim-counter');
    const simQuestion = document.getElementById('sim-question');
    const opt0 = document.getElementById('opt-0'); const opt1 = document.getElementById('opt-1');
    const simOptions = document.getElementById('sim-options'); const simFeedback = document.getElementById('sim-feedback');
    const simActions = document.getElementById('sim-actions'); const btnNext = document.getElementById('btn-next'); const btnRestart = document.getElementById('btn-restart');

    function renderScenario() {
        if(!simQuestion) return;
        const s = simData[simIndex];
        simCounter.innerText = `Сценарий ${simIndex + 1} / 10`; simQuestion.innerText = s.q;
        opt0.innerText = s.opts[0]; opt1.innerText = s.opts[1];
        simOptions.classList.remove('hidden'); simFeedback.classList.add('hidden'); simActions.classList.add('hidden');
    }

    window.processAnswer = (idx) => {
        const s = simData[simIndex];
        const isCorrect = (idx === s.correct);
        if (isCorrect) simScore++;
        simOptions.classList.add('hidden'); simFeedback.classList.remove('hidden');
        simFeedback.className = `sim-feedback ${isCorrect ? 'feed-correct' : 'feed-wrong'}`;
        simFeedback.innerHTML = `<strong>${isCorrect ? 'Верное решение.' : 'Критическая ошибка.'}</strong><br>${s.exp}`;
        simActions.classList.remove('hidden');
    };

    window.nextScenario = () => {
        simIndex++;
        if (simIndex < simData.length) { renderScenario(); } 
        else {
            simCounter.innerText = "Анализ завершен"; simQuestion.innerText = `Эффективность защиты: ${simScore} из 10.`;
            simFeedback.classList.add('hidden'); btnNext.classList.add('hidden'); btnRestart.classList.remove('hidden');
        }
    };

    window.resetSimulator = () => { simIndex = 0; simScore = 0; btnRestart.classList.add('hidden'); btnNext.classList.remove('hidden'); renderScenario(); };
    if(simQuestion) renderScenario();

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
        // Загрузка твоих реальных фото
        document.getElementById('modal-body-text').innerHTML = `<img src="${t.img}" class="modal-img" alt="${t.title}"><br>${t.text}`;
        document.getElementById('modal-window').classList.add('active'); document.body.style.overflow = 'hidden';
    };

    window.closeThreatDetails = () => { document.getElementById('modal-window').classList.remove('active'); document.body.style.overflow = 'auto'; };
    
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
