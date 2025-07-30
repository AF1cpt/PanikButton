import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Alert,
  Vibration,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentLocation } from '../lib/location';
import { supabase } from '../lib/supabase';

export default function InteractivePanicButton() {
  const [isPressed, setIsPressed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pressTimeout = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animation setup
  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse).start();

    return () => {
      pulseAnim.setValue(1);
    };
  }, []);

  const handlePressIn = () => {
    setIsPressed(true);
    Vibration.vibrate(100); // Short vibration feedback

    // Start the timer for long press
    pressTimeout.current = setTimeout(async () => {
      try {
        await triggerAlert();
      } catch (error) {
        console.error('Error triggering alert:', error);
        Alert.alert('Error', 'Failed to send alert. Please try again.');
      }
    }, 2000); // 2 seconds hold to trigger
  };

  const handlePressOut = () => {
    setIsPressed(false);
    if (pressTimeout.current) {
      clearTimeout(pressTimeout.current);
    }
  };

  const triggerAlert = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      Vibration.vibrate([500, 500, 500]); // Pattern: vibrate-pause-vibrate

      // Get current location
      const location = await getCurrentLocation();
      const { latitude, longitude } = location.coords;

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Create alert in database
      const { data: alert, error: alertError } = await supabase
        .from('alerts')
        .insert([
          {
            user_id: user.id,
            location: `POINT(${longitude} ${latitude})`,
            status: 'active',
            type: 'emergency',
            description: 'Emergency alert triggered',
          }
        ])
        .select()
        .single();

      if (alertError) throw alertError;

      // Find nearby responders (within 5km)
      const { data: responders, error: respondersError } = await supabase
        .from('users')
        .select('id')
        .eq('is_responder', true)
        .eq('responder_verified', true)
        .filter('location', 'st_dwithin', `POINT(${longitude} ${latitude})`, 5000);

      if (respondersError) throw respondersError;

      // Update alert with notified responders
      if (responders?.length > 0) {
        const responderIds = responders.map(r => r.id);
        const { error: updateError } = await supabase
          .from('alerts')
          .update({ responders_notified: responderIds })
          .eq('id', alert.id);

        if (updateError) throw updateError;
      }

      // Trigger serverless function for notifications
      const { error: functionError } = await supabase.functions.invoke('trigger-alert', {
        body: { 
          alertId: alert.id,
          location: { latitude, longitude }
        }
      });

      if (functionError) throw functionError;

      Alert.alert(
        'Alert Sent',
        'Emergency services and nearby community members have been notified.',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Error sending alert:', error);
      Alert.alert('Error', 'Failed to send alert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.pulseContainer,
        { transform: [{ scale: pulseAnim }] }
      ]}>
        <TouchableOpacity
          style={[
            styles.button,
            isPressed && styles.buttonPressed,
            isSubmitting && styles.buttonSubmitting
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isSubmitting}
        >
          <Ionicons 
            name="alert-circle" 
            size={40} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonPressed: {
    backgroundColor: '#991B1B',
    transform: [{ scale: 0.95 }],
  },
  buttonSubmitting: {
    backgroundColor: '#4B5563',
  },
});
