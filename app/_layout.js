import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './context/ThemeContext';
import { MqttProvider } from './context/MqttContext';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <MqttProvider>
                    <Stack screenOptions={{ headerShown: false }} />
                </MqttProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}