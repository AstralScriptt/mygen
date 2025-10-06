// app.js
document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landingPage');
    const app = document.getElementById('app');
    const authModal = document.getElementById('authModal');
    const accountModal = document.getElementById('accountModal');
    const regForm = document.getElementById('regForm');
    const loginForm = document.getElementById('loginForm');
    const modalTitle = document.getElementById('modalTitle');
    const switchToReg = document.getElementById('switchToReg');
    const switchToLogin = document.getElementById('switchToLogin');
    const closeBtns = document.querySelectorAll('.close');
    const signInBtn = document.getElementById('signInBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const heroCta = document.getElementById('heroCta');
    const logoutBtns = document.querySelectorAll('.logout-btn');
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');
    const tabLinks = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    const generateBtn = document.getElementById('generateBtn');
    const stockList = document.getElementById('stockList');
    const historyList = document.getElementById('historyList');
    const stockCount = document.getElementById('stockCount');
    const genCountEl = document.getElementById('genCount');
    const generatedCount = document.getElementById('generatedCount');
    const copyBtn = document.getElementById('copyBtn');

    let currentUser = localStorage.getItem('currentUser');
    let accounts = JSON.parse(localStorage.getItem('rawrgenAccounts')) || [];
    let generatedAlts = JSON.parse(localStorage.getItem('generatedAlts')) || [];
    let currentStock = JSON.parse(localStorage.getItem('sharedStock')) || [...stock]; // Shared stock

    // Init
    if (currentUser) {
        showApp();
    } else {
        showLanding();
    }
    updateCounts();
    renderHistory();

    // Landing Events
    signInBtn.addEventListener('click', () => openAuth('Log In'));
    getStartedBtn.addEventListener('click', () => openAuth('Sign Up'));
    heroCta.addEventListener('click', () => openAuth('Sign Up'));

    // Auth Events
    regForm.addEventListener('submit', registerUser);
    loginForm.addEventListener('submit', loginUser);
    switchToReg.addEventListener('click', (e) => { e.preventDefault(); openAuth('Sign Up'); });
    switchToLogin.addEventListener('click', (e) => { e.preventDefault(); openAuth('Log In'); });
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    document.querySelectorAll('.modal-overlay').forEach(overlay => overlay.addEventListener('click', closeModal));

    // App Events
    logoutBtns.forEach(btn => btn.addEventListener('click', logout));
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
    generateBtn.addEventListener('click', randomGenerate);
    copyBtn.addEventListener('click', copyCredentials);

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
        authModal.querySelector('.modal-content').classList.add('show');
    }
    function closeModal() {
        document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
        document.querySelectorAll('.modal-content').forEach(content => content.classList.remove('show'));
    }
    function registerUser(e) {
        e.preventDefault();
        const email = document.getElementById('regEmail').value.trim();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        if (password !== confirmPassword || password.length < 8 || accounts.some(acc => acc.email === email || acc.username === username)) {
            alert('Invalid registration details.');
            return;
        }
        accounts.push({ email, username, password, createdAt: new Date().toISOString() });
        localStorage.setItem('rawrgenAccounts', JSON.stringify(accounts));
        alert('Account created successfully!');
        closeModal();
    }
    function loginUser(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const user = accounts.find(acc => acc.email === email && acc.password === password);
        if (user) {
            currentUser = user.username;
            localStorage.setItem('currentUser', currentUser);
            alert('Logged in successfully!');
            closeModal();
            showApp();
        } else {
            alert('Invalid login credentials.');
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
        }
        if (tab === 'history') {
            renderHistory();
        }
    }
    function updateCounts() {
        stockCount.textContent = currentStock.length;
        genCountEl.textContent = generatedAlts.length;
        generatedCount.textContent = generatedAlts.length;
    }
    function randomGenerate() {
        if (currentStock.length === 0) {
            alert('No stock available.');
            return;
        }
        const alt = currentStock.splice(Math.floor(Math.random() * currentStock.length), 1)[0];
        generatedAlts.unshift({ ...alt, generatedAt: new Date().toISOString() });
        localStorage.setItem('sharedStock', JSON.stringify(currentStock));
        localStorage.setItem('generatedAlts', JSON.stringify(generatedAlts));
        updateCounts();
        renderStock();
        renderHistory();
        alert(`Generated: ${alt.username} / ${alt.password}`);
    }
    function renderStock() {
        stockList.innerHTML = currentStock.map(alt => `
            <div class="stock-item" onclick="generateSpecific('${alt.username}')">
                <span class="stock-username">${alt.username}</span>
                <span class="stock-password">${alt.password}</span>
            </div>
        `).join('') || '<p>No stock available.</p>';
    }
    function generateSpecific(username) {
        const index = currentStock.findIndex(alt => alt.username === username);
        if (index > -1) {
            const alt = currentStock.splice(index, 1)[0];
            generatedAlts.unshift({ ...alt, generatedAt: new Date().toISOString() });
            localStorage.setItem('sharedStock', JSON.stringify(currentStock));
            localStorage.setItem('generatedAlts', JSON.stringify(generatedAlts));
            updateCounts();
            renderStock();
            renderHistory();
            alert(`Generated: ${alt.username} / ${alt.password}`);
        }
    }
    function renderHistory() {
        historyList.innerHTML = generatedAlts.map(alt => `
            <div class="history-item">
                <img src="https://via.placeholder.com/50?text=R" alt="Avatar" class="history-avatar">
                <div class="history-info">
                    <p>${alt.username}</p>
                    <small>${new Date(alt.generatedAt).toLocaleDateString()}</small>
                </div>
                <div class="history-actions">
                    <button onclick="copyHistory('${alt.username}', '${alt.password}')">📋</button>
                    <button onclick="viewDetails('${alt.username}', '${alt.password}')">👁️</button>
                </div>
            </div>
        `).join('') || '<p>No generations yet.</p>';
    }
    function copyHistory(username, password) {
        navigator.clipboard.writeText(`${username}:${password}`);
        alert('Copied!');
    }
    function viewDetails(username, password) {
        document.getElementById('detailUsername').textContent = username;
        document.getElementById('detailPassword').textContent = password;
        accountModal.style.display = 'block';
        accountModal.querySelector('.modal-content').classList.add('show');
    }
    function copyCredentials() {
        const username = document.getElementById('detailUsername').textContent;
        const password = document.getElementById('detailPassword').textContent;
        navigator.clipboard.writeText(`${username}:${password}`);
        alert('Copied!');
    }
});
