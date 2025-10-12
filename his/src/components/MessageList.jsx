import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/components.css';

const MessageList = ({ onMessageSelect, selectedMessageId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [user]);

  const loadMessages = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userMessages = api.getMessages(user.username);
      setMessages(userMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = (message) => {
    if (!message.read && message.to === user.username) {
      api.markMessageAsRead(message.id);
      loadMessages(); // Refresh to update read status
    }
    if (onMessageSelect) {
      onMessageSelect(message);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return (
      <div className="message-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💬</div>
          <div className="empty-state-title">No Messages</div>
          <div className="empty-state-text">You don't have any messages yet.</div>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`message-item ${
              !message.read && message.to === user.username ? 'unread' : ''
            } ${selectedMessageId === message.id ? 'selected' : ''}`}
            onClick={() => handleMessageClick(message)}
          >
            <div className="message-header">
              <div className="message-from">
                {message.from === user.username ? 'You' : message.from}
              </div>
              <div className="message-time">
                {formatTime(message.timestamp)}
              </div>
            </div>
            <div className="message-subject">
              {message.subject}
            </div>
            <div className="message-preview">
              {message.content.length > 100 
                ? `${message.content.substring(0, 100)}...` 
                : message.content
              }
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
