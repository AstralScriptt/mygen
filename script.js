// script.js
document.addEventListener('DOMContentLoaded', function() {
    const signInBtn = document.getElementById('signInBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const signInPopup = document.getElementById('signInPopup');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close');
    const signInForm = document.getElementById('signInForm');

    signInBtn.addEventListener('click', function() {
        signInPopup.style.display = 'block';
        overlay.style.display = 'block';
    });

    getStartedBtn.addEventListener('click', function() {
        window.location.href = 'signup.html';
    });

    closeBtn.addEventListener('click', function() {
        signInPopup.style.display = 'none';
        overlay.style.display = 'none';
    });

    overlay.addEventListener('click', function() {
        signInPopup.style.display = 'none';
        overlay.style.display = 'none';
    });

    signInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Handle sign in logic here (e.g., check against localStorage or account.js)
        alert('Sign in successful! (Demo)');
        signInPopup.style.display = 'none';
        overlay.style.display = 'none';
    });
});
