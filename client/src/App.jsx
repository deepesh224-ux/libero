import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

import { CartProvider } from './context/CartContext';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BootCanvas from './components/BootCanvas';
import ScrollStory from './components/ScrollStory';
import Collection from './components/Collection';
import Timeline from './components/Timeline';
import Marquee from './components/Marquee';
import Reviews from './components/Reviews';
import PromiseComponent from './components/Promise';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

const App = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const defaultZ = isMobile ? 10 : 7;

    const [activePanel, setActivePanel] = useState(0);
    const [isAutoRotating, setAutoRotating] = useState(true);
    const [isLoading, setLoading] = useState(true);
    const cursorRef = useRef();

    useEffect(() => {
        // Custom Cursor initialization
        if (window.innerWidth > 1024) {
            const moveCursor = (e) => {
                gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.08 });
            };
            window.addEventListener('mousemove', moveCursor);
            
            // Add hover events to cursor expanding elements
            const expanders = document.querySelectorAll('a, button, .card');
            const inc = () => cursorRef.current?.classList.add('big');
            const dec = () => cursorRef.current?.classList.remove('big');
            expanders.forEach(el => {
                el.addEventListener('mouseenter', inc);
                el.addEventListener('mouseleave', dec);
            });

            return () => {
                window.removeEventListener('mousemove', moveCursor);
                expanders.forEach(el => {
                    el.removeEventListener('mouseenter', inc);
                    el.removeEventListener('mouseleave', dec);
                });
            };
        }
        
        // Master scroll refresh for deeply nested component pins
        setTimeout(() => {
            gsap.registerPlugin(ScrollTrigger);
            ScrollTrigger.refresh();
        }, 500);

    }, [isLoading]); // Re-attach when components mount after loading

    return (
        <CartProvider>
            <main>
                <div className="cursor" ref={cursorRef}></div>

                <Preloader setLoading={setLoading} />

                <Navbar />

                <div className="hero-story-wrap">
                    <Hero />

                    {/* CANVAS */}
                    <div 
                        id="canvas-wrap"
                        style={{
                            position: 'sticky',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100vh',
                            pointerEvents: 'none',
                            zIndex: 2,
                            marginTop: '-100vh',
                        }}
                    >
                        <div 
                            className="canvas-container"
                            style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '58%',
                            height: '100%',
                            pointerEvents: 'auto',
                            cursor: 'grab',
                            }}
                        >
                            <Canvas 
                                style={{ width: '100%', height: '100%', display: 'block' }}
                                resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
                                dpr={[1, 2]}
                                camera={{ 
                                    fov: 45, 
                                    near: 0.1, 
                                    far: 1000, 
                                    position: [0, 0.5, 5]
                                }}
                                gl={{ 
                                    antialias: true, 
                                    alpha: true,
                                    toneMapping: THREE.ACESFilmicToneMapping,
                                    toneMappingExposure: 1.3
                                }}
                            >
                                <Environment preset="city" />
                                
                                <ambientLight intensity={0.5} color={0xffffff} />
                                <directionalLight position={[-4, 6, 6]} intensity={0.9} color={0xffffff} />
                                
                                <pointLight color={0xE8E8E8} intensity={0.7} position={[2, 2, 3]} />
                                <pointLight color={0xC41E3A} intensity={0.35} position={[-2, -1, 2]} />
                                <pointLight color={0x1A6B3C} intensity={0.2} position={[0, -2, 0]} />
                                <pointLight color={0xffffff} intensity={0.5} position={[0, 0, -4]} />
                                <pointLight color={0xffffff} intensity={0.4} position={[0, 4, 0]} />
                                <pointLight color={0xffffff} intensity={0.35} position={[0, -4, 0]} />
                                <pointLight color={0xffffff} intensity={0.4} position={[4, 0, 0]} />
                                <pointLight color={0xffffff} intensity={0.4} position={[-4, 0, 0]} />
                                
                                <Suspense fallback={null}>
                                    <BootCanvas activePanel={activePanel} isAutoRotating={isAutoRotating} />
                                </Suspense>
                                <OrbitControls 
                                    makeDefault
                                    enablePan={false} 
                                    enableZoom={false} 
                                    dampingFactor={0.06} 
                                    enableDamping 
                                />
                            </Canvas>
                        </div>
                    </div>

                    <ScrollStory setActivePanel={setActivePanel} setAutoRotating={setAutoRotating} />
                </div>

                <Collection />
                
                <Timeline />
                
                <Marquee />

                <Reviews />

                <PromiseComponent />

                <Newsletter />

                <Footer />
            </main>
        </CartProvider>
    );
};

export default App;
