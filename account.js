// account.js - Hard reset, initial account
let accounts = [
    { email: "skibidi@gmail.com", username: "skibidi", password: "1", createdAt: new Date().toISOString() }
];
localStorage.setItem('rawrgenAccounts', JSON.stringify(accounts));
