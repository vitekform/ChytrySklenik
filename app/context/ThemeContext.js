import React, {createContext, useState, useEffect, useContext} from 'react';
import { Appearance } from 'react-native';
import { lightTheme, darkTheme } from '../utils/theme';

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