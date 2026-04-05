import React, { useEffect, useState } from 'react';

const Preloader = ({ setLoading }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Preloader simulate
        const timer = setTimeout(() => {
            setVisible(false);
            if(setLoading) setLoading(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, [setLoading]);

    if (!visible) return null;

    return (
        <div id="preloader">
            <h1>LIBERO</h1>
            <div className="pl-bar-wrap">
                <div id="pl-bar" style={{ width: '100%', transition: 'width 2s linear' }}></div>
            </div>
            <div className="it-flags">
                <span className="g"></span><span className="w"></span><span className="r"></span>
            </div>
        </div>
    );
};

export default Preloader;
