import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const [message, setMessage] = useState('');

  const messages = [
    {
      id: 1,
      sender: 'Community Chat!',
      text: '👋',
      time: '17:46:19',
      isSystem: true,
      isRight: true,
    },
    {
      id: 2,
      sender: 'Community Admin',
      text: 'Great to see everyone here. Let\'s keep our community safe!',
      time: '18:16:19',
      isRight: false,
    },
    {
      id: 3,
      sender: 'John D.',
      text: 'Anyone know about the road construction on Main Street?',
      time: '18:31:19',
      isRight: false,
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Community Chat</Text>
          <Text style={styles.headerSubtitle}>Connect with your neighbors</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.isRight ? styles.messageRight : styles.messageLeft,
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
              <Text style={styles.quickMessageText}>🚨</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickMessageButton}>
              <Text style={styles.quickMessageText}></Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message to the community..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.guidelines}>
          <Ionicons name="information-circle" size={16} color="#9CA3AF" />
          <Text style={styles.guidelinesText}>Keep messages respectful and community-focused</Text>
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
    backgroundColor: '#1E40AF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerContent: {
    alignItems: 'center',
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
  messagesContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#1F2937',
    alignSelf: 'flex-start',
  },
  messageRight: {
    backgroundColor: '#1F2937',
    alignSelf: 'flex-end',
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
    color: '#9CA3AF',
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
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#1F2937',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
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
  guidelines: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guidelinesText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
}); 