import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshTransmissionMaterial, Environment, Sphere, Torus, Octahedron } from '@react-three/drei';
import * as THREE from 'three';

// Detect if device is mobile
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
};

const PremiumShape = ({ position, rotation, renderOrder, type = 'torus', color = '#ffffff' }) => {
    const meshRef = useRef();
    const mobile = useMemo(() => isMobile(), []);

    useFrame((state, delta) => {
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.3;
    });

    // Reduce geometry complexity on mobile
    const geometryArgs = useMemo(() => {
        if (mobile) {
            return {
                torus: [1, 0.4, 16, 32],
                sphere: [0.8, 32, 32],
                octahedron: [1, 0]
            };
        }
        return {
            torus: [1, 0.4, 32, 64],
            sphere: [0.8, 64, 64],
            octahedron: [1, 0]
        };
    }, [mobile]);

    return (
        <Float
            speed={1.5}
            rotationIntensity={1}
            floatIntensity={2}
            position={position}
        >
            <mesh ref={meshRef} rotation={rotation} renderOrder={renderOrder}>
                {type === 'torus' && <torusGeometry args={geometryArgs.torus} />}
                {type === 'sphere' && <sphereGeometry args={geometryArgs.sphere} />}
                {type === 'octahedron' && <octahedronGeometry args={geometryArgs.octahedron} />}

                <MeshTransmissionMaterial
                    color={color}
                    resolution={mobile ? 512 : 1024}
                    thickness={0.5}
                    roughness={0.1}
                    transmission={1}
                    ior={1.5}
                    chromaticAberration={mobile ? 0.05 : 0.1}
                    backside
                />
            </mesh>
        </Float>
    );
};

const GlowHeart = ({ position, scale = 1 }) => {
    const meshRef = useRef();

    // Custom rough heart shape
    const heartShape = new THREE.Shape();
    heartShape.moveTo(25, 25);
    heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

    const extrudeSettings = {
        depth: 8,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 1,
        bevelThickness: 1
    };

    useFrame((state, delta) => {
        meshRef.current.rotation.y += delta * 0.3;
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5} position={position}>
            <mesh
                ref={meshRef}
                scale={[scale * 0.01, scale * 0.01, scale * 0.01]} // scale down from SVG coords
                rotation={[Math.PI, 0, 0]} // Flip it right side up
            >
                <extrudeGeometry args={[heartShape, extrudeSettings]} />
                <meshStandardMaterial
                    color="#ff3366"
                    emissive="#ff0033"
                    emissiveIntensity={0.8}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
            <pointLight position={position} color="#ff3366" intensity={2} distance={5} />
        </Float>
    );
};

const Scene = () => {
    const mobile = useMemo(() => isMobile(), []);

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={2} color="#8a2be2" />

            {/* Always render these main elements */}
            <PremiumShape position={[-4, 2, -5]} rotation={[0, 0, 0]} type="torus" color="#ffffff" />
            <PremiumShape position={[5, -3, -8]} rotation={[0.5, 0.5, 0]} type="sphere" color="#ffe6f3" />
            <PremiumShape position={[-6, -4, -6]} rotation={[-0.5, 0.5, 0]} type="octahedron" color="#e6e6ff" />

            {/* Render additional elements only on desktop */}
            {!mobile && (
                <>
                    <PremiumShape position={[4, 4, -4]} rotation={[0.2, -0.4, 0]} type="torus" color="#ffcce6" />
                    <PremiumShape position={[-2, -1, -3]} rotation={[0.8, 0.1, 0]} type="octahedron" color="#ccffff" />
                </>
            )}

            <GlowHeart position={[0, 0, -10]} scale={mobile ? 1.5 : 2} />
            {!mobile && (
                <>
                    <GlowHeart position={[-3, 4, -8]} scale={1.2} />
                    <GlowHeart position={[3, -2, -6]} scale={1.5} />
                </>
            )}

            <Sparkles count={mobile ? 100 : 200} scale={15} size={mobile ? 1.5 : 2} speed={0.4} opacity={0.5} color="#ffd700" />
            <Environment preset="city" />
        </>
    );
};

const FloatingElements3D = () => {
    const mobile = useMemo(() => isMobile(), []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: mobile ? 50 : 45 }}
                dpr={mobile ? [1, 1.5] : [1, 2]}
                performance={{ min: 0.5 }}
                gl={{
                    powerPreference: mobile ? 'low-power' : 'high-performance',
                    antialias: !mobile,
                    alpha: true,
                }}
            >
                <Scene />
            </Canvas>
        </div>
    );
};

export default FloatingElements3D;
