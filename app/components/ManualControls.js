import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Section from './Section';
import SwitchControl from './SwitchControl';
import SliderControl from './SliderControl';
import { useMqtt } from '../context/MqttContext';

export default function ManualControls({ theme }) {
    const { 
        manualControls, 
        setManualControls, 
        publishManualControls,
        autoMode,
        setAutoMode,
        publishAutoMode
    } = useMqtt();

    return (
        <Section 
            title="Manual Controls" 
            theme={theme} 
            icon="controller"
        >
            <View style={styles.controlsContainer}>
                <SwitchControl
                    label="Auto Mode"
                    value={autoMode}
                    onValueChange={(value) => {
                        setAutoMode(value);
                        publishAutoMode();
                    }}
                    theme={theme}
                    icon="auto-fix"
                />

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                <SwitchControl
                    label="Fan System"
                    value={manualControls.fan}
                    onValueChange={(value) => setManualControls(prev => ({ ...prev, fan: value }))}
                    theme={theme}
                    icon="fan"
                    disabled={autoMode}
                />
                <SwitchControl
                    label="Water Pump"
                    value={manualControls.waterPump}
                    onValueChange={(value) => setManualControls(prev => ({ ...prev, waterPump: value }))}
                    theme={theme}
                    icon="water-pump"
                    disabled={autoMode}
                />
                <SwitchControl
                    label="Heating System"
                    value={manualControls.heating}
                    onValueChange={(value) => setManualControls(prev => ({ ...prev, heating: value }))}
                    theme={theme}
                    icon="radiator"
                    disabled={autoMode}
                />
                <SliderControl
                    label="Light Level"
                    value={manualControls.lightLevel}
                    onValueChange={(value) => setManualControls(prev => ({ ...prev, lightLevel: value }))}
                    min={0}
                    max={100}
                    unit="%"
                    theme={theme}
                    icon="lightbulb-on"
                    disabled={autoMode}
                />
            </View>

            <TouchableOpacity 
                style={[
                    styles.syncButton, 
                    { 
                        backgroundColor: theme.primary,
                        opacity: autoMode ? 0.5 : 1 
                    }
                ]}
                onPress={publishManualControls}
                disabled={autoMode}
            >
                <Text style={[styles.syncButtonText, { color: theme.section }]}>
                    Sync Controls
                </Text>
            </TouchableOpacity>

            <View style={[styles.infoContainer, { backgroundColor: theme.info + '20', borderColor: theme.info + '40' }]}>
                <Text style={[styles.infoText, { color: theme.text }]}>
                    {autoMode 
                        ? "Auto mode is ON. The system will automatically control devices based on sensor readings."
                        : "Manual mode is ON. Your controls will override automatic settings. Use with caution."
                    }
                </Text>
            </View>
        </Section>
    );
}

const styles = StyleSheet.create({
    controlsContainer: {
        marginBottom: 16,
    },
    divider: {
        height: 1,
        marginVertical: 12,
        width: '100%',
    },
    syncButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    syncButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoContainer: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginTop: 8,
    },
    infoText: {
        fontSize: 14,
        textAlign: 'center',
    }
});
