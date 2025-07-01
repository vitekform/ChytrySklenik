import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Section from './Section';
import SwitchControl from './SwitchControl';
import SliderControl from './SliderControl';
import { useMqtt } from '../context/MqttContext';

export default function ManualControls({ theme }) {
    const { manualControls, setManualControls } = useMqtt();

    return (
        <Section title="Manual Controls" theme={theme}>
            <SwitchControl
                label="Fan System"
                value={manualControls.fan}
                onValueChange={(value) => setManualControls(prev => ({ ...prev, fan: value }))}
                theme={theme}
            />
            <SwitchControl
                label="Water Pump"
                value={manualControls.waterPump}
                onValueChange={(value) => setManualControls(prev => ({ ...prev, waterPump: value }))}
                theme={theme}
            />
            <SwitchControl
                label="Heating System"
                value={manualControls.heating}
                onValueChange={(value) => setManualControls(prev => ({ ...prev, heating: value }))}
                theme={theme}
            />
            <SliderControl
                label="Light Level"
                value={manualControls.lightLevel}
                onValueChange={(value) => setManualControls(prev => ({ ...prev, lightLevel: value }))}
                min={0}
                max={100}
                unit="%"
                theme={theme}
            />
        </Section>
    );
}