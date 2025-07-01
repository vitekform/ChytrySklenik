import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Section from './Section';
import SwitchControl from './SwitchControl';
import SliderControl from './SliderControl';
import { useMqtt } from '../context/MqttContext';

export default function ManualControls({ theme }) {
    const { manualControls, setManualControls } = useMqtt();

    return (
        <Section 
            title="Manual Controls" 
            theme={theme} 
            icon="controller"
        >
            <View style={styles.controlsContainer}>
                <SwitchControl
                    label="Fan System"
                    value={manualControls.fan}
                    onValueChange={(value) => setManualControls(prev => ({ ...prev, fan: value }))}
                    theme={theme}
                    icon="fan"
                />
                <SwitchControl
                    label="Water Pump"
                    value={manualControls.waterPump}
                    onValueChange={(value) => setManualControls(prev => ({ ...prev, waterPump: value }))}
                    theme={theme}
                    icon="water-pump"
                />
                <SwitchControl
                    label="Heating System"
                    value={manualControls.heating}
                    onValueChange={(value) => setManualControls(prev => ({ ...prev, heating: value }))}
                    theme={theme}
                    icon="radiator"
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
                />
            </View>

            <View style={[styles.infoContainer, { backgroundColor: theme.info + '20', borderColor: theme.info + '40' }]}>
                <Text style={[styles.infoText, { color: theme.text }]}>
                    Manual controls override automatic settings. Use with caution.
                </Text>
            </View>
        </Section>
    );
}

const styles = StyleSheet.create({
    controlsContainer: {
        marginBottom: 16,
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
