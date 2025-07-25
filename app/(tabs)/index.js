import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Animated, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  const holdTimer = useRef(null);
  const pulseTimer = useRef(null);

  // Continuous pulse animation
  useEffect(() => {
    const startPulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    if (isHolding && !isActivated) {
      startPulse();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (pulseTimer.current) {
        clearInterval(pulseTimer.current);
      }
    };
  }, [isHolding, isActivated]);

  const handleSOSPressIn = () => {
    if (isActivated) return;
    
    setIsHolding(true);
    setHoldProgress(0);
    
    // Start scale animation
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();
    
    // Start glow animation
    Animated.timing(glowAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Start progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
    
    // Start hold timer
    holdTimer.current = setTimeout(() => {
      activateSOS();
    }, 2000);
    
    // Update progress every 100ms
    const progressInterval = setInterval(() => {
      setHoldProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 100);
    
    // Vibrate on press
    Vibration.vibrate(50);
  };

  const handleSOSPressOut = () => {
    if (isActivated) return;
    
    setIsHolding(false);
    setHoldProgress(0);
    
    // Reset animations
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(glowAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    // Clear timer
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const activateSOS = () => {
    setIsActivated(true);
    setIsHolding(false);
    
    // Strong vibration feedback
    Vibration.vibrate([0, 200, 100, 200, 100, 200]);
    
    // Success animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate after animation
    setTimeout(() => {
      router.push('/emergency-type');
      setIsActivated(false);
    }, 500);
  };

  const handleCommunityChat = () => {
    router.push('/(tabs)/chat');
  };

  const handleViewAlerts = () => {
    router.push('/(tabs)/alerts');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={32} color="#DC2626" />
          </View>
          <Text style={styles.title}>Worcester Watch</Text>
          <Text style={styles.subtitle}>Community Safety Network</Text>
          <Text style={styles.welcomeText}>Welcome, Test User!</Text>
        </View>

        {/* SOS Button */}
        <View style={styles.buttonSection}>
          <View style={styles.sosButtonContainer}>
            {/* Glow effect */}
            <Animated.View
              style={[
                styles.sosButtonGlow,
                {
                  opacity: glowAnim,
                  transform: [{ scale: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.3]
                  })}]
                }
              ]}
            />
            
            
            
            {/* Main button */}
            <Animated.View
              style={[
                styles.sosButtonWrapper,
                {
                  transform: [
                    { scale: Animated.multiply(scaleAnim, pulseAnim) }
                  ]
                }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.sosButton,
                  isHolding && styles.sosButtonActive,
                  isActivated && styles.sosButtonActivated
                ]}
                onPressIn={handleSOSPressIn}
                onPressOut={handleSOSPressOut}
                activeOpacity={1}
                disabled={isActivated}
              >
                <Ionicons 
                  name={isActivated ? "checkmark-circle" : "warning"} 
                  size={32} 
                  color="#FFFFFF" 
                />
                <Text style={styles.sosButtonText}>
                  {isActivated ? "SOS ACTIVATED" : "HOLD FOR SOS"}
                </Text>
                <Text style={styles.sosButtonSubtext}>
                  {isActivated ? "Redirecting..." : `${Math.round(holdProgress)}% - 2 seconds to activate`}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
          
          <Text style={styles.instructionText}>
            {isActivated 
              ? "Emergency mode activated - redirecting to emergency selection"
              : "Hold the button for 2 seconds to activate emergency mode"
            }
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCommunityChat}>
            <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Community Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleViewAlerts}>
            <Ionicons name="notifications" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>View Alerts</Text>
          </TouchableOpacity>
        </View>

        {/* Community Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>1,247 Active Members</Text>
          <Text style={styles.statsText}>24/7 Community Watch</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sosButtonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sosButtonGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#DC2626',
    opacity: 0.3,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },

  sosButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosButtonActive: {
    backgroundColor: '#B91C1C',
  },
  sosButtonActivated: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
    shadowOpacity: 0.5,
  },
  sosButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  sosButtonSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  instructionText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1E40AF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
    minHeight: 80,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statsText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
}); 