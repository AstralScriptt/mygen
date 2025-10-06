// app.js - Handles modals, auth, animations, stock from stock.js
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const authModal = document.getElementById('authModal');
    const stockModal = document.getElementById('stockModal');
    const loginBtn = document.getElementById('loginBtn');
    const stockLink = document.getElementById('stockLink');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    const loginForm = document.getElementById('loginForm');
    const regForm = document.getElementById('regForm');
    const loginSubmit = document.getElementById('loginSubmit');
    const regSubmit = document.getElementById('regSubmit');
    const switchToReg = document.getElementById('switchToReg');
    const switchToLogin = document.getElementById('switchToLogin');
    const closeBtns = document.getElementsByClassName('close');
    const modalTitle = document.getElementById('modalTitle');
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');
    const stockList = document.getElementById('stockList');
    let currentUser = localStorage.getItem('currentUser') || null;
    let accounts = JSON.parse(localStorage.getItem('rawrgenAccounts')) || [];

    // Event Listeners
    loginBtn.addEventListener('click', () => openAuth('Log In'));
    getStartedBtn.addEventListener('click', (e) => { e.preventDefault(); openAuth('Sign Up'); });
    stockLink.addEventListener('click', (e) => { e.preventDefault(); loadStock(); stockModal.style.display = 'block'; });
    switchToReg.addEventListener('click', (e) => { e.preventDefault(); openAuth('Sign Up'); });
    switchToLogin.addEventListener('click', (e) => { e.preventDefault(); openAuth('Log In'); });
    loginSubmit.addEventListener('click', loginUser);
    regSubmit.addEventListener('click', registerUser);
    document.querySelector('.notification-close').addEventListener('click', hideNotification);
    Array.from(closeBtns).forEach(btn => btn.addEventListener('click', closeAllModals));
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) closeAllModals();
    });
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        mobileToggle.classList.toggle('active');
    });

    // Nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.target.id !== 'stockLink') {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                if (window.innerWidth < 768) {
                    sidebar.classList.remove('mobile-open');
                    mobileToggle.classList.remove('active');
                }
            }
        });
    });

    // Init User
    if (currentUser) {
        loginBtn.textContent = `Yo, ${currentUser}`;
        loginBtn.style.background = '#00e63b';
        loginBtn.style.color = '#000';
    }

    // Animate Particles
    setTimeout(() => {
        document.querySelectorAll('.particle').forEach((p, i) => {
            p.style.animationDelay = `${i * 0.15}s`;
        });
    }, 200);

    // Animate Counters
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 25);
        });
    }
    setTimeout(animateCounters, 1500);

    // Functions
    function openAuth(title) {
        modalTitle.textContent = title;
        if (title === 'Sign Up') {
            loginForm.style.display = 'none';
            regForm.style.display = 'block';
        } else {
            regForm.style.display = 'none';
            loginForm.style.display = 'block';
        }
        authModal.style.display = 'block';
    }
    function closeAllModals() {
        authModal.style.display = 'none';
        stockModal.style.display = 'none';
        regForm.style.display = 'none';
        loginForm.style.display = 'block';
        modalTitle.textContent = 'Log In';
    }
    function showNotification(message, type = 'info') {
        notificationText.textContent = message;
        notification.style.display = 'block';
        setTimeout(hideNotification, 4000);
    }
    function hideNotification() {
        notification.style.display = 'none';
    }
    function registerUser() {
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        if (!username || !email || !password || password !== confirmPassword || password.length < 8) {
            showNotification('Invalid details – check password match & length.', 'error');
            return;
        }
        const newAccount = { username, email, password, createdAt: new Date().toISOString() };
        if (accounts.some(acc => acc.username.toLowerCase() === username.toLowerCase() || acc.email.toLowerCase() === email.toLowerCase())) {
            showNotification('Username or email taken!', 'error');
            return;
        }
        accounts.push(newAccount);
        localStorage.setItem('rawrgenAccounts', JSON.stringify(accounts));
        showNotification('Account created – log in to generate!');
        closeAllModals();
    }
    function loginUser() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        if (!email || !password) {
            showNotification('Email and password required.', 'error');
            return;
        }
        const user = accounts.find(acc => acc.email === email && acc.password === password);
        if (user) {
            currentUser = user.username;
            localStorage.setItem('currentUser', currentUser);
            loginBtn.textContent = `Yo, ${currentUser}`;
            loginBtn.style.background = '#00e63b';
            loginBtn.style.color = '#000';
            showNotification(`Welcome, ${currentUser}! Generate alts now.`);
            closeAllModals();
        } else {
            showNotification('Invalid login – try again.', 'error');
        }
    }
    function loadStock() {
        if (typeof stock !== 'undefined' && stock.length > 0) {
            stockList.innerHTML = stock.map(alt => `
                <div class="stock-item">
                    <h4>${alt.username}</h4>
                    <p>${alt.password}</p>
                    <button class="btn-auth small" onclick="alert('Generated: ${alt.username} / ${alt.password} (Demo)')">Generate</button>
                </div>
            `).join('');
        } else {
            stockList.innerHTML = '<p>No stock available (Add to stock.js).</p>';
        }
    }
});
