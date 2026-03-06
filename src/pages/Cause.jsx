import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const reasons = [
    { text: "From the moment I met you, I knew you were someone truly special. Your kindness, your laughter, and your beautiful soul have touched my heart in ways words can't describe. You're not just my elder sister, you're my inspiration. 💖", gif: "/gif1.gif" },
    { text: "Every day with you feels like a blessing. Your smile lights up the darkest days, and your presence brings warmth to every moment. I'm so grateful for all the memories we've created together, and I can't wait to make countless more. 🌸", gif: "/gif2.gif" },
    { text: "You have this incredible ability to make everyone around you feel loved and valued. Your compassion knows no bounds, and your strength inspires me every single day. Thank you for being the amazing person you are. ✨", gif: "/gif1.gif" },
    { text: "On your special day, I want you to know how deeply you're cherished. You deserve all the happiness, success, and love this world has to offer. May this year bring you closer to your dreams and fill your heart with endless joy. Happy Birthday, my dear sister! 🎉💕", gif: "/gif2.gif" }
];

const Cause = () => {
    const [displayedReasons, setDisplayedReasons] = useState([]);
    const [isDone, setIsDone] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const buttonRef = useRef(null);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.header-section', {
                y: -100,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
            });
            gsap.from('.cause-title', {
                opacity: 0,
                scale: 0.9,
                duration: 1,
                delay: 0.3,
                ease: 'back.out(1.2)',
            });
            gsap.from('.button-wrapper', {
                opacity: 0,
                y: 20,
                duration: 0.8,
                delay: 0.6,
                ease: 'power2.out',
            });
        }, wrapperRef);
        return () => ctx.revert();
    }, []);

    const handleShuffle = () => {
        if (isDone) {
            gsap.to('body', {
                opacity: 0,
                duration: 1.2,
                ease: 'power2.inOut',
                onComplete: () => {
                    gsap.set('body', { opacity: 1 });
                    navigate('/memories');
                },
            });
            return;
        }

        if (isTransitioning) return;
        setIsTransitioning(true);

        gsap.to(buttonRef.current, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
        });

        const nextIndex = displayedReasons.length;
        if (nextIndex < reasons.length) {
            setDisplayedReasons((prev) => [...prev, reasons[nextIndex]]);

            // Next element appearance is handled outside, but let's animate the newly added card
            setTimeout(() => {
                const cards = document.querySelectorAll('.reason-card');
                const newCard = cards[cards.length - 1];
                if (newCard) {
                    gsap.fromTo(newCard,
                        { opacity: 0, y: 40, scale: 0.9 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
                    );
                }
            }, 0);

            if (nextIndex + 1 === reasons.length) {
                setIsDone(true);
                setTimeout(() => {
                    gsap.to('.teddy-hug', {
                        scale: 1,
                        duration: 1,
                        delay: 0.3,
                        ease: 'elastic.out(1, 0.5)',
                    });
                    gsap.to('.ending-text', {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: 0.8,
                        ease: 'power2.out',
                    });
                    gsap.to(buttonRef.current, {
                        scale: 1.05,
                        duration: 0.5,
                        ease: 'power2.out',
                    });
                }, 500);
            }

            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    return (
        <div className="cause-wrapper" ref={wrapperRef}>
            <div className="header-section">
                <h1 className="cause-title title-gradient">Happy Birthday Prachi 💖</h1>
                <div className="button-wrapper">
                    <button
                        ref={buttonRef}
                        className={`shuffle-button ${isDone ? 'story-mode' : ''}`}
                        onClick={handleShuffle}
                    >
                        <span className="btn-text">{isDone ? 'See Our Memories 💫' : 'Reveal Magic ✨'}</span>
                        <span className="btn-glow"></span>
                    </button>
                    {displayedReasons.length > 0 && (
                        <div className="reason-counter">
                            Memory {displayedReasons.length} of {reasons.length}
                        </div>
                    )}
                </div>
            </div>

            <div className="reasons-container">
                {displayedReasons.map((reason, index) => (
                    <div key={index} className="reason-card">
                        <div className="gif-overlay">
                            <img src={reason.gif} alt="Memory Background" />
                        </div>
                        <div className="reason-text">{reason.text}</div>
                    </div>
                ))}
            </div>

            <div className="ending-section" style={{ visibility: isDone ? 'visible' : 'hidden', opacity: isDone ? 1 : 0, transition: 'opacity 0.6s ease' }}>
                <div className="teddy-hug" style={{ transform: 'scale(0)' }}>
                    <img src="/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.08%20AM.jpeg" alt="Celebration" />
                </div>
                <div className="ending-text" style={{ opacity: 0, transform: 'translateY(20px)' }}>You're the BEST Elder Sister! 🌟</div>
            </div>
        </div>
    );
};

export default Cause;
