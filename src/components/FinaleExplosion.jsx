import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import confetti from 'canvas-confetti';

const ALL_PHOTOS = [
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.08%20AM.jpeg',   title: 'Her Smile 💖'         },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.09%20AM.jpeg',   title: 'Together 🌸'          },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.09%20AM%20(1).jpeg', title: 'Beautiful Soul ✨' },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.11%20AM.jpeg',   title: 'Precious 💫'          },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.11%20AM%20(1).jpeg', title: 'Joyful 🎉'        },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.12%20AM.jpeg',   title: 'Always There 🌺'      },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.12%20AM%20(1).jpeg', title: 'Special Bond 🌟'  },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.13%20AM.jpeg',   title: 'Memories ✨'          },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%2011.14.10%20AM.jpeg',   title: 'Grateful 💕'          },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%2011.20.57%20AM.jpeg',   title: 'Celebrating You 🎂'   },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%201.19.21%20PM.jpeg',    title: 'Radiant 🌈'           },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%201.22.31%20PM.jpeg',    title: 'Pure Joy 💖'          },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%201.22.59%20PM.jpeg',    title: 'Cherished ✨'         },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%201.24.34%20PM.jpeg',    title: 'Forever 💝'           },
];

// Where each photo lands (vw/vh offsets from center of screen)
const LAND_POSITIONS = [
    { x: '-40vw', y: '-32vh', rot: -18, scale: 1.0 },
    { x: '-18vw', y: '-38vh', rot:   8, scale: 1.1 },
    { x:   '8vw', y: '-36vh', rot: -12, scale: 1.0 },
    { x:  '32vw', y: '-30vh', rot:  16, scale: 1.05 },
    { x: '-44vw', y: '-4vh',  rot:  14, scale: 1.0 },
    { x: '-22vw', y:  '6vh',  rot:  -8, scale: 1.1 },
    { x:  '22vw', y:  '4vh',  rot:  10, scale: 1.1 },
    { x:  '44vw', y: '-6vh',  rot: -14, scale: 1.0 },
    { x: '-38vw', y:  '30vh', rot: -11, scale: 1.05 },
    { x: '-14vw', y:  '34vh', rot:   9, scale: 1.0 },
    { x:  '10vw', y:  '36vh', rot: -15, scale: 1.1 },
    { x:  '36vw', y:  '28vh', rot:  13, scale: 1.05 },
    { x: '-28vw', y:  '-18vh',rot:  -6, scale: 0.95 },
    { x:  '28vw', y:  '-18vh',rot:   7, scale: 0.95 },
];

// Where they fly IN from (off-screen edges)
const SPAWN_FROM = [
    { x: '-120vw', y: '-80vh' }, { x: '0vw',    y: '-120vh' }, { x: '120vw',  y: '-80vh' },
    { x: '-120vw', y: '0vh'   }, { x: '120vw',  y: '0vh'    }, { x: '-120vw', y: '80vh'  },
    { x: '0vw',    y: '120vh' }, { x: '120vw',  y: '80vh'   }, { x: '-80vw',  y: '-120vh' },
    { x: '80vw',   y: '-120vh'}, { x: '-80vw',  y: '120vh'  }, { x: '80vw',   y: '120vh'  },
    { x: '-120vw', y: '-40vh' }, { x: '120vw',  y: '40vh'   },
];

const WISHES = [
    "You are the most amazing elder sister anyone could ask for 🌟",
    "Every moment with you is a memory I'll treasure forever 💕",
    "May this year bring you all the happiness you deserve 🌸",
    "Keep shining bright — the world is better with you in it ✨",
    "Wishing you a year full of love, laughter & endless joy 🎉",
];

