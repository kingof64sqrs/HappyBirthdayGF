// Create Starry Background
function createStars() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = window.innerWidth < 768 ? 40 : 80;
    const elements = ['✨', '💖', '💗', '🤍', '🌸'];

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'floating';
        star.innerHTML = elements[Math.floor(Math.random() * elements.length)];

        // Randomize star properties
        const size = Math.random() * 10 + 5;
        star.style.fontSize = `${size}px`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.opacity = Math.random() * 0.5 + 0.1;

        starsContainer.appendChild(star);

        // Animate star individually
        gsap.to(star, {
            y: `-=${Math.random() * 100 + 50}`,
            x: `+=${Math.random() * 40 - 20}`,
            rotation: Math.random() * 360,
            opacity: Math.random() * 0.8 + 0.2,
            duration: Math.random() * 10 + 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * -20 // Start at different times
        });
    }
}

// Custom Cursor Implementation (Desktop Only)
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursorOuter = document.querySelector('.cursor');
    const cursorInner = document.createElement('div');
    cursorInner.className = 'current-cursor-dot';
    document.body.appendChild(cursorInner);

    document.addEventListener('mousemove', (e) => {
        // Outer cursor lags slightly for smooth effect
        gsap.to(cursorOuter, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: "power2.out"
        });

        // Inner dot follows instantly
        gsap.set(cursorInner, {
            x: e.clientX,
            y: e.clientY
        });
    });

    // Cursor Hover Effects
    document.querySelectorAll('button, a').forEach(el => {
        el.addEventListener('mouseenter', () => cursorOuter.classList.add('hover-state'));
        el.addEventListener('mouseleave', () => cursorOuter.classList.remove('hover-state'));
    });
}

// Countdown Timer
function updateCountdown() {
    const birthday = new Date('2026-03-09T00:00:00').getTime();
    const now = new Date().getTime();
    const distance = birthday - now;

    if (distance < 0) {
        // Birthday has passed or is today
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        document.querySelector('.countdown-label').textContent = "It's Your Special Day! 🎉";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Typing effect for greeting
const greetingText = "Hey! You're such an amazing person and wonderful elder sister! 🌟";
const greetingElement = document.querySelector('.greeting');
let charIndex = 0;

function typeGreeting() {
    if (charIndex < greetingText.length) {
        greetingElement.textContent += greetingText.charAt(charIndex);
        charIndex++;
        setTimeout(typeGreeting, 60); // slightly faster for better feel
    }
}

// Initialize animations
window.addEventListener('load', () => {
    createStars();
    
    // Start countdown and update every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial container pop-in
    gsap.from(".glass-card", {
        y: 30,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out"
    });

    // Title animation
    tl.to('h1', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out"
    })
        // Countdown animation
        .to('.countdown-container', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "back.out(1.2)"
        }, "-=0.5")
        // Start typing effect
        .call(typeGreeting, null, "-=0.3")
        // Button animation
        .to('.cta-button', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "back.out(1.5)"
        }, "+=1.5"); // Wait for typing to roughly finish

    // Smooth page transition on click
    document.querySelector('.cta-button').addEventListener('click', () => {
        // Expand the glass card to cover
        gsap.to('.glass-card', {
            scale: 20,
            opacity: 0,
            duration: 1.5,
            ease: "power2.inOut"
        });

        gsap.to(['#stars-container', 'h1', '.greeting', '.countdown-container'], {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                setTimeout(() => {
                    window.location.href = 'cause.html';
                }, 500);
            }
        });
    });
});