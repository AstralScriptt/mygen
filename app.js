// app.js
document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landingPage');
    const app = document.getElementById('app');
    const authModal = document.getElementById('authModal');
    const regForm = document.getElementById('regForm');
    const loginForm = document.getElementById('loginForm');
    const modalTitle = document.getElementById('modalTitle');
    const switchToReg = document.getElementById('switchToReg');
    const switchToLogin = document.getElementById('switchToLogin');
    const close = document.querySelector('.close');
    const signInBtn = document.getElementById('signInBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const heroCta = document.getElementById('heroCta');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutBtnMobile = document.getElementById('logoutBtnMobile');
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');
    const tabLinks = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    const generateBtn = document.getElementById('generateBtn');
    const stockCount = document.getElementById('stockCount');
    const genCount = document.getElementById('generatedCount');
    const genList = document.querySelector('.gen-list');

    let currentUser = localStorage.getItem('currentUser');
    let accounts = JSON.parse(localStorage.getItem('rawrgenAccounts')) || [];
    let generatedAlts = JSON.parse(localStorage.getItem('generatedAlts')) || [];
    let currentStock = [...stock]; // From stock.js

    // Init
    if (currentUser) {
        showApp();
    } else {
        showLanding();
    }
    updateCounts();

    // Landing Events
    signInBtn.addEventListener('click', () => openAuth('Log In'));
    getStartedBtn.addEventListener('click', () => openAuth('Sign Up'));
    heroCta.addEventListener('click', () => openAuth('Sign Up'));

    // Auth Events
    regForm.addEventListener('submit', registerUser);
    loginForm.addEventListener('submit', loginUser);
    switchToReg.addEventListener('click', (e) => { e.preventDefault(); openAuth('Sign Up'); });
    switchToLogin.addEventListener('click', (e) => { e.preventDefault(); openAuth('Log In'); });
    close.addEventListener('click', closeAuth);
    document.querySelector('.modal-overlay').addEventListener('click', closeAuth);

    // App Events
    logoutBtn.addEventListener('click', logout);
    logoutBtnMobile.addEventListener('click', logout);
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        mobileToggle.classList.toggle('active');
    });
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.dataset.tab;
            switchTab(tab);
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                mobileToggle.classList.remove('active');
            }
        });
    });
    generateBtn.addEventListener('click', generateAccount);

    // Functions
    function showLanding() {
        landingPage.style.display = 'block';
        app.style.display = 'none';
    }
    function showApp() {
        landingPage.style.display = 'none';
        app.style.display = 'block';
        switchTab('home');
    }
    function openAuth(title) {
        modalTitle.textContent = title;
        if (title === 'Sign Up') {
            regForm.style.display = 'block';
            loginForm.style.display = 'none';
        } else {
            regForm.style.display = 'none';
            loginForm.style.display = 'block';
        }
        authModal.style.display = 'block';
    }
    function closeAuth() {
        authModal.style.display = 'none';
    }
    function registerUser(e) {
        e.preventDefault();
        const email = document.getElementById('regEmail').value.trim();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        if (password !== confirmPassword || password.length < 8 || accounts.some(acc => acc.email === email || acc.username === username)) {
            alert('Invalid registration.');
            return;
        }
        accounts.push({ email, username, password });
        localStorage.setItem('rawrgenAccounts', JSON.stringify(accounts));
        alert('Account created!');
        closeAuth();
    }
    function loginUser(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const user = accounts.find(acc => acc.email === email && acc.password === password);
        if (user) {
            currentUser = user.username;
            localStorage.setItem('currentUser', currentUser);
            alert('Logged in!');
            closeAuth();
            showApp();
        } else {
            alert('Invalid login.');
        }
    }
    function logout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showLanding();
    }
    function switchTab(tab) {
        tabLinks.forEach(l => l.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        tabContents.forEach(c => c.classList.remove('active'));
        document.getElementById(`${tab}Tab`).classList.add('active');
        if (tab === 'generate') {
            renderStock();
            renderRecent();
        }
    }
    function updateCounts() {
        stockCount.textContent = currentStock.length;
        genCount.textContent = generatedAlts.length;
    }
    function generateAccount() {
        if (currentStock.length === 0) {
            alert('No stock available.');
            return;
        }
        const alt = currentStock.shift();
        generatedAlts.unshift(alt);
        localStorage.setItem('generatedAlts', JSON.stringify(generatedAlts));
        localStorage.setItem('stock', JSON.stringify(currentStock));
        updateCounts();
        renderStock();
        renderRecent();
        alert(`Generated: ${alt.username} / ${alt.password}`);
    }
    function renderStock() {
        // Stock is handled in generate tab via recent? Wait, user wants stock list in generate.
        // For now, assume gen-list shows stock for generation.
        genList.innerHTML = currentStock.map(alt => `
            <div class="gen-item">
                <div class="gen-info">
                    <p>${alt.username}: ${alt.password}</p>
                </div>
                <button onclick="generateAccount()">Generate</button>
            </div>
        `).join('');
    }
    function renderRecent() {
        // Recent is generatedAlts
        // But in code above, gen-list is used for stock; adjust if needed.
    }
});
