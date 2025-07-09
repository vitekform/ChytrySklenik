import { View, Text, Switch, ScrollView, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from './context/ThemeContext';
import { useMqtt } from './context/MqttContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import Section from './components/Section';
import DataRow from './components/DataRow';
import SettingControl from './components/SettingControl';
import ConnectionStatus from './components/ConnectionStatus';
import ManualControls from './components/ManualControls';
import SwitchControl from './components/SwitchControl';

export default function HomeScreen() {
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const {
        connectionStatus,
        sensorData,
        targetSettings,
        setTargetSettings,
        devMode,
        setDevMode
    } = useMqtt();

    const handleThemeToggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toggleTheme();
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <StatusBar 
                barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
                backgroundColor={theme.background}
            />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <MaterialCommunityIcons 
                            name="greenhouse" 
                            size={32} 
                            color={theme.primary} 
                            style={styles.titleIcon} 
                        />
                        <Text style={[styles.title, { color: theme.text }]}>Chytrý Skleník</Text>
                    </View>

                    <View style={styles.headerControls}>
                        <View style={[styles.themeContainer, { backgroundColor: theme.section, borderColor: theme.border }]}>
                            <MaterialCommunityIcons 
                                name={isDarkMode ? "weather-night" : "white-balance-sunny"} 
                                size={20} 
                                color={theme.primary} 
                            />
                            <Switch
                                value={isDarkMode}
                                onValueChange={handleThemeToggle}
                                thumbColor={isDarkMode ? theme.primary : theme.switchThumb}
                                trackColor={{ false: theme.switchTrack, true: theme.accent }}
                                style={styles.themeSwitch}
                            />
                        </View>
                    </View>
                </View>

                {/* Connection Status */}
                <ConnectionStatus status={connectionStatus} theme={theme} />

                {/* Sensor Data */}
                <Section title="Sensor Data" theme={theme} icon="chart-line">
                    <DataRow
                        label="Temperature"
                        value={`${sensorData.temperature}°C`}
                        theme={theme}
                        icon="thermometer"
                    />
                    <DataRow
                        label="Atmospheric Pressure"
                        value={`${sensorData.pressure} hPa`}
                        theme={theme}
                        icon="gauge"
                    />
                    <DataRow
                        label="Air Humidity"
                        value={`${sensorData.humidity}%`}
                        theme={theme}
                        icon="water-percent"
                    />
                    <DataRow
                        label="Ground Moisture"
                        value={`${sensorData.moisture}%`}
                        theme={theme}
                        icon="water"
                    />
                    <DataRow
                        label="Light Level"
                        value={`${sensorData.light}%`}
                        theme={theme}
                        icon="brightness-6"
                    />
                </Section>

                {/* Target Settings */}
                <Section title="Target Settings" theme={theme} icon="tune">
                    <SettingControl
                        label="Temperature"
                        value={targetSettings.temperature}
                        onChange={(value) => setTargetSettings(prev => ({ ...prev, temperature: value }))}
                        min={15}
                        max={35}
                        unit="°C"
                        theme={theme}
                        icon="thermometer"
                    />
                    <SettingControl
                        label="Humidity"
                        value={targetSettings.humidity}
                        onChange={(value) => setTargetSettings(prev => ({ ...prev, humidity: value }))}
                        min={20}
                        max={80}
                        unit="%"
                        theme={theme}
                        icon="water-percent"
                    />
                    <SettingControl
                        label="Moisture"
                        value={targetSettings.moisture}
                        onChange={(value) => setTargetSettings(prev => ({ ...prev, moisture: value }))}
                        min={20}
                        max={80}
                        unit="%"
                        theme={theme}
                        icon="water"
                    />
                </Section>

                {/* Dev Mode Toggle */}
                <View style={[styles.devModeContainer, { 
                    backgroundColor: theme.section,
                    shadowColor: theme.shadow,
                    borderColor: theme.border
                }]}>
                    <SwitchControl
                        label="Developer Mode"
                        value={devMode}
                        onValueChange={setDevMode}
                        theme={theme}
                        icon="developer-board"
                    />
                </View>

                {/* Manual Controls (Dev Mode Only) */}
                {devMode && <ManualControls theme={theme} />}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleIcon: {
        marginRight: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    graphsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    graphsButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginLeft: 4,
        fontSize: 14,
    },
    themeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.03)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 0.5,
    },
    themeSwitch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        marginLeft: 4,
    },
    devModeContainer: {
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 0.5,
    },
});
