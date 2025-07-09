import React, {createContext, useState, useEffect, useContext} from 'react';
import { Appearance } from 'react-native';
import { lightTheme, darkTheme } from '../utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for theme preference
const THEME_STORAGE_KEY = '@ChytrySklenik:themePreference';

export const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export function ThemeProvider({ children }) {
    const colorScheme = Appearance.getColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
    const [isLoading, setIsLoading] = useState(true);

    // Load saved theme preference on mount
    useEffect(() => {
        const loadThemePreference = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme !== null) {
                    setIsDarkMode(savedTheme === 'dark');
                }
            } catch (error) {
                console.error('Failed to load theme preference:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadThemePreference();
    }, []);

    // Save theme preference when it changes
    useEffect(() => {
        const saveThemePreference = async () => {
            try {
                await AsyncStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
            } catch (error) {
                console.error('Failed to save theme preference:', error);
            }
        };

        if (!isLoading) {
            saveThemePreference();
        }
    }, [isDarkMode, isLoading]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <ThemeContext.Provider value={{
            theme: isDarkMode ? darkTheme : lightTheme,
            isDarkMode,
            toggleTheme
        }}>
            {children}
        </ThemeContext.Provider>
    );
}
