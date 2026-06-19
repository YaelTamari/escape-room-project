import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedUser !== 'undefined' && storedToken)  {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const authenticate = (userData, token) => {
        if (!userData || !token) {
            console.error("שגיאה: השרת לא החזיר משתמש או טוקן", { userData, token });
            return; 
        }
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };
    
const updatePoints = (pointsToAdd) => {
        if (user) {
            const currentPoints = user.points || 0;
            const updatedUser = { ...user, points: currentPoints + pointsToAdd };
            
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, authenticate, logout, loading, updatePoints }}>
            {children}
        </AuthContext.Provider>
    );
};
