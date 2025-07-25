import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

export default function EmergencyTypeScreen() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  // Get user location on component mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  const handleEmergencyType = async (type) => {
    // Get current location if not already available
    if (!userLocation && locationPermission) {
      try {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        Alert.alert('Location Error', 'Unable to get your current location. Please try again.');
        return;
      }
    }

    // Handle emergency type selection with location
    if (type === 'sos') {
      router.push('/alert/1'); // Navigate to neighborhood emergency
    } else if (type === 'medical') {
      router.push('/alert/2'); // Navigate to medical emergency
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.emergencyIcon}>
            <Ionicons name="warning" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Emergency Type</Text>
          <Text style={styles.subtitle}>Choose the type of emergency to alert the community.</Text>
          
          {/* Location Status */}
          <View style={styles.locationStatus}>
            <Ionicons 
              name={locationPermission ? "location" : "location-outline"} 
              size={16} 
              color={locationPermission ? "#059669" : "#9CA3AF"} 
            />
            <Text style={[
              styles.locationText,
              { color: locationPermission ? "#059669" : "#9CA3AF" }
            ]}>
              {locationPermission ? "Location Available" : "Location Required"}
            </Text>
          </View>
        </View>

        {/* Emergency Options */}
        <View style={styles.optionsContainer}>
          {/* SOS Option */}
          <TouchableOpacity
            style={styles.emergencyCard}
            onPress={() => handleEmergencyType('sos')}
          >
            <View style={styles.cardContent}>
              <View style={styles.emergencyIcon}>
                <Ionicons name="warning" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>SOS</Text>
                <Text style={styles.cardDescription}>
                  Emergency affecting the neighborhood (fire, crime, etc.)
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {/* Medical Emergency Option */}
          <TouchableOpacity
            style={styles.emergencyCard}
            onPress={() => handleEmergencyType('medical')}
          >
            <View style={styles.cardContent}>
              <View style={[styles.cardIcon, styles.medicalIcon]}>
                <Ionicons name="medical" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Medical Emergency</Text>
                <Text style={styles.cardDescription}>
                  Personal or nearby medical assistance needed
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  emergencyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emergencyCard: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  medicalIcon: {
    backgroundColor: '#059669',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
  },
  cancelButton: {
    backgroundColor: '#374151',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 