import * as Location from 'expo-location';

export async function requestLocationPermissions() {
  try {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      throw new Error('Permission to access background location was denied');
    }

    return true;
  } catch (error) {
    console.error('Error requesting location permissions:', error);
    throw error;
  }
}

export async function getCurrentLocation() {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    return location;
  } catch (error) {
    console.error('Error getting current location:', error);
    throw error;
  }
}

export function startLocationUpdates(callback) {
  try {
    const subscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,  // Update every 5 seconds
        distanceInterval: 5, // Update every 5 meters
      },
      callback
    );
    return subscription;
  } catch (error) {
    console.error('Error starting location updates:', error);
    throw error;
  }
}
