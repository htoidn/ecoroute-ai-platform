import type {ReactNode} from 'react';
import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';

interface User {
    username: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string, preferences: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app start
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser(userData);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch {
                // Invalid stored data, clear it
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }

        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post('/api/auth/login', {username, password});
            const {token, username: userUsername, role} = response.data;

            const userData = {username: userUsername, role};
            setUser(userData);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch {
            throw new Error('Login failed');
        }
    };

    const register = async (email: string, username: string, password: string, preferences: string) => {
        try {
            const response = await axios.post('/api/auth/register', {email, username, password, preferences});
            const {token, username: userUsername, role} = response.data;

            const userData = {username: userUsername, role};
            setUser(userData);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch {
            throw new Error('Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
