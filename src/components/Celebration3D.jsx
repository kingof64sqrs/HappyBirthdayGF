import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

// ─── Gift Box (with drop + jiggle + explosive open) ──────────────────────────
const GiftBox = ({ stage, onOpen, onDropComplete }) => {
    const groupRef = useRef();
    const lidRef = useRef();
    const boxBodyRef = useRef();
    const lidSpeed = useRef(0);
    const dropY = useRef(14);
    const hasDropped = useRef(false);
    const glowRef = useRef();

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;

        if (stage === 'drop') {
            dropY.current = THREE.MathUtils.lerp(dropY.current, 0, Math.min(delta * 3.5, 1));
            groupRef.current.position.y = dropY.current;
            if (!hasDropped.current && dropY.current < 0.25) {
                hasDropped.current = true;
                groupRef.current.scale.set(1.15, 0.82, 1.15);
                onDropComplete();
            }
        }

        if (stage === 'idle') {
            groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 6);
            groupRef.current.position.y = Math.sin(t * 2.2) * 0.12;
            groupRef.current.rotation.y = Math.sin(t * 1.4) * 0.07;
            groupRef.current.rotation.z = Math.sin(t * 3.1) * 0.025;
            if (glowRef.current) {
                glowRef.current.intensity = 2.5 + Math.sin(t * 3) * 1;
            }
        }

        if (stage === 'opening') {
            if (lidRef.current) {
                lidSpeed.current += delta * 18;
                lidRef.current.position.y = Math.min(
                    lidRef.current.position.y + lidSpeed.current * delta,
                    8
                );
                lidRef.current.rotation.x -= delta * 5;
                lidRef.current.rotation.z += delta * 3;
                lidRef.current.rotation.y += delta * 4;
            }
            if (boxBodyRef.current) {
                boxBodyRef.current.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), delta * 2.5);
            }
        }
    });

    if (stage === 'cake' || stage === 'done') return null;

    return (
        <group ref={groupRef} position={[0, 14, 0]}>
            <pointLight ref={glowRef} position={[0, 0, 0]} intensity={2.5} color="#e91e63" distance={5} />
            <pointLight position={[0, 0.5, 0]} intensity={1.5} color="#ffd700" distance={3} />

            {/* Invisible click target */}
            <mesh
                visible={false}
                position={[0, 0, 0]}
                onClick={stage === 'idle' ? onOpen : undefined}
                onPointerOver={() => { if (stage === 'idle') document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; }}
            >
                <boxGeometry args={[2.5, 2.5, 2.5]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Box Body */}
            <group ref={boxBodyRef}>
                <mesh position={[0, -0.5, 0]}>
                    <boxGeometry args={[2, 1.5, 2]} />
                    <meshStandardMaterial color="#b71c6e" roughness={0.15} metalness={0.85} emissive="#7c0040" emissiveIntensity={0.4} />
                </mesh>
                <mesh position={[0, -0.5, 0]}>
                    <boxGeometry args={[2.06, 1.56, 0.28]} />
                    <meshStandardMaterial color="#ffd700" roughness={0.05} metalness={1} emissive="#cc7700" emissiveIntensity={0.5} />
                </mesh>
                <mesh position={[0, -0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[2.06, 1.56, 0.28]} />
                    <meshStandardMaterial color="#ffd700" roughness={0.05} metalness={1} emissive="#cc7700" emissiveIntensity={0.5} />
                </mesh>
            </group>

            {/* Lid */}
            <group ref={lidRef} position={[0, 0.3, 0]}>
                <mesh>
                    <boxGeometry args={[2.2, 0.4, 2.2]} />
                    <meshStandardMaterial color="#b71c6e" roughness={0.15} metalness={0.85} emissive="#7c0040" emissiveIntensity={0.4} />
                </mesh>
                <mesh position={[0, 0.06, 0]}>
                    <boxGeometry args={[2.26, 0.46, 0.34]} />
                    <meshStandardMaterial color="#ffd700" roughness={0.05} metalness={1} emissive="#cc7700" emissiveIntensity={0.5} />
                </mesh>
                <mesh position={[0, 0.06, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[2.26, 0.46, 0.34]} />
                    <meshStandardMaterial color="#ffd700" roughness={0.05} metalness={1} emissive="#cc7700" emissiveIntensity={0.5} />
                </mesh>
                <mesh position={[0.24, 0.34, 0]} rotation={[0, 0, Math.PI / 4]}>
                    <torusGeometry args={[0.24, 0.065, 16, 32]} />
                    <meshStandardMaterial color="#ffd700" roughness={0.05} metalness={1} emissive="#ff7700" emissiveIntensity={0.6} />
                </mesh>
                <mesh position={[-0.24, 0.34, 0]} rotation={[0, 0, -Math.PI / 4]}>
                    <torusGeometry args={[0.24, 0.065, 16, 32]} />
                    <meshStandardMaterial color="#ffd700" roughness={0.05} metalness={1} emissive="#ff7700" emissiveIntensity={0.6} />
                </mesh>
                <mesh position={[0, 0.36, 0]}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshStandardMaterial color="#ffd700" roughness={0.05} metalness={1} emissive="#ff7700" emissiveIntensity={0.8} />
                </mesh>
            </group>
        </group>
    );
};

// ─── Candle ───────────────────────────────────────────────────────────────────
const Candle = ({ position, blown, onBlow, index }) => {
    const flameRef = useRef();
    const lightRef = useRef();
    const smokeRef = useRef();
    const smokeTimer = useRef(0);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;
        if (!blown) {
            if (flameRef.current) {
                const flicker = 0.82 + Math.sin(t * 22 + index * 2.1) * 0.18 + Math.cos(t * 15 + index * 1.4) * 0.08;
                flameRef.current.scale.setScalar(flicker);
                flameRef.current.position.x = Math.sin(t * 12 + index) * 0.01;
            }
            if (lightRef.current) {
                lightRef.current.intensity = 1.8 + Math.sin(t * 18 + index * 3.2) * 0.7;
            }
        }
        if (blown && smokeRef.current && smokeRef.current.visible) {
            smokeTimer.current += delta;
            const opacity = Math.max(0, 0.6 - smokeTimer.current * 0.9);
            smokeRef.current.position.y = 0.9 + Math.min(smokeTimer.current * 0.6, 1.2);
            smokeRef.current.material.opacity = opacity;
            smokeRef.current.scale.setScalar(Math.min(1 + smokeTimer.current * 0.8, 2.2));
            if (opacity <= 0) smokeRef.current.visible = false;
        }
    });

    return (
        <group
            position={position}
            onClick={(e) => { e.stopPropagation(); if (!blown) onBlow(index); }}
            onPointerOver={() => { if (!blown) document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
            <mesh position={[0, 0.42, 0]}>
                <cylinderGeometry args={[0.052, 0.048, 0.82, 16]} />
                <meshStandardMaterial color="#fff8f8" roughness={0.55} />
            </mesh>
            {[0.18, 0.42, 0.66].map((y, i) => (
                <mesh key={i} position={[0, y, 0]}>
                    <torusGeometry args={[0.054, 0.013, 8, 16]} />
                    <meshStandardMaterial color={i % 2 === 0 ? '#ff1493' : '#ff8c00'} emissive={i % 2 === 0 ? '#aa0066' : '#cc4400'} emissiveIntensity={0.4} />
                </mesh>
            ))}
            <mesh position={[0, 0.86, 0]}>
                <cylinderGeometry args={[0.006, 0.006, 0.08, 8]} />
                <meshStandardMaterial color="#222" />
            </mesh>

            {!blown && (
                <>
                    <group ref={flameRef} position={[0, 0.96, 0]}>
                        <mesh>
                            <sphereGeometry args={[0.055, 16, 16]} />
                            <meshBasicMaterial color="#ff6600" />
                        </mesh>
                        <mesh position={[0, 0.02, 0]}>
                            <sphereGeometry args={[0.03, 16, 16]} />
                            <meshBasicMaterial color="#ffffaa" />
                        </mesh>
                        <mesh position={[0, 0.1, 0]}>
                            <coneGeometry args={[0.045, 0.2, 16]} />
                            <meshBasicMaterial color="#ffe100" />
                        </mesh>
                        <mesh position={[0, 0.22, 0]}>
                            <sphereGeometry args={[0.015, 8, 8]} />
                            <meshBasicMaterial color="#ffffff" />
                        </mesh>
                    </group>
                    <pointLight ref={lightRef} position={[0, 1.05, 0]} distance={2.2} intensity={1.8} color="#ffae00" />
                </>
            )}

            {blown && (
                <mesh ref={smokeRef} position={[0, 0.92, 0]}>
                    <sphereGeometry args={[0.06, 8, 8]} />
                    <meshBasicMaterial color="#cccccc" transparent opacity={0.6} depthWrite={false} />
                </mesh>
            )}
        </group>
    );
};

// ─── Birthday Cake ────────────────────────────────────────────────────────────
const CANDLE_POSITIONS = [
    [0, 1.55, 0],
    [0.58, 1.55, 0.32],
    [-0.58, 1.55, 0.32],
    [0.32, 1.55, -0.56],
    [-0.32, 1.55, -0.56],
];

const BirthdayCake = ({ visible, blownCandles, onCandleBlow }) => {
    const cakeRef = useRef();
    const scaleProgress = useRef(0);

    useFrame((state, delta) => {
        if (!cakeRef.current) return;
        if (visible && scaleProgress.current < 1) {
            scaleProgress.current = Math.min(1, scaleProgress.current + delta * 1.8);
            const s = scaleProgress.current;
            const elastic = s < 0.6 ? (s / 0.6) * 1.12 : 1.12 - ((s - 0.6) / 0.4) * 0.12;
            cakeRef.current.scale.set(elastic, elastic, elastic);
        }
        if (visible) {
            cakeRef.current.rotation.y += delta * 0.18;
        }
    });

    return (
        <group ref={cakeRef} position={[0, -0.9, 0]} scale={[0, 0, 0]}>
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[1.75, 1.95, 0.1, 32]} />
                <meshStandardMaterial color="#c8b8d0" metalness={0.7} roughness={0.2} emissive="#9966aa" emissiveIntensity={0.1} />
            </mesh>
            <mesh position={[0, 0.52, 0]}>
                <cylinderGeometry args={[1.38, 1.38, 0.9, 32]} />
                <meshStandardMaterial color="#ff80ab" roughness={0.35} emissive="#c2185b" emissiveIntensity={0.12} />
            </mesh>
            {Array.from({ length: 10 }, (_, i) => i * (Math.PI * 2 / 10)).map((angle, i) => (
                <mesh key={i} position={[Math.cos(angle) * 1.32, 0.94, Math.sin(angle) * 1.32]}>
                    <sphereGeometry args={[0.09, 8, 8]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0} />
                </mesh>
            ))}
            <mesh position={[0, 0.99, 0]}>
                <torusGeometry args={[1.33, 0.11, 16, 32]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} emissive="#eeeeee" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 1.35, 0]}>
                <cylinderGeometry args={[0.92, 0.92, 0.72, 32]} />
                <meshStandardMaterial color="#fce4ec" roughness={0.35} emissive="#e91e63" emissiveIntensity={0.1} />
            </mesh>
            <mesh position={[0, 1.72, 0]}>
                <torusGeometry args={[0.87, 0.11, 16, 32]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} emissive="#eeeeee" emissiveIntensity={0.2} />
            </mesh>
            {Array.from({ length: 6 }, (_, i) => i * (Math.PI * 2 / 6)).map((angle, i) => (
                <mesh key={i} position={[Math.cos(angle) * 1.25, 0.66, Math.sin(angle) * 1.25]}>
                    <sphereGeometry args={[0.075, 8, 8]} />
                    <meshStandardMaterial color={i % 2 === 0 ? '#ffd700' : '#ff4fa0'} metalness={0.3} roughness={0.3} />
                </mesh>
            ))}
            {Array.from({ length: 5 }, (_, i) => i * (Math.PI * 2 / 5)).map((angle, i) => (
                <mesh key={i} position={[Math.cos(angle) * 0.72, 1.48, Math.sin(angle) * 0.72]}>
                    <octahedronGeometry args={[0.07, 0]} />
                    <meshStandardMaterial color="#ffd700" metalness={0.5} roughness={0.2} />
                </mesh>
            ))}
            {CANDLE_POSITIONS.map((pos, i) => (
                <Candle key={i} index={i} position={pos} blown={blownCandles.has(i)} onBlow={onCandleBlow} />
            ))}
        </group>
    );
};

