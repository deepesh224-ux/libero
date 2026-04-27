import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

// ─── Tab IDs ──────────────────────────────────────────────────────────────────
const TAB_SIGNIN  = 'signin';
const TAB_REGISTER = 'register';

// ─── Tiny helper ─────────────────────────────────────────────────────────────
/** Extract a human-readable message from an axios error or plain Error. */
const extractError = (err) =>
    err?.response?.data?.error ?? err?.message ?? 'Something went wrong';

// ─── Component ────────────────────────────────────────────────────────────────
const AuthModal = ({ isOpen, onClose }) => {
    const { login, register } = useAuth();

    const [tab,      setTab]      = useState(TAB_SIGNIN);
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState('');

    // Sign-in fields
    const [siEmail,  setSiEmail]  = useState('');
    const [siPass,   setSiPass]   = useState('');

    // Register fields
    const [regName,  setRegName]  = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPass,  setRegPass]  = useState('');
    const [regConf,  setRegConf]  = useState('');

    const overlayRef = useRef(null);

    // Reset form state each time the modal opens or the active tab changes
    useEffect(() => {
        setError('');
        setSiEmail(''); setSiPass('');
        setRegName(''); setRegEmail(''); setRegPass(''); setRegConf('');
        setLoading(false);
    }, [isOpen, tab]);

    // Close on Escape key press
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    // Trap focus inside modal while open
    const firstInput = useRef(null);
    useEffect(() => {
        if (isOpen) setTimeout(() => firstInput.current?.focus(), 80);
    }, [isOpen, tab]);

    if (!isOpen) return null;

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!siEmail || !siPass) { setError('Email and password are required.'); return; }
        setError(''); setLoading(true);
        try {
            await login(siEmail, siPass);
            onClose();
        } catch (err) {
            setError(extractError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!regName || !regEmail || !regPass || !regConf) {
            setError('All fields are required.'); return;
        }
        if (regPass !== regConf) { setError('Passwords do not match.'); return; }
        if (regPass.length < 6)  { setError('Password must be at least 6 characters.'); return; }
        setError(''); setLoading(true);
        try {
            await register(regName, regEmail, regPass);
            onClose();
        } catch (err) {
            setError(extractError(err));
        } finally {
            setLoading(false);
        }
    };

    // ── Click outside to close ────────────────────────────────────────────────
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div
            className="auth-modal-overlay"
            ref={overlayRef}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-label={tab === TAB_SIGNIN ? 'Sign In' : 'Create Account'}
        >
            <div className="auth-modal-card">

                {/* ── Close button ── */}
                <button
                    className="auth-modal-close"
                    onClick={onClose}
                    aria-label="Close modal"
                    type="button"
                >
                    ✕
                </button>

                {/* ── Wordmark ── */}
                <div className="auth-modal-brand">LIBERO</div>

                {/* ── Tab switcher ── */}
                <div className="auth-modal-tabs" role="tablist">
                    <button
                        role="tab"
                        aria-selected={tab === TAB_SIGNIN}
                        className={`auth-tab-btn ${tab === TAB_SIGNIN ? 'active' : ''}`}
                        onClick={() => setTab(TAB_SIGNIN)}
                        type="button"
                    >
                        Sign In
                    </button>
                    <button
                        role="tab"
                        aria-selected={tab === TAB_REGISTER}
                        className={`auth-tab-btn ${tab === TAB_REGISTER ? 'active' : ''}`}
                        onClick={() => setTab(TAB_REGISTER)}
                        type="button"
                    >
                        Create Account
                    </button>
                </div>

                {/* ── Error banner ── */}
                {error && (
                    <div className="auth-modal-error" role="alert">
                        {error}
                    </div>
                )}

                {/* ════════════ SIGN IN ════════════ */}
                {tab === TAB_SIGNIN && (
                    <form className="auth-modal-form" onSubmit={handleSignIn} noValidate>
                        <div className="auth-form-group">
                            <label htmlFor="si-email" className="auth-label">Email</label>
                            <input
                                id="si-email"
                                ref={firstInput}
                                type="email"
                                className="auth-input"
                                placeholder="you@example.com"
                                value={siEmail}
                                onChange={(e) => setSiEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="auth-form-group">
                            <label htmlFor="si-password" className="auth-label">Password</label>
                            <input
                                id="si-password"
                                type="password"
                                className="auth-input"
                                placeholder="••••••••"
                                value={siPass}
                                onChange={(e) => setSiPass(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <button
                            id="si-submit"
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>

                        <p className="auth-switch-hint">
                            No account?{' '}
                            <button
                                type="button"
                                className="auth-link-btn"
                                onClick={() => setTab(TAB_REGISTER)}
                            >
                                Create one
                            </button>
                        </p>
                    </form>
                )}

                {/* ════════════ REGISTER ════════════ */}
                {tab === TAB_REGISTER && (
                    <form className="auth-modal-form" onSubmit={handleRegister} noValidate>
                        <div className="auth-form-group">
                            <label htmlFor="reg-name" className="auth-label">Full Name</label>
                            <input
                                id="reg-name"
                                ref={firstInput}
                                type="text"
                                className="auth-input"
                                placeholder="Alex Smith"
                                value={regName}
                                onChange={(e) => setRegName(e.target.value)}
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div className="auth-form-group">
                            <label htmlFor="reg-email" className="auth-label">Email</label>
                            <input
                                id="reg-email"
                                type="email"
                                className="auth-input"
                                placeholder="you@example.com"
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="auth-form-group">
                            <label htmlFor="reg-password" className="auth-label">Password</label>
                            <input
                                id="reg-password"
                                type="password"
                                className="auth-input"
                                placeholder="Min. 6 characters"
                                value={regPass}
                                onChange={(e) => setRegPass(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div className="auth-form-group">
                            <label htmlFor="reg-confirm" className="auth-label">Confirm Password</label>
                            <input
                                id="reg-confirm"
                                type="password"
                                className="auth-input"
                                placeholder="Repeat password"
                                value={regConf}
                                onChange={(e) => setRegConf(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <button
                            id="reg-submit"
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Creating account…' : 'Create Account'}
                        </button>

                        <p className="auth-switch-hint">
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="auth-link-btn"
                                onClick={() => setTab(TAB_SIGNIN)}
                            >
                                Sign in
                            </button>
                        </p>
                    </form>
                )}
            </div>

            {/* ── Scoped styles ─────────────────────────────────────────────── */}
            <style>{`
                /* Overlay */
                .auth-modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    animation: authFadeIn 0.25s var(--ease) both;
                }

                /* Card */
                .auth-modal-card {
                    position: relative;
                    width: min(420px, 92vw);
                    background: #111111;
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 2.5rem 2rem 2rem;
                    animation: authSlideUp 0.3s var(--ease) both;
                    box-shadow:
                        0 0 0 1px rgba(255,255,255,0.04),
                        0 24px 60px rgba(0, 0, 0, 0.6);
                }

                /* Close */
                .auth-modal-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-size: 1rem;
                    cursor: pointer;
                    line-height: 1;
                    padding: 4px 8px;
                    border-radius: 4px;
                    transition: color 0.2s, background 0.2s;
                }
                .auth-modal-close:hover {
                    color: #E8E8E8;
                    background: rgba(255,255,255,0.05);
                }

                /* Wordmark */
                .auth-modal-brand {
                    font-family: var(--font-bebas);
                    font-size: 1.8rem;
                    letter-spacing: 0.18em;
                    color: #E8E8E8;
                    margin-bottom: 1.5rem;
                    text-align: center;
                }

                /* Tabs */
                .auth-modal-tabs {
                    display: flex;
                    border-bottom: 1px solid var(--border);
                    margin-bottom: 1.5rem;
                }
                .auth-tab-btn {
                    flex: 1;
                    background: transparent;
                    border: none;
                    padding: 0.7rem 0;
                    font-family: var(--font-inter);
                    font-size: 0.78rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: color 0.2s;
                    border-bottom: 2px solid transparent;
                    margin-bottom: -1px;
                }
                .auth-tab-btn.active {
                    color: #E8E8E8;
                    border-bottom-color: var(--primary);
                }
                .auth-tab-btn:hover:not(.active) {
                    color: #E8E8E8;
                }

                /* Error banner */
                .auth-modal-error {
                    background: rgba(196, 30, 58, 0.12);
                    border: 1px solid rgba(196, 30, 58, 0.4);
                    border-radius: 6px;
                    color: #ff6b6b;
                    font-family: var(--font-inter);
                    font-size: 0.78rem;
                    padding: 0.6rem 0.9rem;
                    margin-bottom: 1rem;
                    line-height: 1.5;
                }

                /* Form */
                .auth-modal-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .auth-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                }
                .auth-label {
                    font-family: var(--font-inter);
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: var(--text-muted);
                }
                .auth-input {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid var(--border);
                    border-radius: 6px;
                    padding: 0.7rem 0.85rem;
                    font-family: var(--font-inter);
                    font-size: 0.88rem;
                    color: var(--text-primary);
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                    width: 100%;
                    box-sizing: border-box;
                }
                .auth-input::placeholder { color: var(--text-muted); opacity: 0.6; }
                .auth-input:focus {
                    border-color: rgba(232, 232, 232, 0.35);
                    background: rgba(255, 255, 255, 0.07);
                }

                /* Submit button */
                .auth-submit-btn {
                    margin-top: 0.25rem;
                    padding: 0.85rem;
                    background: #E8E8E8;
                    color: var(--bg);
                    border: none;
                    border-radius: 6px;
                    font-family: var(--font-inter);
                    font-size: 0.82rem;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: opacity 0.2s, transform 0.15s;
                }
                .auth-submit-btn:hover:not(:disabled) {
                    opacity: 0.88;
                    transform: translateY(-1px);
                }
                .auth-submit-btn:disabled {
                    opacity: 0.45;
                    cursor: not-allowed;
                }

                /* Hint / switch link */
                .auth-switch-hint {
                    font-family: var(--font-inter);
                    font-size: 0.78rem;
                    color: var(--text-muted);
                    text-align: center;
                    margin: 0;
                }
                .auth-link-btn {
                    background: none;
                    border: none;
                    color: #E8E8E8;
                    font-family: var(--font-inter);
                    font-size: inherit;
                    cursor: pointer;
                    padding: 0;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }
                .auth-link-btn:hover { color: #fff; }

                /* Keyframes */
                @keyframes authFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes authSlideUp {
                    from { opacity: 0; transform: translateY(24px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)   scale(1);    }
                }
            `}</style>
        </div>
    );
};

export default AuthModal;
