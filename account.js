// account.js
let accounts = [];

if (localStorage.getItem('rawrgenAccounts')) {
    accounts = JSON.parse(localStorage.getItem('rawrgenAccounts'));
}

// For sign-in validation, you can add a function here if needed
function validateLogin(email, password) {
    return accounts.find(acc => acc.email === email && acc.password === password);
}