// ─── Polaroid Overlay ─────────────────────────────────────────────────────────
const POLAROID_PHOTOS = [
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.08%20AM.jpeg', caption: 'Radiant Soul ✨' },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.09%20AM.jpeg', caption: 'Together 💕' },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%201.22.31%20PM.jpeg', caption: 'Pure Joy 🌸' },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%2011.13.12%20AM.jpeg', caption: 'Beautiful 🌟' },
    { src: '/photos/WhatsApp%20Image%202026-03-06%20at%201.24.34%20PM.jpeg', caption: 'Forever 💖' },
];

const FLY_FROM = [
    { x: '-140vw', y: '-50vh' },
    { x: '140vw',  y: '-40vh' },
    { x: '-140vw', y: '40vh'  },
    { x: '140vw',  y: '50vh'  },
    { x: '0vw',    y: '140vh' },
];

const LAND_AT = [
    { x: '-43vw', y: '-34vh', rot: -16 },
    { x: '43vw',  y: '-32vh', rot: 14  },
    { x: '-43vw', y: '28vh',  rot: 12  },
    { x: '43vw',  y: '26vh',  rot: -12 },
    { x: '0vw',   y: '40vh',  rot: 5   },
];

const PolaroidPhotos = ({ visible }) => {
    const refs = useRef([]);

    useEffect(() => {
        if (!visible) return;

        refs.current.forEach((el, i) => {
            if (!el) return;
            gsap.set(el, {
                x: FLY_FROM[i].x,
                y: FLY_FROM[i].y,
                rotation: LAND_AT[i].rot * 2.5,
                opacity: 0,
                scale: 0.7,
            });
            gsap.to(el, {
                x: LAND_AT[i].x,
                y: LAND_AT[i].y,
                rotation: LAND_AT[i].rot,
                opacity: 1,
                scale: 1,
                duration: 1.5 + i * 0.1,
                delay: 0.4 + i * 0.25,
                ease: 'back.out(1.6)',
            });
        });

        refs.current.forEach((el, i) => {
            if (!el) return;
            gsap.to(el, {
                y: `+=${14 + i * 4}`,
                duration: 2.4 + i * 0.3,
                delay: 2.6 + i * 0.18,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        });

        const onMouse = (e) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const nx = (e.clientX - cx) / cx;
            const ny = (e.clientY - cy) / cy;
            refs.current.forEach((el, i) => {
                if (!el) return;
                const d = 0.5 + i * 0.14;
                gsap.to(el, {
                    rotateY: nx * 15 * d,
                    rotateX: -ny * 10 * d,
                    duration: 0.6,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            });
        };

        window.addEventListener('mousemove', onMouse);
        return () => window.removeEventListener('mousemove', onMouse);
    }, [visible]);

    if (!visible) return null;

    return (
        <div style={{ position: 'fixed', top: '50%', left: '50%', pointerEvents: 'none', zIndex: 50, perspective: '1200px' }}>
            {POLAROID_PHOTOS.map((photo, i) => (
                <div
                    key={i}
                    ref={(el) => (refs.current[i] = el)}
                    className="polaroid-card"
                    style={{ position: 'absolute', transform: 'translate(-50%,-50%)', willChange: 'transform', transformStyle: 'preserve-3d' }}
                >
                    <img src={photo.src} alt={photo.caption} />
                    <div className="polaroid-caption">{photo.caption}</div>
                </div>
            ))}
        </div>
    );
};

// ─── Candle Counter HUD ───────────────────────────────────────────────────────
const CandleHUD = ({ count }) => (
    <div className="candle-hud">
        <div className="candle-hud-flames">
            {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={`candle-hud-icon ${i < count ? 'blown' : 'lit'}`}>
                    {i < count ? '💨' : '🕯️'}
                </span>
            ))}
        </div>
        <div className="candle-hud-text">
            {count < 5
                ? `${count}/5 candles blown — click each one to blow it out!`
                : '🎉 All wishes made! 🎉'}
        </div>
    </div>
);

// ─── Main Export ──────────────────────────────────────────────────────────────
const Celebration3D = ({ onOpenComplete, onAllCandlesBlown }) => {
    const [stage, setStage] = useState('drop');
    const [blownCandles, setBlownCandles] = useState(new Set());
    const [showPolaroids, setShowPolaroids] = useState(false);

    const handleDropComplete = useCallback(() => setStage('idle'), []);

    const handleOpen = useCallback(() => {
        if (stage !== 'idle') return;
        setStage('opening');

        const burst = (delay) =>
            setTimeout(() => {
                confetti({ particleCount: 130, spread: 90, origin: { x: 0.5, y: 0.55 }, colors: ['#e91e63','#ffd700','#ff80ab','#ffffff','#9c27b0','#00e5ff'], startVelocity: 50, gravity: 0.75, scalar: 1.1 });
                confetti({ particleCount: 70, spread: 360, origin: { x: 0.5, y: 0.55 }, colors: ['#ffd700','#ff1493','#00e5ff','#ffffff'], startVelocity: 35, gravity: 0.5, ticks: 80 });
            }, delay);

        burst(0); burst(350); burst(750);

        setTimeout(() => {
            setStage('cake');
            setShowPolaroids(true);
            if (onOpenComplete) onOpenComplete();
        }, 2200);
    }, [stage, onOpenComplete]);

    const handleCandleBlow = useCallback((index) => {
        setBlownCandles((prev) => {
            if (prev.has(index)) return prev;
            const next = new Set(prev);
            next.add(index);

            confetti({ particleCount: 35, spread: 65, origin: { x: 0.5, y: 0.5 }, colors: ['#ffd700','#ff80ab','#ffffff','#9c27b0'], startVelocity: 22, gravity: 0.95, scalar: 0.85 });

            if (next.size === 5) {
                setTimeout(() => {
                    setStage('done');
                    const end = Date.now() + 5000;
                    const fire = () => {
                        confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ffd700','#e91e63','#ffffff'], startVelocity: 55 });
                        confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#9c27b0','#00e5ff','#ffd700'], startVelocity: 55 });
                        if (Date.now() < end) requestAnimationFrame(fire);
                    };
                    fire();
                    if (onAllCandlesBlown) onAllCandlesBlown();
                }, 600);
            }
            return next;
        });
    }, [onAllCandlesBlown]);

    const promptText =
        stage === 'idle'    ? '🎁 Click The Gift Box To Open!' :
        stage === 'cake'    ? '🎂 Click Each Candle To Blow It Out!' :
        stage === 'done'    ? '🎉 Wishes Granted — Happy Birthday! 🎉' : '';

    return (
        <div style={{ width: '100%', height: '440px', position: 'relative', zIndex: 10, margin: '1rem 0 0' }}>
            {promptText && (
                <div className={`gift-prompt ${stage === 'done' ? 'done-prompt' : ''}`}
                    style={{ position: 'absolute', top: '6px', width: '100%', textAlign: 'center', pointerEvents: 'none', zIndex: 20 }}>
                    {promptText}
                </div>
            )}

            {(stage === 'cake' || stage === 'done') && <CandleHUD count={blownCandles.size} />}

            <PolaroidPhotos visible={showPolaroids} />

            <Canvas
                camera={{ position: [0, 3, 8], fov: 42 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                shadows
            >
                <ambientLight intensity={0.7} />
                <directionalLight position={[4, 8, 4]} intensity={2} color="#fff5ee" />
                <pointLight position={[-5, 4, 3]} intensity={3} color="#ff4fa0" />
                <pointLight position={[5, 2, 4]} intensity={2.5} color="#ffd700" />
                <pointLight position={[0, 6, -3]} intensity={1.5} color="#aa88ff" />

                <GiftBox stage={stage} onOpen={handleOpen} onDropComplete={handleDropComplete} />
                <BirthdayCake visible={stage === 'cake' || stage === 'done'} blownCandles={blownCandles} onCandleBlow={handleCandleBlow} />

                <OrbitControls enableZoom={false} enablePan={false} autoRotate={stage === 'done'} autoRotateSpeed={2.5} maxPolarAngle={Math.PI / 2 + 0.15} minPolarAngle={Math.PI / 5} enableDamping />
            </Canvas>
        </div>
    );
};

export default Celebration3D;
