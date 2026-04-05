import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

const PANEL_CONFIGS = [
    { rx: 0, ry: 0, cx: 0, cy: 0.3, cz: 5 },
    { rx: -1.3, ry: 0.3, cx: 0, cy: 0.0, cz: 5 },
    { rx: 0, ry: Math.PI / 2, cx: 0.3, cy: 0.2, cz: 5 },
    { rx: 0.65, ry: 0.4, cx: 0, cy: 0.5, cz: 4.5 },
    { rx: 0.2, ry: 0.8, cx: 0, cy: 0.2, cz: 5 },
];

const BootCanvas = ({ activePanel, isAutoRotating }) => {
    const { scene } = useGLTF('/assets/boot.glb');
    const { camera, invalidate } = useThree();
    const groupRef = useRef();

    useEffect(() => {
        if (scene && !scene.userData.scaled) {
            const box = new THREE.Box3().setFromObject(scene);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            const maxDim = Math.max(size.x, size.y, size.z);
            const s = 3.7 / maxDim;
            scene.scale.setScalar(s);

            const scaledCenter = center.clone().multiplyScalar(s);
            scene.position.set(-scaledCenter.x, -scaledCenter.y - 0.2, -scaledCenter.z);

            scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    if (child.geometry) {
                        child.geometry.computeVertexNormals();
                    }

                    if (child.material) {
                        const mats = Array.isArray(child.material) 
                            ? child.material 
                            : [child.material];
                            
                        mats.forEach(mat => {
                            mat.flatShading = false;
                            mat.needsUpdate = true;
                        });
                    }
                }
            });
            
            scene.userData.scaled = true; // Mark as scaled to prevent recursive scaling
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
        if (groupRef.current && camera) {
            const cfg = PANEL_CONFIGS[activePanel] || PANEL_CONFIGS[0];
            gsap.to(groupRef.current.rotation, {
                x: cfg.rx, y: cfg.ry,
                duration: 1.4, ease: 'power2.inOut',
                onUpdate: invalidate
            });
            gsap.to(camera.position, {
                x: cfg.cx, y: cfg.cy, z: cfg.cz,
                duration: 1.4, ease: 'power2.inOut',
                onUpdate: () => {
                    camera.updateProjectionMatrix();
                    invalidate();
                }
            });
        }
    }, [activePanel, camera, invalidate]);

    return (
        <group ref={groupRef}>
            <primitive object={scene} />
        </group>
    );
};

export default BootCanvas;