const FinaleExplosion = ({ visible, onClose }) => {
    const overlayRef    = useRef(null);
    const flashRef      = useRef(null);
    const photoRefs     = useRef([]);
    const centerRef     = useRef(null);
    const wishRef       = useRef(null);
    const btnRef        = useRef(null);
    const [showBtn, setShowBtn]         = useState(false);
    const [wishIndex, setWishIndex]     = useState(0);
    const confettiStopped = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!visible) return;
        confettiStopped.current = false;

        // ── 1. Flash the screen white ──────────────────────────────────────
        gsap.set(overlayRef.current, { opacity: 0, display: 'flex' });
        gsap.set(flashRef.current,   { opacity: 1 });
        gsap.to(overlayRef.current,  { opacity: 1, duration: 0.25 });
        gsap.to(flashRef.current,    { opacity: 0, duration: 0.9, ease: 'power2.out' });

        // ── 2. Set all photos at spawn positions ───────────────────────────
        photoRefs.current.forEach((el, i) => {
            if (!el) return;
            gsap.set(el, {
                x: SPAWN_FROM[i].x,
                y: SPAWN_FROM[i].y,
                rotation: (i % 2 === 0 ? 1 : -1) * (120 + i * 18),
                scale: 0.4,
                opacity: 0,
                transformOrigin: 'center center',
            });
        });
        gsap.set(centerRef.current, { scale: 0, opacity: 0 });
        gsap.set(btnRef.current,    { scale: 0, opacity: 0 });

        // ── 3. Photos explode in with stagger ─────────────────────────────
        photoRefs.current.forEach((el, i) => {
            if (!el) return;
            gsap.to(el, {
                x: LAND_POSITIONS[i].x,
                y: LAND_POSITIONS[i].y,
                rotation: LAND_POSITIONS[i].rot,
                scale: LAND_POSITIONS[i].scale,
                opacity: 1,
                duration: 1.1 + Math.random() * 0.4,
                delay: 0.1 + i * 0.08,
                ease: 'back.out(1.4)',
            });
        });

        // ── 4. Photos gently pulse/float after landing ────────────────────
        photoRefs.current.forEach((el, i) => {
            if (!el) return;
            const floatDelay = 1.3 + i * 0.08;
            gsap.to(el, {
                y: `+=${10 + (i % 3) * 8}`,
                duration: 2 + (i % 4) * 0.4,
                delay: floatDelay,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
            // Subtle scale breathe
            gsap.to(el, {
                scale: (LAND_POSITIONS[i].scale || 1) * 1.04,
                duration: 1.8 + (i % 3) * 0.3,
                delay: floatDelay + 0.2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        });

        // ── 5. Center birthday message pops in ────────────────────────────
        gsap.to(centerRef.current, {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            delay: 0.9,
            ease: 'elastic.out(1, 0.5)',
        });

        // ── 6. Confetti cannons ────────────────────────────────────────────
        const COLORS = ['#ffd700','#e91e63','#ff80ab','#9c27b0','#00e5ff','#ffffff','#ff8c00'];
        const shootConfetti = () => {
            if (confettiStopped.current) return;
            // 4-corner cannons
            confetti({ angle: 50,  spread: 70, origin: { x: 0,   y: 1 }, colors: COLORS, particleCount: 10, startVelocity: 60, gravity: 0.8 });
            confetti({ angle: 130, spread: 70, origin: { x: 1,   y: 1 }, colors: COLORS, particleCount: 10, startVelocity: 60, gravity: 0.8 });
            confetti({ angle: 310, spread: 70, origin: { x: 0,   y: 0 }, colors: COLORS, particleCount: 8,  startVelocity: 55, gravity: 0.85 });
            confetti({ angle: 230, spread: 70, origin: { x: 1,   y: 0 }, colors: COLORS, particleCount: 8,  startVelocity: 55, gravity: 0.85 });
            // Center burst
            confetti({ spread: 360, origin: { x: 0.5, y: 0.5 }, colors: COLORS, particleCount: 6, startVelocity: 25, gravity: 0.4, ticks: 100, scalar: 0.8 });
        };
        const confettiTimer = setInterval(shootConfetti, 280);
        setTimeout(() => { clearInterval(confettiTimer); confettiStopped.current = true; }, 7000);

        // ── 7. Rotating wish text ──────────────────────────────────────────
        let wi = 0;
        const wishInterval = setInterval(() => {
            wi = (wi + 1) % WISHES.length;
            setWishIndex(wi);
            if (wishRef.current) {
                gsap.fromTo(wishRef.current,
                    { opacity: 0, y: 12, scale: 0.95 },
                    { opacity: 1, y: 0,  scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
                );
            }
        }, 2800);

        // ── 8. Show button ─────────────────────────────────────────────────
        setTimeout(() => {
            setShowBtn(true);
            gsap.to(btnRef.current, {
                scale: 1, opacity: 1,
                duration: 0.9,
                ease: 'elastic.out(1, 0.5)',
            });
        }, 3000);

        // ── 9. Mouse parallax ─────────────────────────────────────────────
        const onMouse = (e) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const nx = (e.clientX - cx) / cx;
            const ny = (e.clientY - cy) / cy;
            photoRefs.current.forEach((el, i) => {
                if (!el) return;
                const depth = 0.4 + (i % 5) * 0.12;
                gsap.to(el, {
                    rotateY: nx * 18 * depth,
                    rotateX: -ny * 12 * depth,
                    duration: 0.5,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            });
        };
        window.addEventListener('mousemove', onMouse);

        return () => {
            clearInterval(confettiTimer);
            clearInterval(wishInterval);
            confettiStopped.current = true;
            window.removeEventListener('mousemove', onMouse);
        };
    }, [visible]);

    const handleGoToMemories = () => {
        confettiStopped.current = true;
        gsap.to(overlayRef.current, {
            scale: 1.08,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.in',
            onComplete: () => navigate('/cause'),
        });
    };

    if (!visible) return null;

    return (
        <div ref={overlayRef} className="finale-overlay" style={{ display: 'none' }}>
            {/* Full-screen white flash */}
            <div ref={flashRef} className="finale-flash" />

            {/* All photos */}
            {ALL_PHOTOS.map((photo, i) => (
                <div
                    key={i}
                    ref={(el) => (photoRefs.current[i] = el)}
                    className="finale-photo"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <img src={photo.src} alt={photo.title} />
                    <div className="finale-photo-title">{photo.title}</div>
                </div>
            ))}

            {/* Center message */}
            <div ref={centerRef} className="finale-center">
                <div className="finale-emoji-row">🎂 🎉 🎊 🌟 💖 🎁 ✨</div>
                <h1 className="finale-main-title">Happy Birthday<br />Prachi!</h1>
                <div ref={wishRef} className="finale-wish">{WISHES[wishIndex]}</div>
                <div className="finale-emoji-row">✨ 💕 🌸 🎀 💫 🌺 🎈</div>
            </div>

            {/* CTA */}
            {showBtn && (
                <button ref={btnRef} className="finale-btn" onClick={handleGoToMemories}>
                    <span>See All Our Memories</span>
                    <span className="finale-btn-glow" />
                </button>
            )}
        </div>
    );
};

export default FinaleExplosion;
