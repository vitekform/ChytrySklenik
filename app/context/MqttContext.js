import React, {createContext, useState, useEffect, useCallback, useContext} from 'react';
import mqtt from 'mqtt/dist/mqtt';

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
    const [devMode, setDevMode] = useState(false);

    // MQTT Configuration (matches Arduino)
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

                // Handle sensor data updates
                if (data.temp !== undefined) {
                    setSensorData({
                        temperature: data.temp,
                        pressure: data.pressure || 0,
                        humidity: data.humidity || 0,
                        moisture: data.moisture || 0,
                        light: data.light || 0
                    });
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
                    targetMoisture: targetSettings.moisture
                })
            );
        }
    }, [client, targetSettings]);

    // Publish manual controls
    const publishManualControls = useCallback(() => {
        if (client && client.connected && devMode) {
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
    }, [client, manualControls, devMode]);

    // Connect on mount
    useEffect(() => {
        connectToBroker();
    }, [connectToBroker]);

    // Publish when settings change
    useEffect(() => {
        publishSettings();
    }, [targetSettings, publishSettings]);

    // Publish when manual controls change
    useEffect(() => {
        publishManualControls();
    }, [manualControls, publishManualControls]);

    return (
        <MqttContext.Provider value={{
            client,
            connectionStatus,
            sensorData,
            targetSettings,
            setTargetSettings,
            manualControls,
            setManualControls,
            devMode,
            setDevMode
        }}>
            {children}
        </MqttContext.Provider>
    );
}