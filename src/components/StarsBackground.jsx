import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

const StarsBackground = ({ count = 80 }) => {
    const containerRef = useRef(null);

    const starCount = window.innerWidth < 768 ? Math.floor(count / 2) : count;
    const elements = ['✨', '💖', '💗', '🤍', '🌸', '⭐', '🌟', '💫'];

    const stars = useMemo(() => {
        return Array.from({ length: starCount }).map((_, i) => ({
            id: i,
            char: elements[Math.floor(Math.random() * elements.length)],
            size: Math.random() * 10 + 4,
            left: Math.random() * 100,
            top: Math.random() * 100,
            opacity: Math.random() * 0.5 + 0.1,
        }));
    }, [starCount]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.floating-star').forEach((star) => {
                gsap.to(star, {
                    y: `-=${Math.random() * 100 + 30}`,
                    x: `+=${Math.random() * 40 - 20}`,
                    rotation: Math.random() * 360,
                    opacity: Math.random() * 0.8 + 0.2,
                    duration: Math.random() * 10 + 8,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: Math.random() * -20,
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div id="stars-container" ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="floating-star floating"
                    style={{
                        fontSize: `${star.size}px`,
                        left: `${star.left}vw`,
                        top: `${star.top}vh`,
                        opacity: star.opacity,
                        position: 'absolute'
                    }}
                >
                    {star.char}
                </div>
            ))}
        </div>
    );
};

export default StarsBackground;
