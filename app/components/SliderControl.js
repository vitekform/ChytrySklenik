import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

export default function SliderControl({
                                          label,
                                          value,
                                          onValueChange,
                                          min,
                                          max,
                                          unit,
                                          theme
                                      }) {
    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
            <View style={styles.sliderContainer}>
                <Text style={[styles.value, { color: theme.primary }]}>
                    {value}{unit}
                </Text>
                <Slider
                    value={value}
                    onValueChange={onValueChange}
                    minimumValue={min}
                    maximumValue={max}
                    step={1}
                    minimumTrackTintColor={theme.primary}
                    maximumTrackTintColor={theme.border}
                    thumbTintColor={theme.primary}
                    style={styles.slider}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    sliderContainer: {
        flexDirection: 'column',
    },
    value: {
        textAlign: 'right',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    slider: {
        width: '100%',
        height: 40,
    },
});
