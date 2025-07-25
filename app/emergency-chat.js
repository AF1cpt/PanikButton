import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EmergencyChatScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const messages = [
    {
      id: 1,
      sender: 'System',
      text: '🚨 Neighborhood Emergency Alert Activated',
      time: '18:45:54',
      isSystem: true,
    },
    {
      id: 2,
      sender: 'Test User',
      text: '🚨 Emergency situation in progress',
      time: '18:45:56',
      isRight: true,
    },
    {
      id: 3,
      sender: 'Test User',
      text: 'Nsjjs',
      time: '18:46:03',
      isRight: true,
    },
    {
      id: 4,
      sender: 'Test User',
      text: 'Need immediate assistance',
      time: '18:46:08',
      isRight: false,
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage('');
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Neighborhood Emergency Chat</Text>
      </View>

      {/* Chat Messages */}
      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.isRight ? styles.messageRight : styles.messageLeft,
              msg.isSystem ? styles.systemMessage : null,
            ]}
          >
            <Text style={styles.messageSender}>{msg.sender}</Text>
            <Text style={styles.messageText}>{msg.text}</Text>
            <Text style={styles.messageTime}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.quickMessages}>
          <Text style={styles.quickMessagesLabel}>Quick Messages:</Text>
          <View style={styles.quickMessageButtons}>
            <TouchableOpacity style={styles.quickMessageButton}>
              <Text style={styles.quickMessageText}>🚨 Situation in progress</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickMessageButton}>
              <Text style={styles.quickMessageText}></Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  closeButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  messagesContent: {
    padding: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  messageLeft: {
    backgroundColor: '#DC2626',
    alignSelf: 'flex-start',
  },
  messageRight: {
    backgroundColor: '#1E40AF',
    alignSelf: 'flex-end',
  },
  systemMessage: {
    backgroundColor: '#DC2626',
    alignSelf: 'flex-start',
  },
  messageSender: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    backgroundColor: '#000000',
    padding: 20,
  },
  quickMessages: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickMessagesLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 12,
  },
  quickMessageButtons: {
    flexDirection: 'row',
  },
  quickMessageButton: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  quickMessageText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#1F2937',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    maxHeight: 100,
    paddingVertical: 0,
  },
  sendButton: {
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
}); 