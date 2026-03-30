import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Environment, Html } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// ─── THREE.JS CONFIGS ───
const PANEL_CONFIGS = [
    { rx: 0, ry: 0, cx: 0, cy: 0.2, cz: 2.2 },
    { rx: -1.3, ry: 0.3, cx: 0, cy: 0.0, cz: 2.0 },
    { rx: 0, ry: Math.PI / 2, cx: 0.3, cy: 0.15, cz: 2.0 },
    { rx: 0.65, ry: 0.4, cx: 0, cy: 0.5, cz: 1.8 },
    { rx: 0.2, ry: 0.8, cx: -0.1, cy: 0.15, cz: 2.2 },
];

// ─── COMPONENTS ───

function Boot({ activePanel, isAutoRotating }) {
    const { scene } = useGLTF('public/assets/boot.glb');
    const groupRef = useRef();
    const modelRef = useRef();

    useEffect(() => {
        if (scene) {
            const box = new THREE.Box3().setFromObject(scene);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const s = 1.7 / Math.max(size.x, size.y, size.z);
            scene.scale.setScalar(s);
            scene.position.sub(center.multiplyScalar(s));
            modelRef.current = scene;
        }
    }, [scene]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.055;
            if (isAutoRotating) {
                groupRef.current.rotation.y += 0.002;
            }
        }
    });

    useEffect(() => {
        if (groupRef.current) {
            const cfg = PANEL_CONFIGS[activePanel];
            gsap.to(groupRef.current.rotation, {
                x: cfg.rx, y: cfg.ry,
                duration: 1.4, ease: 'power2.inOut'
            });
        }
    }, [activePanel]);

    return <group ref={groupRef}><primitive object={scene} /></group>;
}

const Navbar = () => {
    const [isSolid, setSolid] = useState(false);
    const [isMobOpen, setMobOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setSolid(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`nav ${isSolid ? 'solid' : ''}`}>
                <a href="#" className="nav-logo">LIBERO</a>
                <div className="nav-links">
                    <a href="#collection">Collection</a>
                    <a href="#heritage">Technology</a>
                    <a href="#tl-sec">Heritage</a>
                    <a href="#footer">Contact</a>
                </div>
                <div className="nav-icons">
                    <a href="#" className="hide-mob">Search</a>
                    <a href="#" className="hide-mob">♥</a>
                    <a href="#">Bag <span className="cart-n">(2)</span></a>
                    <button className={`hamburger hide-desk ${isMobOpen ? 'open' : ''}`} onClick={() => setMobOpen(!isMobOpen)}>
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </nav>
            <div className={`mob-menu ${isMobOpen ? 'active' : ''}`}>
                <div className="mob-menu-inner">
                    <a href="#collection" onClick={() => setMobOpen(false)}>Collection</a>
                    <a href="#heritage" onClick={() => setMobOpen(false)}>Technology</a>
                    <a href="#tl-sec" onClick={() => setMobOpen(false)}>Heritage</a>
                    <a href="#footer" onClick={() => setMobOpen(false)}>Contact</a>
                </div>
            </div>
        </>
    );
};

