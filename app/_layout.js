import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    // For now, always show login screen
    setTimeout(() => {
      setIsAuthenticated(false);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={{ color: '#FFFFFF', marginTop: 16 }}>Loading Worcester Watch...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth screens (login/register) */}
      <Stack.Screen name="(auth)" />
      
      {/* Main app screens */}
      <Stack.Screen name="(tabs)" />
      
      {/* Other screens */}
      <Stack.Screen name="emergency-type" />
      <Stack.Screen name="emergency-chat" />
      <Stack.Screen name="alert/[id]" />
    </Stack>
  );
} 