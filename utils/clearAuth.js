import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem('mockUser');
    console.log('Auth data cleared successfully');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}; 