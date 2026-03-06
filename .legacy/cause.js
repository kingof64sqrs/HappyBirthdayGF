// Reasons database
const reasons = [
    {
        text: "From the moment I met you, I knew you were someone truly special. Your kindness, your laughter, and your beautiful soul have touched my heart in ways words can't describe. You're not just my elder sister, you're my inspiration. 💖",
        gif: "gif1.gif"
    },
    {
        text: "Every day with you feels like a blessing. Your smile lights up the darkest days, and your presence brings warmth to every moment. I'm so grateful for all the memories we've created together, and I can't wait to make countless more. 🌸",
        gif: "gif2.gif"
    },
    {
        text: "You have this incredible ability to make everyone around you feel loved and valued. Your compassion knows no bounds, and your strength inspires me every single day. Thank you for being the amazing person you are. ✨",
        gif: "gif1.gif"
    },
    {
        text: "On your special day, I want you to know how deeply you're cherished. You deserve all the happiness, success, and love this world has to offer. May this year bring you closer to your dreams and fill your heart with endless joy. Happy Birthday, my dear sister! 🎉💕",
        gif: "gif2.gif"
    }
];

// State management
let currentReasonIndex = 0;
const reasonsContainer = document.getElementById('reasons-container');
const shuffleButton = document.querySelector('.shuffle-button');
const reasonCounter = document.querySelector('.reason-counter');
let isTransitioning = false;

// Create Starry Background
function createStars() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = window.innerWidth < 768 ? 40 : 100;
    const elements = ['✨', '⭐', '🌟', '💫'];

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'floating';
        star.innerHTML = elements[Math.floor(Math.random() * elements.length)];

        const size = Math.random() * 8 + 4;
        star.style.fontSize = `${size}px`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.opacity = Math.random() * 0.4 + 0.1;

        starsContainer.appendChild(star);

        gsap.to(star, {
            y: `-=${Math.random() * 80 + 30}`,
            x: `+=${Math.random() * 30 - 15}`,
            rotation: Math.random() * 360,
            opacity: Math.random() * 0.6 + 0.2,
            duration: Math.random() * 10 + 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * -20
        });
    }
}

// Custom Cursor Implementation (Desktop Only)
let attachCursorHoverEvents = () => {}; // Default no-op for mobile

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursorOuter = document.querySelector('.cursor');
    const cursorInner = document.createElement('div');
    cursorInner.className = 'current-cursor-dot';
    document.body.appendChild(cursorInner);

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursorOuter, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: "power2.out"
        });

        gsap.set(cursorInner, {
            x: e.clientX,
            y: e.clientY
        });
    });

    attachCursorHoverEvents = function() {
        document.querySelectorAll('button, a, .reason-card').forEach(el => {
            el.removeEventListener('mouseenter', addHoverState);
            el.removeEventListener('mouseleave', removeHoverState);
            el.addEventListener('mouseenter', addHoverState);
        el.addEventListener('mouseleave', removeHoverState);
    });
}

function addHoverState() { cursorOuter.classList.add('hover-state'); }
function removeHoverState() { cursorOuter.classList.remove('hover-state'); }

} // End of cursor implementation for desktop

// Create reason card
function createReasonCard(reason) {
    const card = document.createElement('div');
    card.className = 'reason-card';

    const text = document.createElement('div');
    text.className = 'reason-text';
    text.innerHTML = reason.text;

    const gifOverlay = document.createElement('div');
    gifOverlay.className = 'gif-overlay';
    gifOverlay.innerHTML = `<img src="${reason.gif}" alt="Memory">`;

    card.appendChild(gifOverlay);
    card.appendChild(text);

    // Entrance Animation - refined for better looks
    gsap.from(card, {
        opacity: 0,
        y: 40,
        scale: 0.9,
        duration: 0.8,
        ease: "power3.out"
    });

    return card;
}

// Display new reason
function displayNewReason() {
    if (isTransitioning) return;
    isTransitioning = true;

    if (currentReasonIndex < reasons.length) {
        const card = createReasonCard(reasons[currentReasonIndex]);
        reasonsContainer.appendChild(card);

        // Update counter dynamically
        if (!reasonCounter) {
            const counterDiv = document.createElement('div');
            counterDiv.className = 'reason-counter';
            shuffleButton.parentNode.insertBefore(counterDiv, shuffleButton.nextSibling);
            counterDiv.textContent = `Memory ${currentReasonIndex + 1} of ${reasons.length}`;
        } else {
            reasonCounter.textContent = `Memory ${currentReasonIndex + 1} of ${reasons.length}`;
        }

        currentReasonIndex++;
        attachCursorHoverEvents();

        // Reveal the transition button when all cards are shown
        if (currentReasonIndex === reasons.length) {
            // Show ending section
            const endingSection = document.querySelector('.ending-section');
            if (endingSection) {
                endingSection.classList.add('visible');
                
                gsap.to('.teddy-hug', {
                    scale: 1,
                    duration: 1,
                    delay: 0.3,
                    ease: "elastic.out(1, 0.5)"
                });
                
                gsap.to('.ending-text', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.8,
                    ease: "power2.out"
                });
            }
            
            gsap.to(shuffleButton, {
                scale: 1.05,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    const btnText = shuffleButton.querySelector('.btn-text');
                    if (btnText) btnText.textContent = "See Our Memories 💫";
                    else shuffleButton.textContent = "See Our Memories 💫";

                    shuffleButton.classList.add('story-mode');

                    // Set flag so we redirect on next click instead of adding items
                    shuffleButton.dataset.readyToNavigate = "true";
                }
            });
        }

        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
}

// Initialize button click
shuffleButton.addEventListener('click', () => {
    if (shuffleButton.dataset.readyToNavigate === "true") {
        gsap.to('body', {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
                window.location.href = 'last.html';
            }
        });
        return;
    }

    gsap.to(shuffleButton, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1
    });
    displayNewReason();
});

// Initial Setup
window.addEventListener('load', () => {
    createStars();
    attachCursorHoverEvents();

    // Animate header section
    gsap.from('.header-section', {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    });

    gsap.from('h1', {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        delay: 0.3,
        ease: "back.out(1.2)"
    });

    gsap.from('.button-wrapper', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.6,
        ease: "power2.out"
    });
});