import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DataRow({ label, value, theme, icon }) {
    return (
        <View style={[styles.container, { borderBottomColor: theme.border }]}>
            <View style={styles.labelContainer}>
                {icon && (
                    <MaterialCommunityIcons 
                        name={icon} 
                        size={20} 
                        color={theme.secondary} 
                        style={styles.icon} 
                    />
                )}
                <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
            </View>
            <View style={styles.valueContainer}>
                <Text style={[styles.value, { color: theme.primary }]}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    label: {
        fontSize: 16,
    },
    valueContainer: {
        backgroundColor: 'rgba(0,0,0,0.03)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
