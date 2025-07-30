import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import InteractivePanicButton from '../../components/InteractivePanicButton';
import { requestLocationPermissions } from '../../lib/location';

export default function EmergencyScreen() {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      await requestLocationPermissions();
      setHasLocationPermission(true);
    } catch (error) {
      console.error('Location permission error:', error);
      setHasLocationPermission(false);
      Alert.alert(
        'Location Access Required',
        'We need location access to send alerts. Please enable location services in your settings.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Stack.Screen
        options={{
          title: 'Emergency',
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#FFFFFF',
          headerShadowVisible: false,
        }}
      />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Emergency Alert</Text>
          <Text style={styles.subtitle}>
            Press and hold the button for 2 seconds to send an emergency alert
          </Text>
          
          <InteractivePanicButton />
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>What happens when you trigger an alert?</Text>
            <Text style={styles.infoText}>
              1. Your location will be shared with emergency services{'\n'}
              2. Nearby community members will be notified{'\n'}
              3. You'll be connected to the emergency chat{'\n'}
              4. Verified responders will be dispatched
            </Text>
          </View>

          {!hasLocationPermission && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningTitle}>Location Access Required</Text>
              <Text style={styles.warningText}>
                Please enable location access in your settings to use the emergency alert feature.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 40,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginTop: 40,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 24,
  },
  warningContainer: {
    width: '100%',
    backgroundColor: '#991B1B',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#FCA5A5',
    lineHeight: 20,
  },
});
