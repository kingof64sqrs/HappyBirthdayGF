import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Cursor = () => {
    const cursorOuterRef = useRef(null);
    const cursorInnerRef = useRef(null);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (isTouch) return;
        setIsDesktop(true);
    }, []);

    useEffect(() => {
        if (!isDesktop) return;

        const cursorOuter = cursorOuterRef.current;
        const cursorInner = cursorInnerRef.current;

        const onMouseMove = (e) => {
            gsap.to(cursorOuter, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: 'power2.out',
            });

            gsap.set(cursorInner, {
                x: e.clientX,
                y: e.clientY,
            });
        };

        document.addEventListener('mousemove', onMouseMove);

        const handleMouseOver = (e) => {
            if (
                e.target.tagName.toLowerCase() === 'button' ||
                e.target.closest('button') ||
                e.target.tagName.toLowerCase() === 'a' ||
                e.target.closest('a') ||
                e.target.closest('.reason-card') ||
                e.target.closest('.memory-card') ||
                e.target.closest('.cta-button') ||
                e.target.closest('.shuffle-button')
            ) {
                cursorOuter.classList.add('hover-state');
            }
        };

        const handleMouseOut = (e) => {
            if (
                e.target.tagName.toLowerCase() === 'button' ||
                e.target.closest('button') ||
                e.target.tagName.toLowerCase() === 'a' ||
                e.target.closest('a') ||
                e.target.closest('.reason-card') ||
                e.target.closest('.memory-card') ||
                e.target.closest('.cta-button') ||
                e.target.closest('.shuffle-button')
            ) {
                cursorOuter.classList.remove('hover-state');
            }
        };

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, [isDesktop]);

    if (!isDesktop) return null;

    return (
        <>
            <div ref={cursorOuterRef} className="cursor"></div>
            <div ref={cursorInnerRef} className="current-cursor-dot"></div>
        </>
    );
};

export default Cursor;
