import React, { createContext, useState, useEffect, useContext } from 'react';

// Context create panrom
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // App load aagum bodhu localStorage-la token irukka nu check panrom
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        // LocalStorage-la irundhu user data-va eduthu state-la vekirom
        const savedUser = localStorage.getItem('user');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
    }, [token]);

    // Login aana udane token & user-a save panna function
    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
    };

    // Logout panna ellathayum clear panna function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy access in any component
export const useAuth = () => useContext(AuthContext);