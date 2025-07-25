import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, FlatList, View as RNView } from 'react-native';

import { Text, View } from './Themed';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Chat({ alertId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, [alertId]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          users!chat_messages_user_id_fkey (
            full_name
          )
        `)
        .eq('alert_id', alertId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `alert_id=eq.${alertId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            alert_id: alertId,
            user_id: user.id,
            message: newMessage.trim(),
          },
        ]);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.user_id === user?.id;
    
    return (
      <RNView style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        <Text style={styles.messageSender}>
          {item.users?.full_name || 'Unknown'}
        </Text>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.created_at).toLocaleTimeString()}
        </Text>
      </RNView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat</Text>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

      <RNView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!newMessage.trim() || loading) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!newMessage.trim() || loading}
        >
          <Text style={styles.sendButtonText}>
            {loading ? '...' : 'Send'}
          </Text>
        </TouchableOpacity>
      </RNView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messagesList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#666',
  },
  messageText: {
    fontSize: 14,
    marginBottom: 2,
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    maxHeight: 100,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 