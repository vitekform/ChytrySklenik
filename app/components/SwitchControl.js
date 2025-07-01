import React from 'react';
import { View, Text, Switch, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function SwitchControl({ label, value, onValueChange, theme, icon }) {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onValueChange(!value);
    };

    return (
        <Pressable 
            onPress={handlePress}
            style={({ pressed }) => [
                styles.container, 
                { 
                    borderBottomColor: theme.border,
                    backgroundColor: pressed ? 'rgba(0,0,0,0.03)' : 'transparent',
                }
            ]}
        >
            <View style={styles.labelContainer}>
                {icon && (
                    <MaterialCommunityIcons 
                        name={icon} 
                        size={22} 
                        color={value ? theme.primary : theme.secondary} 
                        style={styles.icon} 
                    />
                )}
                <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
            </View>
            <View style={styles.statusContainer}>
                <Text style={[
                    styles.status, 
                    { 
                        color: value ? theme.primary : theme.text,
                        opacity: value ? 1 : 0.5
                    }
                ]}>
                    {value ? 'ON' : 'OFF'}
                </Text>
                <Switch
                    value={value}
                    onValueChange={(newValue) => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onValueChange(newValue);
                    }}
                    thumbColor={value ? theme.primary : theme.switchThumb}
                    trackColor={{ false: theme.switchTrack, true: theme.accent }}
                    ios_backgroundColor={theme.switchTrack}
                    style={styles.switch}
                />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderRadius: 8,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    label: {
        fontSize: 16,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    status: {
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 8,
    },
    switch: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }]
    }
});