const App = () => {
    const [products, setProducts] = useState([]);
    const [email, setEmail] = useState('');
    const [activePanel, setActivePanel] = useState(0);
    const [isAutoRotating, setAutoRotating] = useState(true);
    const [isLoading, setLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);

    const cursorRef = useRef();
    const { scrollYProgress } = useScroll();

    // ── Preloader & Cursor ──
    useEffect(() => {
        // Cursor
        if (window.innerWidth > 1024) {
            const moveCursor = (e) => {
                gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.08 });
            };
            window.addEventListener('mousemove', moveCursor);
            return () => window.removeEventListener('mousemove', moveCursor);
        }
    }, []);

    useEffect(() => {
        // Preloader simulate
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    // ── GSAP Logic ──
    useEffect(() => {
        // Scroll Story
        const panels = [0, 1, 2, 3, 4];
        panels.forEach((p) => {
            ScrollTrigger.create({
                trigger: '#story-outer',
                start: `${p * 20}% top`,
                end: `${(p + 1) * 20}% top`,
                onToggle: self => {
                    if (self.isActive) {
                        setActivePanel(p);
                        setAutoRotating(false);
                    }
                }
            });
        });

        // Reset auto rotation if scrolled above story
        ScrollTrigger.create({
            trigger: '#story-outer',
            start: 'top bottom',
            onLeaveBack: () => setAutoRotating(true)
        });

        // Marquees
        gsap.to('#mq1', { xPercent: -50, ease: 'none', duration: 22, repeat: -1 });
        gsap.fromTo('#mq2', { xPercent: -50 }, { xPercent: 0, ease: 'none', duration: 32, repeat: -1 });

        // Timeline Scrub
        const track = document.getElementById('tl-track');
        if (track && window.innerWidth > 768) {
            gsap.to(track, {
                x: () => -(track.scrollWidth - window.innerWidth * 0.9),
                ease: "none",
                scrollTrigger: {
                    trigger: "#tl-sec",
                    start: "top top",
                    end: () => `+=${track.scrollWidth}`,
                    pin: "#tl-pin",
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });
        }

        // Fetch Products
        axios.get(`${API_URL}/api/products`)
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, []);

    return (
        <main>
            <div className="cursor" ref={cursorRef}></div>

            {/* PRELOADER */}
            {isLoading && (
                <div id="preloader">
                    <h1>LIBERO</h1>
                    <div className="pl-bar-wrap"><div id="pl-bar" style={{ width: '100%', transition: 'width 2s linear' }}></div></div>
                    <div className="it-flags"><span className="g"></span><span class="w"></span><span class="r"></span></div>
                </div>
            )}

            <Navbar />

            {/* HERO */}
            <div className="hero-story-wrap">
                <section className="hero">
                    <div className="hero-inner">
                        <div className="tag-pill">SINCE 1954 · ITALIAN CRAFT</div>
                        <h1 className="hero-h1">
                            <div className="line-wrap"><span className="line" style={{ transform: 'none', opacity: 1 }}>BORN</span></div>
                            <div className="line-wrap"><span className="line" style={{ transform: 'none', opacity: 1 }}>FROM THE</span></div>
                            <div className="line-wrap"><span className="line" style={{ transform: 'none', opacity: 1 }}>PITCH</span></div>
                        </h1>
                        <div className="sep"></div>
                        <p className="hero-sub">Hand-stitched leather. Precision engineered. Worn by legends across three decades of football.</p>
                        <div className="hero-btns">
                            <button className="btn-solid">SHOP COLLECTION</button>
                            <button className="btn-ghost">OUR HERITAGE →</button>
                        </div>
                    </div>
                    <div className="scroll-hint">▼ SCROLL TO DISCOVER</div>
                </section>

                {/* CANVAS */}
                <div id="canvas-wrap">
                    <div className="canvas-container">
                        <Canvas shadows dpr={[1, 2]}>
                            <PerspectiveCamera makeDefault position={[0, 0.3, 2.9]} fov={42} />
                            <Environment preset="city" />
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[-4, 6, 6]} intensity={0.9} />
                            <Suspense fallback={null}>
                                <Boot activePanel={activePanel} isAutoRotating={isAutoRotating} />
                            </Suspense>
                            <OrbitControls enableZoom={false} enablePan={false} />
                        </Canvas>
                    </div>
                </div>

                {/* STORY */}
                <div className="story-outer" id="story-outer">
                    <div className="story-sticky">
                        <div className="progress-track">
                            <div id="prog-fill" style={{ height: `${(activePanel / 4) * 100}%` }}></div>
                        </div>
                        <div className="panels-box">
                            {[
                                { tag: 'UPPER · LAYER 01', title: 'FULL GRAIN LEATHER UPPER', desc: 'Hand-selected bovine leather, tumbled for softness. Every panel stitched with 0.8mm nylon thread.' },
                                { tag: 'OUTSOLE · LAYER 02', title: 'SCREW-IN STUD SYSTEM', desc: 'Interchangeable aluminium studs adapt to any pitch condition. 6-stud configuration.' },
                                { tag: 'STRIPES · LAYER 03', title: 'THE THREE STRIPE HERITAGE', desc: 'Italian tricolore detailing on the signature stripes. A mark of craftsmanship since 1982.' },
                                { tag: 'INSOLE · LAYER 04', title: 'ANATOMIC FOOTBED', desc: 'Contoured cork-latex insole molds to your foot shape. Natural materials breathe.' },
                                { tag: 'THE BOOT · COMPLETE', title: 'THE LIBERO. COMPLETE.', desc: 'Four decades of Italian football craftsmanship. This is not just a boot. This is a legacy.' }
                            ].map((p, i) => (
                                <div key={i} className={`panel p${i + 1} ${activePanel === i ? 'active' : ''}`}>
                                    <div className="panel-tag">{p.tag}</div>
                                    <h2>{p.title}</h2>
                                    <p>{p.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* COLLECTION */}
            <section className="section" id="collection">
                <div className="sec-head">
                    <h2>THE COLLECTION</h2>
                    <p>Handcrafted in limited numbers. Built to outlast the game.</p>
                </div>
                <div className="grid">
                    {products.length > 0 ? products.map((p) => (
                        <div className="card" key={p.id}>
                            <h3 className="card-name">{p.name}</h3>
                            <div className="price">₹{p.price.toLocaleString()}</div>
                        </div>
                    )) : (
                        [1, 2, 3].map(i => <div className="card" key={i}><div className="img-ph"></div><div className="card-name">LOADING...</div></div>)
                    )}
                </div>
            </section>

            {/* TIMELINE */}
            <section className="tl-sec" id="tl-sec">
                <h2>40 YEARS ON THE PITCH</h2>
                <div className="tl-pin" id="tl-pin">
                    <div className="tl-connector"></div>
                    <div className="tl-track" id="tl-track">
                        {[1954, 1966, 1982, 1990, 2006, 2025].map(year => (
                            <div className="tl-card" key={year}>
                                <div className="tl-img"><img src={`/assets/tl_${year}.png`} alt={year} /></div>
                                <h3>{year}</h3>
                                <h4>{year === 1954 ? 'Founded in Turin' : 'World Stage Debut'}</h4>
                                <p>Legacy stitched through time, worn by legends on the biggest pitches.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MARQUEE */}
            <div className="marquee-sec">
                <div className="mq-row"><div className="mq-track" id="mq1">
                    <span className="mq-t">HANDCRAFTED IN ITALY</span><span className="mq-star">★</span>
                    <span className="mq-t">FULL GRAIN LEATHER</span><span className="mq-star">★</span>
                    <span className="mq-t">SINCE 1954</span><span className="mq-star">★</span>
                    <span className="mq-t">HANDCRAFTED IN ITALY</span><span className="mq-star">★</span>
                </div></div>
            </div>

            {/* NEWSLETTER */}
            <section className="nl-sec">
                <span className="nl-tag">JOIN THE LEGACY</span>
                <h2>FIRST ACCESS TO LIMITED DROPS</h2>
                <form className="nl-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
                    <input type="email" placeholder="Enter your email address..." required />
                    <button type="submit" className="btn-red">JOIN</button>
                </form>
            </section>

            <footer id="footer">
                <div className="foot-grid">
                    <div>
                        <a href="#" className="foot-logo">LIBERO</a>
                        <p className="foot-desc">Handcrafted in Italy. Built for the beautiful game.</p>
                    </div>
                </div>
                <div className="foot-btm"><span>© 2025 LIBERO ITALIA.</span></div>
            </footer>
        </main>
    );
};

export default App;
