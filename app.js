// app.js
document.addEventListener('DOMContentLoaded', () => {
    // Removed hard reset for persistence
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
    const recentList = document.getElementById('recentList');
    const historyList = document.getElementById('historyList');
    const stockCount = document.getElementById('stockCount');
    const genCountEl = document.getElementById('genCount');
    const generatedCount = document.getElementById('generatedCount');
    const copyBtn = document.getElementById('copyBtn');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    const notificationClose = document.querySelector('.notification-close');
    let currentUser = null;
    let accounts = JSON.parse(localStorage.getItem('rawrgenAccounts')) || [{ email: "skibidi@gmail.com", username: "skibidi", password: "1", createdAt: new Date().toISOString() }];
    let generatedAlts = JSON.parse(localStorage.getItem('generatedAlts')) || [];
    let currentStock = JSON.parse(localStorage.getItem('sharedStock')) || [...stock]; // Assuming stock.js loads 'stock'
    // Save to local for persistence
    localStorage.setItem('rawrgenAccounts', JSON.stringify(accounts));
    localStorage.setItem('generatedAlts', JSON.stringify(generatedAlts));
    localStorage.setItem('sharedStock', JSON.stringify(currentStock));
    // Init
    showLanding();
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
    notificationClose.addEventListener('click', hideNotification);
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
    function closeModal(modalId = null) {
        const modal = modalId ? document.getElementById(modalId) : document.querySelector('.modal[style*="block"]');
        if (modal) {
            modal.style.display = 'none';
            modal.querySelector('.modal-content').classList.remove('show');
        }
    }
    async function registerUser(e) {
        e.preventDefault();
        const email = document.getElementById('regEmail').value.trim();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        if (password !== confirmPassword || password.length < 8 || accounts.some(acc => acc.email === email || acc.username === username)) {
            showNotification('Invalid registration details.', 'error');
            return;
        }
        // For global sync, call API if backend is set up
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password })
            });
            const data = await response.json();
            if (data.success) {
                accounts.push({ email, username, password, createdAt: new Date().toISOString() });
                localStorage.setItem('rawrgenAccounts', JSON.stringify(accounts));
                showNotification('Account created successfully!');
                closeModal();
            } else {
                showNotification(data.error || 'Registration failed.', 'error');
            }
        } catch (err) {
            // Fallback to local if API fails
            accounts.push({ email, username, password, createdAt: new Date().toISOString() });
            localStorage.setItem('rawrgenAccounts', JSON.stringify(accounts));
            showNotification('Account created successfully (local mode)!');
            closeModal();
        }
    }
    async function loginUser(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        let user = accounts.find(acc => acc.email === email && acc.password === password);
        if (!user) {
            // Try API for global
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (data.success) {
                    user = { username: data.user.username, email: data.user.email };
                    // Sync to local
                    accounts.push({ ...user, password, createdAt: new Date().toISOString() });
                    localStorage.setItem('rawrgenAccounts', JSON.stringify(accounts));
                }
            } catch (err) {
                // Fallback to local
            }
        }
        if (user) {
            currentUser = user.username;
            localStorage.setItem('currentUser', currentUser);
            showNotification('Logged in successfully!');
            closeModal();
            showApp();
        } else {
            showNotification('Invalid login credentials.', 'error');
        }
    }
    function logout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showNotification('Logged out.');
        showLanding();
    }
    function switchTab(tab) {
        tabLinks.forEach(l => l.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        tabContents.forEach(c => c.classList.remove('active'));
        document.getElementById(`${tab}Tab`).classList.add('active');
        if (tab === 'generate') {
            renderRecent();
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
            showNotification('No stock available.', 'error');
            return;
        }
        const index = Math.floor(Math.random() * currentStock.length);
        const alt = currentStock.splice(index, 1)[0];
        generatedAlts.unshift({ ...alt, generatedAt: new Date().toISOString() });
        localStorage.setItem('sharedStock', JSON.stringify(currentStock));
        localStorage.setItem('generatedAlts', JSON.stringify(generatedAlts));
        updateCounts();
        renderRecent();
        renderHistory();
        showNotification(`Generated: ${alt.username}`);
    }
    function renderRecent() {
        recentList.innerHTML = generatedAlts.slice(0, 5).map(alt => `
            <div class="gen-item">
                <img src="https://via.placeholder.com/40?text=R" alt="Avatar">
                <div class="gen-info">
                    <p>${alt.username}</p>
                    <small>${new Date(alt.generatedAt).toLocaleDateString()}</small>
                </div>
                <div class="gen-actions">
                    <button onclick="copyGen('${alt.username}', '${alt.password}')">📋</button>
                    <button onclick="viewDetails('${alt.username}', '${alt.password}')">👁️</button>
                </div>
            </div>
        `).join('') || '<p>No generations yet.</p>';
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
    function copyGen(username, password) {
        navigator.clipboard.writeText(`${username}:${password}`);
        showNotification('Copied!');
    }
    function copyHistory(username, password) {
        navigator.clipboard.writeText(`${username}:${password}`);
        showNotification('Copied!');
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
        showNotification('Copied!');
    }
    function showNotification(message, type = 'success') {
        notificationText.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'flex';
        setTimeout(hideNotification, 3000);
    }
    function hideNotification() {
        notification.style.display = 'none';
    }
    // Global functions for onclick
    window.copyGen = copyGen;
    window.copyHistory = copyHistory;
    window.viewDetails = viewDetails;
});
