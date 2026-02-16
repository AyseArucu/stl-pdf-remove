'use client';

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Center, PerspectiveCamera, Html, useProgress } from '@react-three/drei';
import { STLLoader, ThreeMFLoader } from 'three-stdlib';
import * as THREE from 'three';

// Loading Indicator
function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center bg-white/80 p-4 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-sm font-medium text-purple-900">{progress.toFixed(0)}% Yükleniyor</span>
            </div>
        </Html>
    );
}

// Error Boundary for Model Loading
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("STLViewer Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Html center>
                    <div className="text-red-500 bg-white p-4 rounded shadow-lg text-center">
                        <p className="font-bold">Model Yüklenemedi</p>
                        <p className="text-xs">Dosya formatı desteklenmiyor veya bozuk.</p>
                    </div>
                </Html>
            );
        }

        return this.props.children;
    }
}

// Model Component that handles both STL and 3MF
function Model({ url }: { url: string }) {
    const fileExtension = useMemo(() => {
        // Handle cases where url might be complex or just a filename
        const parts = url.split('.');
        if (parts.length < 2) return 'stl'; // fallback default
        return parts.pop()?.toLowerCase();
    }, [url]);

    const is3mf = fileExtension === '3mf';
    const LoaderClass = is3mf ? ThreeMFLoader : STLLoader;

    // useLoader returns BufferGeometry for STL and Group for 3MF
    const result = useLoader(LoaderClass as any, url, (loader) => {
        // Optional: configure loader if needed
    });

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (result && 'dispose' in result) {
                (result as any).dispose();
            }
        }
    }, [result]);

    if (!is3mf) {
        return (
            <Center>
                <mesh geometry={result as THREE.BufferGeometry} castShadow receiveShadow>
                    <meshStandardMaterial
                        color="#808080"
                        roughness={0.5}
                        metalness={0.2}
                    />
                </mesh>
            </Center>
        );
    }

    // For 3MF (Group)
    return (
        <Center>
            <primitive object={result} castShadow receiveShadow />
        </Center>
    );
}

interface STLViewerProps {
    url: string;
    className?: string;
}

export default function STLViewer({ url, className }: STLViewerProps) {
    // Handle mounting state for hydration mismatch avoidance
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return (
        <div className={`w-full h-[500px] bg-gray-100 rounded-xl flex items-center justify-center ${className}`}>
            <p className="text-gray-400">Yükleniyor...</p>
        </div>
    );

    return (
        <div className={`w-full bg-gray-50 rounded-xl overflow-hidden shadow-inner border border-gray-200 relative ${className || 'h-[500px]'}`}>
            <Canvas
                shadows
                gl={{ antialias: true, preserveDrawingBuffer: true }}
                camera={{ position: [100, 100, 100], fov: 45 }}
            >
                <color attach="background" args={['#f8fafc']} /> {/* Açık gri arka plan */}

                {/* Environment Lights */}
                <ambientLight intensity={0.6} />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={1.0}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <directionalLight position={[-10, -10, -10]} intensity={0.4} color="#e0e7ff" />

                <Suspense fallback={<Loader />}>
                    <ErrorBoundary>
                        <Model url={url} />
                    </ErrorBoundary>
                </Suspense>

                <OrbitControls
                    makeDefault
                    autoRotate={true}
                    autoRotateSpeed={2.0}
                    enablePan={true}
                    enableZoom={true}
                    minDistance={10}
                    maxDistance={1000}
                />
            </Canvas>

            <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-md text-xs text-gray-500 shadow-sm pointer-events-none">
                Sol Tık: Döndür | Sağ Tık: Kaydır | Tekerlek: Zoom
            </div>
        </div>
    );
}
