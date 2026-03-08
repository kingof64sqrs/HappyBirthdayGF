import React, { useMemo } from 'react';

// dot seed positions (left%, top%) – spread across entire viewport
const DOT_SEEDS = [
  [8,12],[92,8],[15,82],[87,78],[45,5],[55,95],[3,48],[97,52],
  [22,28],[78,22],[30,68],[70,72],[12,60],[88,38],[40,18],[60,88],
  [50,45],[25,90],
];

const FloatingElements3D = () => {
  const dots = useMemo(() => DOT_SEEDS.map(([l, t], i) => ({
    left: l,
    top: t,
    size: 3 + (i % 4),
    dur: 4 + (i % 7) * 1.3,
    delay: -(i * 0.9),
  })), []);

  return (
    <div className="floating-bg" aria-hidden="true">
      {/* Ambient glow orbs */}
      <div className="fb-orb fb-orb-1" />
      <div className="fb-orb fb-orb-2" />
      <div className="fb-orb fb-orb-3" />
      <div className="fb-orb fb-orb-4" />

      {/* Floating hearts */}
      <span className="fb-heart fb-heart-1">♥</span>
      <span className="fb-heart fb-heart-2">♥</span>
      <span className="fb-heart fb-heart-3">♥</span>

      {/* Sparkle dots */}
      {dots.map((d, i) => (
        <div
          key={i}
          className="fb-dot"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements3D;
