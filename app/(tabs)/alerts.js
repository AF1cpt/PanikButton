import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AlertsScreen() {
  const router = useRouter();

  const alerts = [
    {
      id: 1,
      type: 'Neighborhood',
      status: 'ACTIVE',
      title: 'Neighborhood Emergency',
      time: '18:40:18',
      responders: 8,
      icon: 'warning',
    },
    {
      id: 2,
      type: 'Medical',
      status: 'RESOLVED',
      title: 'Medical Emergency',
      time: '18:35:18',
      responders: 3,
      icon: 'medical',
    },
  ];

  const handleAlertPress = (alertId) => {
    router.push(`/alert/${alertId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBanner}>
            <Ionicons name="notifications" size={24} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Active Alerts</Text>
            <Text style={styles.headerSubtitle}>Community emergency notifications</Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
          </View>
        </View>

        {/* Alerts List */}
        <View style={styles.alertsContainer}>
          {alerts.map((alert) => (
            <TouchableOpacity
              key={alert.id}
              style={styles.alertCard}
              onPress={() => handleAlertPress(alert.id)}
            >
              <View style={styles.alertHeader}>
                <View style={styles.alertTypeBadge}>
                  <Ionicons 
                    name={alert.icon === 'medical' ? 'medical' : 'warning'} 
                    size={12} 
                    color="#FFFFFF" 
                  />
                  <Text style={styles.alertTypeText}>{alert.type}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  alert.status === 'ACTIVE' ? styles.activeBadge : styles.resolvedBadge
                ]}>
                  <Text style={styles.statusText}>{alert.status}</Text>
                </View>
              </View>
              
              <Text style={styles.alertTitle}>{alert.title}</Text>
              
              <View style={styles.alertFooter}>
                <View style={styles.alertInfo}>
                  <Ionicons name="time" size={14} color="#9CA3AF" />
                  <Text style={styles.alertInfoText}>{alert.time}</Text>
                </View>
                <View style={styles.alertInfo}>
                  <Ionicons name="people" size={14} color="#9CA3AF" />
                  <Text style={styles.alertInfoText}>{alert.responders} responders</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
    paddingBottom: 24,
  },
  headerBanner: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  alertsContainer: {
    padding: 20,
  },
  alertCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertTypeText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#059669',
  },
  resolvedBadge: {
    backgroundColor: '#059669',
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertInfoText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 4,
  },
}); 