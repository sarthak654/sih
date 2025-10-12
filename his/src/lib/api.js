// Mock API functions for data operations
import { storage } from './storage.js';

export const api = {
  // Authentication
  login: async (username, password) => {
    const users = storage.get('users') || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      storage.set('currentUser', user);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials' };
  },

  logout: () => {
    storage.remove('currentUser');
    return { success: true };
  },

  getCurrentUser: () => {
    return storage.get('currentUser');
  },

  // Surveys
  getSurveys: (userId = null) => {
    const surveys = storage.get('surveys') || [];
    if (userId) {
      return surveys.filter(survey => survey.createdBy === userId);
    }
    return surveys;
  },

  getSurveyById: (id) => {
    const surveys = storage.get('surveys') || [];
    return surveys.find(survey => survey.id === parseInt(id));
  },

  createSurvey: (surveyData) => {
    const surveys = storage.get('surveys') || [];
    const newSurvey = {
      id: Date.now(),
      ...surveyData,
      createdAt: new Date().toISOString(),
      status: 'draft',
      approvedBy: null,
      approvedAt: null
    };
    surveys.push(newSurvey);
    storage.set('surveys', surveys);
    return { success: true, survey: newSurvey };
  },

  updateSurvey: (id, updates) => {
    const surveys = storage.get('surveys') || [];
    const index = surveys.findIndex(survey => survey.id === parseInt(id));
    if (index !== -1) {
      surveys[index] = { ...surveys[index], ...updates };
      storage.set('surveys', surveys);
      return { success: true, survey: surveys[index] };
    }
    return { success: false, message: 'Survey not found' };
  },

  deleteSurvey: (id) => {
    const surveys = storage.get('surveys') || [];
    const filteredSurveys = surveys.filter(survey => survey.id !== parseInt(id));
    storage.set('surveys', filteredSurveys);
    return { success: true };
  },

  approveSurvey: (id, approvedBy) => {
    return api.updateSurvey(id, {
      status: 'approved',
      approvedBy,
      approvedAt: new Date().toISOString()
    });
  },

  rejectSurvey: (id, approvedBy) => {
    return api.updateSurvey(id, {
      status: 'rejected',
      approvedBy,
      approvedAt: new Date().toISOString()
    });
  },

  // Messages
  getMessages: (userId) => {
    const messages = storage.get('messages') || [];
    return messages.filter(msg => msg.to === userId || msg.from === userId);
  },

  sendMessage: (messageData) => {
    const messages = storage.get('messages') || [];
    const newMessage = {
      id: Date.now(),
      ...messageData,
      timestamp: new Date().toISOString(),
      read: false
    };
    messages.push(newMessage);
    storage.set('messages', messages);
    return { success: true, message: newMessage };
  },

  markMessageAsRead: (id) => {
    const messages = storage.get('messages') || [];
    const index = messages.findIndex(msg => msg.id === parseInt(id));
    if (index !== -1) {
      messages[index].read = true;
      storage.set('messages', messages);
      return { success: true };
    }
    return { success: false };
  },

  // Statistics
  getStats: (userId = null) => {
    const surveys = storage.get('surveys') || [];
    let userSurveys = surveys;
    
    if (userId) {
      userSurveys = surveys.filter(survey => survey.createdBy === userId);
    }

    const stats = {
      total: userSurveys.length,
      draft: userSurveys.filter(s => s.status === 'draft').length,
      submitted: userSurveys.filter(s => s.status === 'submitted').length,
      approved: userSurveys.filter(s => s.status === 'approved').length,
      rejected: userSurveys.filter(s => s.status === 'rejected').length
    };

    return stats;
  }
};
