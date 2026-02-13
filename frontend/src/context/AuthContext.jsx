import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('blog_token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsAuthenticated(!!token);
    }, [token]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await authService.login(email, password);
            localStorage.setItem('blog_token', data.token);
            setToken(data.token);
            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.message || 'Login failed. Please try again.';
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('blog_token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
