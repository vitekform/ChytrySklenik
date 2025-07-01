import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from './context/ThemeContext';
import { useMqtt } from './context/MqttContext';
import Section from './components/Section';
import DataRow from './components/DataRow';
import SettingControl from './components/SettingControl';
import ConnectionStatus from './components/ConnectionStatus';
import ManualControls from './components/ManualControls';

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

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.contentContainer}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Chytrý Skleník</Text>

                <View style={styles.themeContainer}>
                    <Text style={[styles.themeLabel, { color: theme.text }]}>
                        {isDarkMode ? 'Dark' : 'Light'}
                    </Text>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleTheme}
                        thumbColor={isDarkMode ? theme.switchThumb : theme.switchThumb}
                        trackColor={{ false: theme.switchTrack, true: theme.switchTrack }}
                    />
                </View>
            </View>

            {/* Connection Status */}
            <ConnectionStatus status={connectionStatus} theme={theme} />

            {/* Sensor Data */}
            <Section title="Sensor Data" theme={theme}>
                <DataRow
                    label="Temperature"
                    value={`${sensorData.temperature}°C`}
                    theme={theme}
                />
                <DataRow
                    label="Atmospheric Pressure"
                    value={`${sensorData.pressure} hPa`}
                    theme={theme}
                />
                <DataRow
                    label="Air Humidity"
                    value={`${sensorData.humidity}%`}
                    theme={theme}
                />
                <DataRow
                    label="Ground Moisture"
                    value={`${sensorData.moisture}%`}
                    theme={theme}
                />
                <DataRow
                    label="Light Level"
                    value={`${sensorData.light}%`}
                    theme={theme}
                />
            </Section>

            {/* Target Settings */}
            <Section title="Target Settings" theme={theme}>
                <SettingControl
                    label="Temperature"
                    value={targetSettings.temperature}
                    onChange={(value) => setTargetSettings(prev => ({ ...prev, temperature: value }))}
                    min={15}
                    max={35}
                    unit="°C"
                    theme={theme}
                />
                <SettingControl
                    label="Humidity"
                    value={targetSettings.humidity}
                    onChange={(value) => setTargetSettings(prev => ({ ...prev, humidity: value }))}
                    min={20}
                    max={80}
                    unit="%"
                    theme={theme}
                />
                <SettingControl
                    label="Moisture"
                    value={targetSettings.moisture}
                    onChange={(value) => setTargetSettings(prev => ({ ...prev, moisture: value }))}
                    min={20}
                    max={80}
                    unit="%"
                    theme={theme}
                />
            </Section>

            {/* Dev Mode Toggle */}
            <View style={[styles.devModeContainer, { backgroundColor: theme.section }]}>
                <Text style={[styles.devLabel, { color: theme.text }]}>Developer Mode</Text>
                <Switch
                    value={devMode}
                    onValueChange={setDevMode}
                    thumbColor={devMode ? theme.primary : theme.switchThumb}
                    trackColor={{ false: theme.switchTrack, true: theme.primary }}
                />
            </View>

            {/* Manual Controls (Dev Mode Only) */}
            {devMode && <ManualControls theme={theme} />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
    },
    themeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    themeLabel: {
        marginRight: 8,
        fontSize: 16,
    },
    devModeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 10,
        marginBottom: 20,
    },
    devLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
});