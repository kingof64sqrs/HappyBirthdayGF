import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const Home = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
    });
    const [isBirthday, setIsBirthday] = useState(false);
    const [greeting, setGreeting] = useState('');
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const typeRef = useRef(null);

    const targetDate = new Date('2026-03-09T00:00:00').getTime();
    const greetingText = "Hey! You're such an amazing person and wonderful elder sister! 🌟";

    // Countdown Logic
    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                setIsBirthday(true);
                setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
                return;
            }

            setTimeLeft({
                days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0'),
                hours: String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
                minutes: String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
                seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0'),
            });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, []);

    // Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            gsap.from('.glass-card', {
                y: 30,
                opacity: 0,
                duration: 1.5,
                ease: 'power4.out',
            });

            tl.to('.home-title', {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power4.out',
            })
                .to('.countdown-container', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'back.out(1.2)',
                }, "-=0.5")
                .call(() => {
                    // Start typing effect
                    let charIndex = 0;
                    const typeLoop = () => {
                        if (charIndex <= greetingText.length) {
                            setGreeting(greetingText.substring(0, charIndex));
                            charIndex++;
                            typeRef.current = setTimeout(typeLoop, 50);
                        }
                    };
                    typeLoop();
                }, null, "-=0.3")
                .to('.cta-button', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'back.out(1.5)',
                }, "+=1.5");
        }, containerRef);

        return () => {
            ctx.revert();
            clearTimeout(typeRef.current);
        };
    }, []);

    const handleStart = () => {
        // Transition
        gsap.to('.glass-card', {
            scale: 20,
            opacity: 0,
            duration: 1.5,
            ease: 'power2.inOut',
        });

        gsap.to(['.home-title', '.home-greeting', '.countdown-container'], {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                setTimeout(() => {
                    navigate('/cause');
                }, 500);
            },
        });
    };

    return (
        <div className="home-wrapper" ref={containerRef}>
            <div className="home-container glass-card">
                <h1 className="home-title title-gradient">Happy Birthday Prachi ✨</h1>
                <div className="countdown-container">
                    <div className="countdown-label">
                        {isBirthday ? "It's Your Special Day! 🎉" : 'Celebrating in'}
                    </div>
                    <div className="countdown-timer">
                        <div className="time-unit">
                            <span className="time-value" id="days">{timeLeft.days}</span>
                            <span className="time-label">Days</span>
                        </div>
                        <div className="time-separator">:</div>
                        <div className="time-unit">
                            <span className="time-value" id="hours">{timeLeft.hours}</span>
                            <span className="time-label">Hours</span>
                        </div>
                        <div className="time-separator">:</div>
                        <div className="time-unit">
                            <span className="time-value" id="minutes">{timeLeft.minutes}</span>
                            <span className="time-label">Minutes</span>
                        </div>
                        <div className="time-separator">:</div>
                        <div className="time-unit">
                            <span className="time-value" id="seconds">{timeLeft.seconds}</span>
                            <span className="time-label">Seconds</span>
                        </div>
                    </div>
                </div>
                <div className="home-greeting">{greeting}</div>
                <button className="cta-button" onClick={handleStart}>
                    <span className="btn-text">Begin Celebration</span>
                    <span className="btn-glow"></span>
                </button>
            </div>
        </div>
    );
};

export default Home;
