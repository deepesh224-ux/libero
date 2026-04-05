import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/newsletter`, { email });
            setStatus(res.data.message || 'Subscribed!');
            setEmail('');
        } catch (error) {
            setStatus('Subscription failed. Please try again.');
        }
    };

    return (
        <section className="nl-sec">
            <span className="nl-tag">JOIN THE LEGACY</span>
            <h2>FIRST ACCESS TO<br/>LIMITED DROPS</h2>
            <p>Our runs are small. Our waitlist is long. Get in before the pitch.</p>
            <form className="nl-form" onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Enter your email address..." 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn-red">JOIN</button>
            </form>
            {status && <span style={{display: 'block', color: 'var(--primary)', marginBottom: '10px'}}>{status}</span>}
            <span className="nl-count">★ 8,400+ collectors already inside</span>
        </section>
    );
};

export default Newsletter;
