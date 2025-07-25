import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function AlertDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  // Mock alert data based on ID with proper coordinates
  const alertData = {
    1: {
      type: 'Neighborhood Emergency',
      icon: 'warning',
      responders: 5,
      timeReported: '24/07/2025, 18:45:23',
      location: '-33.9249, 18.4241',
      mapLocation: 'Cape Town',
      coordinates: {
        latitude: -33.9249,
        longitude: 18.4241,
      },
    },
    2: {
      type: 'Medical Emergency',
      icon: 'medical',
      responders: 5,
      timeReported: '24/07/2025, 18:45:34',
      location: '-33.9249, 18.4241',
      mapLocation: 'Cape Town',
      coordinates: {
        latitude: -33.9249,
        longitude: 18.4241,
      },
    },
  };

  const alert = alertData[id] || alertData[1];

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

  const handleCallEmergency = () => {
    Alert.alert(
      'Call Emergency Services',
      'Do you want to call emergency services?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            Linking.openURL('tel:911');
          }
        },
      ]
    );
  };

  const handleGetDirections = () => {
    const { latitude, longitude } = alert.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const handleChat = () => {
    // Navigate to emergency chat
    router.push('/emergency-chat');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>alert/{id}</Text>
            <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
              <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.alertBanner}>
            <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
            <Ionicons 
              name={alert.icon === 'medical' ? 'medical' : 'warning'} 
              size={20} 
              color="#FFFFFF" 
            />
            <Text style={styles.alertType}>{alert.type}</Text>
          </View>
        </View>

        {/* Alert Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Alert #{id} • {alert.responders} responders</Text>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: alert.coordinates.latitude,
              longitude: alert.coordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={locationPermission}
            showsMyLocationButton={true}
            showsCompass={true}
            showsScale={true}
          >
            {/* Alert Location Marker */}
            <Marker
              coordinate={alert.coordinates}
              title={alert.type}
              description={alert.mapLocation}
              pinColor={alert.icon === 'medical' ? '#DC2626' : '#F59E0B'}
            >
              <View style={styles.customMarker}>
                <Ionicons 
                  name={alert.icon === 'medical' ? 'medical' : 'warning'} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </View>
            </Marker>
            
            {/* User Location Marker (if available) */}
            {userLocation && (
              <Marker
                coordinate={userLocation}
                title="Your Location"
                description="You are here"
                pinColor="#1E40AF"
              />
            )}
          </MapView>
        </View>

        {/* Alert Information */}
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color="#FFFFFF" />
            <Text style={styles.infoTitle}>Alert Information</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#FFFFFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Time Reported</Text>
              <Text style={styles.infoValue}>{alert.timeReported}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#FFFFFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{alert.location}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="people" size={20} color="#FFFFFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Responders</Text>
              <Text style={styles.infoValue}>{alert.responders} community members responding</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCallEmergency}>
            <Ionicons name="call" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Call Emergency</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleGetDirections}>
            <Ionicons name="location" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Get Directions</Text>
          </TouchableOpacity>
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
  header: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chatButton: {
    padding: 8,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  alertType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  mapContainer: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    height: 250,
  },
  map: {
    height: 250,
    width: '100%',
  },
  customMarker: {
    width: 40,
    height: 40,
    backgroundColor: '#DC2626',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  infoContainer: {
    margin: 20,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
}); 