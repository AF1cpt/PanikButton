import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import '../styles/GlobalStyles.css';

// Example component using centralized CSS
const StyledComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>WW</Text>
        </View>
        <Text style={styles.headerTitle}>Worcester Watch</Text>
        <Text style={styles.headerSubtitle}>Community Safety</Text>
      </View>
      
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Emergency Alert</Text>
          <View style={[styles.statusBadge, styles.statusBadgeActive]}>
            <Text style={styles.statusBadgeText}>ACTIVE</Text>
          </View>
        </View>
        <Text style={styles.cardSubtitle}>Medical emergency in your area</Text>
      </View>
      
      <TouchableOpacity style={styles.buttonPrimary}>
        <Text style={styles.buttonPrimaryText}>Respond to Alert</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.buttonSecondary}>
        <Text style={styles.buttonSecondaryText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

// Convert CSS classes to React Native StyleSheet
const styles = StyleSheet.create({
  // Import from GlobalStyles.css
  container: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#000000',
    padding: 16,
  },
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#E5E7EB',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#E5E7EB',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  statusBadgeActive: {
    backgroundColor: '#DC2626',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonPrimary: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#111827',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6B7280',
  },
  buttonSecondaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StyledComponent; 