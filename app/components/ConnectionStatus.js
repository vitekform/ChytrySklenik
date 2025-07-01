import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ConnectionStatus({ status, theme }) {
    const getStatusInfo = () => {
        if (status.includes('Connected')) {
            return {
                color: theme.success,
                icon: 'wifi-check',
                gradientColors: ['rgba(46, 125, 50, 0.1)', 'rgba(46, 125, 50, 0.03)']
            };
        }
        if (status.includes('Error') || status.includes('failed')) {
            return {
                color: theme.danger,
                icon: 'wifi-alert',
                gradientColors: ['rgba(211, 47, 47, 0.1)', 'rgba(211, 47, 47, 0.03)']
            };
        }
        return {
            color: theme.warning,
            icon: 'wifi-sync',
            gradientColors: ['rgba(237, 108, 2, 0.1)', 'rgba(237, 108, 2, 0.03)']
        };
    };

    const statusInfo = getStatusInfo();

    return (
        <View style={[styles.outerContainer, { 
            shadowColor: theme.shadow,
            borderColor: theme.border
        }]}>
            <LinearGradient
                colors={statusInfo.gradientColors}
                style={styles.gradient}
            >
                <View style={styles.container}>
                    <View style={styles.statusContent}>
                        <MaterialCommunityIcons 
                            name={statusInfo.icon} 
                            size={24} 
                            color={statusInfo.color} 
                            style={styles.icon} 
                        />
                        <View>
                            <Text style={[styles.label, { color: theme.text }]}>
                                Connection Status
                            </Text>
                            <Text style={[styles.statusText, { color: statusInfo.color }]}>
                                {status}
                            </Text>
                        </View>
                    </View>
                    {status === 'Connecting...' && (
                        <ActivityIndicator size="small" color={statusInfo.color} style={styles.indicator} />
                    )}
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
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
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    statusContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 12,
    },
    label: {
        fontSize: 14,
        opacity: 0.8,
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 2,
    },
    indicator: {
        marginLeft: 10,
    },
});
