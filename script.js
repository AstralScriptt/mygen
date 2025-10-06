// script.js
document.addEventListener('DOMContentLoaded', function() {
    const signInBtn = document.getElementById('signInBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const heroCta = document.getElementById('heroCta');
    const signInPopup = document.getElementById('signInPopup');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.close');
    const signInForm = document.getElementById('signInForm');

    function openPopup() {
        signInPopup.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        signInPopup.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    signInBtn.addEventListener('click', openPopup);
    heroCta.addEventListener('click', () => window.location.href = 'signup.html');

    getStartedBtn.addEventListener('click', () => window.location.href = 'signup.html');

    closeBtn.addEventListener('click', closePopup);

    overlay.addEventListener('click', closePopup);

    signInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Handle sign in logic here (e.g., check against localStorage or account.js)
        alert('Sign in successful! (Demo)');
        closePopup();
    });

    // Animate stats counters
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 20);
        });
    }

    // Trigger animation on scroll or load
    if (window.innerHeight > 600) {
        setTimeout(animateCounters, 1000);
    } else {
        animateCounters();
    }

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.borderBottomColor = 'rgba(0, 255, 0, 0.2)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
            header.style.borderBottomColor = 'rgba(0, 255, 0, 0.1)';
        }
    });
});
