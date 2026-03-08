import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import Celebration3D from '../components/Celebration3D';
import FinaleExplosion from '../components/FinaleExplosion';

const Home = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
    });
    const [isBirthday, setIsBirthday] = useState(false);
    const [hasOpenedGift, setHasOpenedGift] = useState(false);
    const [wishesGranted, setWishesGranted] = useState(false);
    const [greeting, setGreeting] = useState('');
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const typeRef = useRef(null);
    const audioRef = useRef(null);

    const targetDate = useRef(new Date().getTime() + 3000);
    const greetingText = "Hey! You're such an amazing person and wonderful elder sister! 🌟";

    // Setup Audio
    useEffect(() => {
        audioRef.current = new Audio('/audio/happy-birthday.mp3');
        audioRef.current.loop = true;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    // Countdown Logic
    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate.current - now;

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

    // Animate birthday celebration container in when isBirthday flips true
    useEffect(() => {
        if (!isBirthday) return;
        gsap.to('.birthday-celebration-container', {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'back.out(1.3)',
        });
    }, [isBirthday]);

    // Initial Animations
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

    const handleGiftOpened = () => {
        setHasOpenedGift(true);

        // Play Audio
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio autoplay prevented by browser', e));
        }

        // Sustained confetti shower
        const duration = 5000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };
        const randomInRange = (min, max) => Math.random() * (max - min) + min;
        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        // Text floats UP from around where the box was
        gsap.fromTo('.celebration-text-reveal',
            { scale: 0.4, opacity: 0, y: 220, rotationX: 30 },
            { scale: 1, opacity: 1, y: 0, rotationX: 0, duration: 1.6, ease: 'back.out(1.6)', delay: 0.8 }
        );
    };

    const handleAllCandlesBlown = () => {
        setWishesGranted(true);
    };

    const handleStart = () => {
        if (audioRef.current) {
            // Fade out audio gracefully before navigating
            gsap.to(audioRef.current, { volume: 0, duration: 1, onComplete: () => audioRef.current.pause() });
        }

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
        <div className={`home-wrapper${isBirthday ? ' birthday-active' : ''}`} ref={containerRef}>
            <FinaleExplosion visible={wishesGranted} />
            <div className="home-container glass-card">
                <h1 className="home-title title-gradient">Happy Birthday Prachi ✨</h1>

                <div className="countdown-container">
                    {!isBirthday ? (
                        <>
                            <div className="countdown-label">Celebrating in</div>
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
                        </>
                    ) : (
                        <div className="birthday-celebration-container">
                            <Celebration3D onOpenComplete={handleGiftOpened} onAllCandlesBlown={handleAllCandlesBlown} />

                            <div className="celebration-text-reveal" style={{ opacity: 0, marginTop: '1rem' }}>
                                <div className="celebration-subtitle">It's Your Special Day! 🎉</div>
                                <div className="celebration-title">Wishing You Many More<br />Happy Returns of the Day!</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="home-greeting">{isBirthday ? '' : greeting}</div>
                <button className="cta-button" onClick={handleStart} style={{ display: isBirthday ? 'none' : undefined }}>
                    <span className="btn-text">Begin Celebration</span>
                    <span className="btn-glow"></span>
                </button>
            </div>
        </div>
    );
};

export default Home;
