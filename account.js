// account.js
// This file stores the accounts array. In a real app, this would be loaded/saved dynamically.
// For demo, initialize empty array. On signup, push to it and optionally to localStorage.

let accounts = [
    // Example accounts - remove in production
    // { username: 'demo', email: 'demo@example.com', password: 'demo', createdAt: '2025-10-06T00:00:00Z' }
];

if (localStorage.getItem('rawrgenAccounts')) {
    accounts = JSON.parse(localStorage.getItem('rawrgenAccounts'));
}

export { accounts }; // If using modules, but for simplicity, it's global here.
