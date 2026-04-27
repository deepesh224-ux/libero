import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const LS_KEY = 'libero_user';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Hydrate from localStorage on mount
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem(LS_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    /** Persist user object to state + localStorage. */
    const persist = (userData) => {
        localStorage.setItem(LS_KEY, JSON.stringify(userData));
        setUser(userData);
    };

    /**
     * POST /api/auth/login
     */
    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        persist(data);
        return data;
    };

    /**
     * POST /api/auth/register
     */
    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        persist(data);
        return data;
    };

    /** Clear session from state and localStorage. */
    const logout = () => {
        localStorage.removeItem(LS_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

