// script.js
document.addEventListener('DOMContentLoaded', function() {
    const signInBtn = document.getElementById('signInBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const signInPopup = document.getElementById('signInPopup');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close');
    const signInForm = document.getElementById('signInForm');

    function openPopup() {
        signInPopup.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        signInPopup.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    signInBtn.addEventListener('click', openPopup);

    getStartedBtn.addEventListener('click', function() {
        window.location.href = 'signup.html';
    });

    closeBtn.addEventListener('click', closePopup);

    overlay.addEventListener('click', closePopup);

    signInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Handle sign in logic here (e.g., check against localStorage or account.js)
        alert('Sign in successful! (Demo)');
        closePopup();
    });
});
