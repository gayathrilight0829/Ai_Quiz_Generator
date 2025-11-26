import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    loggedIn: boolean;
    isLoading: boolean;
    token: string | null;
    setAuth: (token: string | null) => Promise<void>;
    logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    loggedIn: false,
    isLoading: true,
    token: null,
    setAuth: async () => {},
    logOut: async () => {},
});

// Export useAuth
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const router = useRouter();

    // 🔥 ADD THIS — STORE TOKEN
    const [token, setToken] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load token on startup
    useEffect(() => {
        const load = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("token");

                if (storedToken) {
                    setToken(storedToken);
                    setLoggedIn(true);
                } else {
                    setToken(null);
                    setLoggedIn(false);
                }
            } catch (error) {
                console.error("Failed to load token:", error);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, []);

    // Save token on login
    const setAuth = async (newToken: string | null) => {
        setIsLoading(true);

        if (newToken) {
            await AsyncStorage.setItem("token", newToken);
            setToken(newToken);
            setLoggedIn(true);
        } else {
            await AsyncStorage.removeItem("token");
            setToken(null);
            setLoggedIn(false);
        }

        setIsLoading(false);
    };

    // Logout
    const logOut = async () => {
        await AsyncStorage.removeItem("token");
        setToken(null);
        setLoggedIn(false);
        router.replace("/login");
    };

    return (
        <AuthContext.Provider value={{ loggedIn, isLoading, token, setAuth, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}
