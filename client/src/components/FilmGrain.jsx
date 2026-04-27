import React, { useEffect, useRef } from 'react';

const FilmGrain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;
        let lastTime = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const render = (timestamp) => {
            if (timestamp - lastTime > 50) {
                lastTime = timestamp;
                const id = ctx.createImageData(canvas.width, canvas.height);
                for (let i = 0; i < id.data.length; i += 4) {
                    const v = Math.random() * 255 | 0;
                    id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
                    id.data[i + 3] = 255;
                }
                ctx.putImageData(id, 0, 0);
            }
            animationId = requestAnimationFrame(render);
        };

        window.addEventListener('resize', resize);
        resize();
        animationId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 1,
                pointerEvents: 'none',
                opacity: 0.04,
            }}
        />
    );
};

export default FilmGrain;
