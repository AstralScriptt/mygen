// signup-script.js
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Create account object
        const newAccount = {
            username: username,
            email: email,
            password: password, // In production, hash this!
            createdAt: new Date().toISOString()
        };
        
        // Add to accounts array from account.js
        if (typeof accounts !== 'undefined') {
            accounts.push(newAccount);
            // Optionally save to localStorage for persistence
            localStorage.setItem('rawrgenAccounts', JSON.stringify(accounts));
        }
        
        alert('Account created successfully! Redirecting to dashboard... (Demo)');
        // Redirect to dashboard or home
        window.location.href = 'index.html';
    });
});

function showSignIn() {
    // For now, redirect to index and open popup, but since it's separate page, just go to index
    window.location.href = 'index.html';
}
