// account.js - Initial accounts (add new ones manually here for global seed)
let accounts = [
    { email: "skibidi@gmail.com", username: "skibidi", password: "1", createdAt: new Date().toISOString() }
    // Add new: { email: "yournew@email.com", username: "yournewuser", password: "yourpass", createdAt: new Date().toISOString() },
];
localStorage.setItem('rawrgenAccounts', JSON.stringify(accounts));
