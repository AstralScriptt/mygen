// stock.js - Dummy stock for testing
let stock = [
    { username: 'alt1_roblox', password: 'pass123' },
    { username: 'alt2_roblox', password: 'pass456' },
    { username: 'alt3_roblox', password: 'pass789' },
    { username: 'alt4_roblox', password: 'passabc' },
    { username: 'alt5_roblox', password: 'passdef' },
    { username: 'alt6_roblox', password: 'passghi' },
    { username: 'alt7_roblox', password: 'passjkl' },
    { username: 'alt8_roblox', password: 'passmno' },
    { username: 'alt9_roblox', password: 'passpqr' },
    { username: 'alt10_roblox', password: 'passstu' },
    // Add more as needed
];
localStorage.setItem('sharedStock', JSON.stringify(stock));
