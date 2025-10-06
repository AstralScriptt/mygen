// signup-script.js
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password.length < 8) {
            alert('Password must be at least 8 characters long!');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address!');
            return;
        }
        
        // Create account object
        const newAccount = {
            username: username,
            email: email,
            password: password, // In production, hash this with bcrypt or similar!
            createdAt: new Date().toISOString()
        };
        
        // Add to accounts array from account.js
        if (typeof accounts !== 'undefined') {
            // Check if username or email exists
            const usernameExists = accounts.some(acc => acc.username.toLowerCase() === username.toLowerCase());
            const emailExists = accounts.some(acc => acc.email.toLowerCase() === email.toLowerCase());
            
            if (usernameExists) {
                alert('Username already taken!');
                return;
            }
            if (emailExists) {
                alert('Email already registered!');
                return;
            }
            
            accounts.push(newAccount);
            // Save to localStorage for persistence
            localStorage.setItem('rawrgenAccounts', JSON.stringify(accounts));
            alert('Account created successfully! Redirecting...');
            window.location.href = 'index.html';
        } else {
            console.error('Accounts array not found!');
        }
    });
});
