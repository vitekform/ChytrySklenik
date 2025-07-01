import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Section({ title, children, theme, icon }) {
    return (
        <View style={[styles.container, { 
            shadowColor: theme.shadow,
            borderColor: theme.border
        }]}>
            <LinearGradient
                colors={[theme.cardGradientStart, theme.cardGradientEnd]}
                style={styles.gradient}
            >
                <View style={styles.titleContainer}>
                    {icon && (
                        <MaterialCommunityIcons 
                            name={icon} 
                            size={24} 
                            color={theme.primary} 
                            style={styles.icon} 
                        />
                    )}
                    <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                </View>
                <View style={styles.content}>
                    {children}
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 0.5,
    },
    gradient: {
        borderRadius: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    icon: {
        marginRight: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
});
