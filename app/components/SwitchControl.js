import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function SwitchControl({ label, value, onValueChange, theme }) {
    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onValueChange}
                thumbColor={value ? theme.primary : theme.switchThumb}
                trackColor={{ false: theme.switchTrack, true: theme.primary }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    label: {
        fontSize: 16,
    },
});