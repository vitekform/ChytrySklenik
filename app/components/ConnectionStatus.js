import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function ConnectionStatus({ status, theme }) {
    const getStatusColor = () => {
        if (status.includes('Connected')) return theme.primary;
        if (status.includes('Error') || status.includes('failed')) return theme.danger;
        return theme.warning;
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.section }]}>
            <Text style={[styles.text, { color: theme.text }]}>
                Status: <Text style={{ color: getStatusColor() }}>{status}</Text>
            </Text>
            {status === 'Connecting...' && (
                <ActivityIndicator size="small" color={theme.primary} style={styles.indicator} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 10,
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
    },
    indicator: {
        marginLeft: 10,
    },
});