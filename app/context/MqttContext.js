import React, {createContext, useState, useEffect, useCallback, useContext} from 'react';
import mqtt from 'mqtt/dist/mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const TARGET_SETTINGS_KEY = '@ChytrySklenik:targetSettings';
const MANUAL_CONTROLS_KEY = '@ChytrySklenik:manualControls';

export const MqttContext = createContext();

export const useMqtt = () => {
    const context = useContext(MqttContext);
    if (!context) {
        throw new Error('useMqtt must be used within a MqttProvider');
    }
    return context;
};

export function MqttProvider({ children }) {
    const [client, setClient] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [lastMessageTime, setLastMessageTime] = useState(null);
    const [controllerStatus, setControllerStatus] = useState('Offline');
    const [sensorData, setSensorData] = useState({
        temperature: 0,
        pressure: 0,
        humidity: 0,
        moisture: 0,
        light: 0
    });
    const [targetSettings, setTargetSettings] = useState({
        temperature: 25,
        humidity: 50,
        moisture: 40
    });
    const [manualControls, setManualControls] = useState({
        fan: false,
        waterPump: false,
        heating: false,
        lightLevel: 50
    });
    const [autoMode, setAutoMode] = useState(true);
    const [devMode, setDevMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // MQTT Configuration (matches Arduino)
    // Note: Arduino uses direct MQTT on port 8883, but React Native needs WebSockets
    const MQTT_BROKER = 'wss://b4aab6512bbd4adc8bcf3981fe64f1dc.s1.eu.hivemq.cloud:8884/mqtt';
    const MQTT_OPTIONS = {
        username: 'sklenik',
        password: 'Puntik2010',
        rejectUnauthorized: false // Required for self-signed certs
    };

    // Connect to MQTT broker
    const connectToBroker = useCallback(() => {
        setConnectionStatus('Connecting...');
        const mqttClient = mqtt.connect(MQTT_BROKER, MQTT_OPTIONS);

        mqttClient.on('connect', () => {
            setConnectionStatus('Connected');
            mqttClient.subscribe('sklenik/sensor');
        });

        mqttClient.on('message', (topic, message) => {
            try {
                const data = JSON.parse(message.toString());

                // Update last message time and set controller as online
                setLastMessageTime(Date.now());
                setControllerStatus('Online');

                // Handle sensor data updates
                if (data.temp !== undefined) {
                    setSensorData({
                        temperature: data.temp,
                        pressure: data.pressure || 0,
                        humidity: data.humidity || 0,
                        moisture: data.moisture || 0,
                        light: data.light || 0
                    });

                    // Update device states and auto mode from Arduino
                    if (data.autoMode !== undefined) {
                        setAutoMode(data.autoMode);
                    }

                    // Update manual controls to reflect actual device states
                    setManualControls(prev => ({
                        ...prev,
                        fan: data.fanActive || false,
                        waterPump: data.pumpActive || false,
                        heating: data.heaterActive || false
                    }));
                }
            } catch (error) {
                console.error('MQTT message parse error:', error);
            }
        });

        mqttClient.on('error', (err) => {
            console.error('MQTT Error:', err);
            setConnectionStatus(`Error: ${err.message}`);
        });

        mqttClient.on('close', () => {
            setConnectionStatus('Disconnected');
        });

        mqttClient.on('offline', () => {
            setConnectionStatus('Offline');
        });

        setClient(mqttClient);
        return () => {
            if (mqttClient && mqttClient.connected) {
                mqttClient.end();
            }
        };
    }, []);

    // Publish settings
    const publishSettings = useCallback(() => {
        if (client && client.connected) {
            client.publish(
                'sklenik/sensor',
                JSON.stringify({
                    type: 'settings',
                    targetTemp: targetSettings.temperature,
                    targetHumidity: targetSettings.humidity,
                    targetMoisture: targetSettings.moisture,
                    autoMode: autoMode
                })
            );
        }
    }, [client, targetSettings, autoMode]);

    // Publish auto mode change
    const publishAutoMode = useCallback(() => {
        if (client && client.connected) {
            client.publish(
                'sklenik/sensor',
                JSON.stringify({
                    type: 'settings',
                    autoMode: autoMode
                })
            );
        }
    }, [client, autoMode]);

    // Publish manual controls
    const publishManualControls = useCallback(() => {
        if (client && client.connected) {
            client.publish(
                'sklenik/sensor',
                JSON.stringify({
                    type: 'manual',
                    fan: manualControls.fan,
                    waterPump: manualControls.waterPump,
                    heating: manualControls.heating,
                    lightLevel: manualControls.lightLevel
                })
            );
        }
    }, [client, manualControls]);

    // Connect on mount
    useEffect(() => {
        connectToBroker();
    }, [connectToBroker]);

    // Publish when settings change
    useEffect(() => {
        publishSettings();
    }, [targetSettings, publishSettings]);

    // We no longer automatically publish manual controls when they change
    // This will be done explicitly via the Sync button

    // Check if controller is offline (no message for more than 1 minute)
    useEffect(() => {
        const checkControllerStatus = () => {
            if (lastMessageTime) {
                const currentTime = Date.now();
                const timeSinceLastMessage = currentTime - lastMessageTime;

                // If last message was more than 1 minute ago, set controller as offline
                if (timeSinceLastMessage > 60000) { // 60000 ms = 1 minute
                    setControllerStatus('Offline');
                }
            }
        };

        // Check controller status every 10 seconds
        const intervalId = setInterval(checkControllerStatus, 10000);

        // Clean up interval on unmount
        return () => clearInterval(intervalId);
    }, [lastMessageTime]);

    // Load saved settings on mount
    useEffect(() => {
        const loadSavedSettings = async () => {
            try {
                // Load target settings
                const savedTargetSettings = await AsyncStorage.getItem(TARGET_SETTINGS_KEY);
                if (savedTargetSettings !== null) {
                    setTargetSettings(JSON.parse(savedTargetSettings));
                }

                // Load manual controls
                const savedManualControls = await AsyncStorage.getItem(MANUAL_CONTROLS_KEY);
                if (savedManualControls !== null) {
                    setManualControls(JSON.parse(savedManualControls));
                }
            } catch (error) {
                console.error('Failed to load saved settings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSavedSettings();
    }, []);

    // Save target settings when they change
    useEffect(() => {
        const saveTargetSettings = async () => {
            try {
                await AsyncStorage.setItem(TARGET_SETTINGS_KEY, JSON.stringify(targetSettings));
            } catch (error) {
                console.error('Failed to save target settings:', error);
            }
        };

        if (!isLoading) {
            saveTargetSettings();
        }
    }, [targetSettings, isLoading]);

    // Save manual controls when they change
    useEffect(() => {
        const saveManualControls = async () => {
            try {
                await AsyncStorage.setItem(MANUAL_CONTROLS_KEY, JSON.stringify(manualControls));
            } catch (error) {
                console.error('Failed to save manual controls:', error);
            }
        };

        if (!isLoading) {
            saveManualControls();
        }
    }, [manualControls, isLoading]);

    return (
        <MqttContext.Provider value={{
            client,
            connectionStatus,
            controllerStatus,
            sensorData,
            targetSettings,
            setTargetSettings,
            manualControls,
            setManualControls,
            autoMode,
            setAutoMode,
            publishAutoMode,
            devMode,
            setDevMode,
            publishManualControls
        }}>
            {children}
        </MqttContext.Provider>
    );
}
