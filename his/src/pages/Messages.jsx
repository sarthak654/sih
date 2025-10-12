import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';
import MessageList from '../components/MessageList.jsx';
import Modal from '../components/Modal.jsx';
import '../styles/layout.css';

const Messages = () => {
  const { user } = useAuth();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    content: ''
  });
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, [user]);

  const loadUsers = () => {
    const allUsers = api.storage.get('users') || [];
    // Filter out current user and show only other users
    const otherUsers = allUsers.filter(u => u.username !== user.username);
    setUsers(otherUsers);
  };

  const handleComposeChange = (e) => {
    const { name, value } = e.target;
    setComposeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!composeData.to || !composeData.subject || !composeData.content) {
      alert('Please fill in all fields');
      return;
    }

    setSending(true);
    try {
      await api.sendMessage({
        from: user.username,
        to: composeData.to,
        subject: composeData.subject,
        content: composeData.content
      });
      
      // Reset form and close modal
      setComposeData({ to: '', subject: '', content: '' });
      setShowComposeModal(false);
      
      // Refresh message list by triggering a re-render
      window.location.reload();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleComposeModalClose = () => {
    setShowComposeModal(false);
    setComposeData({ to: '', subject: '', content: '' });
  };

  const formatFullDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container">
      <div className="main-content">
        <div className="page-header">
          <div className="flex-container justify-content-between align-items-center">
            <div>
              <h1 className="page-title">Messages</h1>
              <p className="page-subtitle">
                Communicate with other team members.
              </p>
            </div>
            <button 
              onClick={() => setShowComposeModal(true)}
              className="btn btn-primary"
            >
              + Compose Message
            </button>
          </div>
        </div>

        <div className="content-with-sidebar">
          <div className="sidebar">
            <h3 style={{ marginBottom: '1rem', color: 'var(--dark-color)' }}>
              Conversations
            </h3>
            <MessageList 
              onMessageSelect={setSelectedMessage}
              selectedMessageId={selectedMessage?.id}
            />
          </div>

          <div className="content-area">
            {selectedMessage ? (
              <div className="card">
                <div className="card-header">
                  <div className="flex-container justify-content-between align-items-center">
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                        {selectedMessage.subject}
                      </h3>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        From: {selectedMessage.from} • {formatFullDate(selectedMessage.timestamp)}
                      </div>
                    </div>
                    <div className="action-buttons">
                      <button 
                        onClick={() => setSelectedMessage(null)}
                        className="action-btn"
                        title="Close"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ 
                    whiteSpace: 'pre-wrap', 
                    lineHeight: '1.6',
                    fontSize: '1rem'
                  }}>
                    {selectedMessage.content}
                  </div>
                </div>
                <div className="card-footer">
                  <button 
                    onClick={() => {
                      setComposeData({
                        to: selectedMessage.from,
                        subject: `Re: ${selectedMessage.subject}`,
                        content: ''
                      });
                      setShowComposeModal(true);
                      setSelectedMessage(null);
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">💬</div>
                <div className="empty-state-title">No Message Selected</div>
                <div className="empty-state-text">
                  Select a message from the sidebar to view its content, or compose a new message.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Message Modal */}
      <Modal
        isOpen={showComposeModal}
        onClose={handleComposeModalClose}
        title="Compose Message"
        size="medium"
      >
        <form onSubmit={handleSendMessage}>
          <div className="form-group">
            <label htmlFor="to" className="form-label">
              To
            </label>
            <select
              id="to"
              name="to"
              className="form-control"
              value={composeData.to}
              onChange={handleComposeChange}
              required
            >
              <option value="">Select recipient</option>
              {users.map(userOption => (
                <option key={userOption.username} value={userOption.username}>
                  {userOption.name} ({userOption.role === 'surveyor' ? 'Surveyor' : 'Supervisor'})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject" className="form-label">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="form-control"
              value={composeData.subject}
              onChange={handleComposeChange}
              required
              placeholder="Enter message subject"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Message
            </label>
            <textarea
              id="content"
              name="content"
              className="form-control"
              value={composeData.content}
              onChange={handleComposeChange}
              required
              placeholder="Enter your message"
              rows="6"
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={handleComposeModalClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={sending}
            >
              {sending ? (
                <span>
                  <span className="spinner"></span> Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Messages;
