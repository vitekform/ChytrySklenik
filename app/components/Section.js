import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Section({ title, children, theme }) {
    return (
        <View style={[styles.container, { backgroundColor: theme.section }]}>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        marginBottom: 20,
        overflow: 'hidden',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    content: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
});