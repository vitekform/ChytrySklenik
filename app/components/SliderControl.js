import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function SliderControl({
    label,
    value,
    onValueChange,
    min,
    max,
    unit,
    theme,
    icon
}) {
    const [isSliding, setIsSliding] = useState(false);
    const [scaleAnim] = useState(new Animated.Value(1));

    const handleSlidingStart = () => {
        setIsSliding(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.spring(scaleAnim, {
            toValue: 1.05,
            friction: 5,
            tension: 40,
            useNativeDriver: true
        }).start();
    };

    const handleSlidingComplete = () => {
        setIsSliding(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true
        }).start();
    };

    return (
        <Animated.View 
            style={[
                styles.container, 
                { transform: [{ scale: scaleAnim }] }
            ]}
        >
            <View style={styles.headerContainer}>
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
                <View style={[
                    styles.valueContainer, 
                    { 
                        backgroundColor: isSliding ? theme.primary : 'rgba(0,0,0,0.03)',
                    }
                ]}>
                    <Text style={[
                        styles.value, 
                        { 
                            color: isSliding ? theme.section : theme.primary 
                        }
                    ]}>
                        {value}{unit}
                    </Text>
                </View>
            </View>
            <View style={styles.sliderContainer}>
                <Slider
                    value={value}
                    onValueChange={onValueChange}
                    onSlidingStart={handleSlidingStart}
                    onSlidingComplete={handleSlidingComplete}
                    minimumValue={min}
                    maximumValue={max}
                    step={1}
                    minimumTrackTintColor={theme.primary}
                    maximumTrackTintColor={theme.border}
                    thumbTintColor={isSliding ? theme.accent : theme.primary}
                    style={styles.slider}
                />
                <View style={styles.rangeLabels}>
                    <Text style={[styles.rangeText, { color: theme.text }]}>{min}{unit}</Text>
                    <Text style={[styles.rangeText, { color: theme.text }]}>{max}{unit}</Text>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        backgroundColor: 'rgba(0,0,0,0.01)',
        borderRadius: 10,
        padding: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
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
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sliderContainer: {
        flexDirection: 'column',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    rangeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -8,
    },
    rangeText: {
        fontSize: 12,
        opacity: 0.7,
    }
});
