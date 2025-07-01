import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DataRow({ label, value, theme }) {
    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
            <Text style={[styles.value, { color: theme.primary }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    label: {
        fontSize: 16,
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});