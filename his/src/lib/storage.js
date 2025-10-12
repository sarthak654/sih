// localStorage utilities for data persistence
export const storage = {
  // Get data from localStorage
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting data from localStorage:', error);
      return null;
    }
  },

  // Set data in localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting data in localStorage:', error);
      return false;
    }
  },

  // Remove data from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data from localStorage:', error);
      return false;
    }
  },

  // Clear all data
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Initialize default data if not exists
export const initializeData = () => {
  // Default users
  if (!storage.get('users')) {
    const defaultUsers = [
      {
        id: 1,
        username: 'surveyor1',
        password: 'password123',
        role: 'surveyor',
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '9876543210'
      },
      {
        id: 2,
        username: 'supervisor1',
        password: 'admin123',
        role: 'supervisor',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '9876543211'
      }
    ];
    storage.set('users', defaultUsers);
  }

  // Default surveys
  if (!storage.get('surveys')) {
    const defaultSurveys = [
      {
        id: 1,
        title: 'Village Infrastructure Survey',
        description: 'Assessment of basic infrastructure facilities',
        createdBy: 'surveyor1',
        createdAt: new Date('2024-01-15').toISOString(),
        status: 'submitted',
        approvedBy: null,
        approvedAt: null,
        formData: {
          villageName: 'Gram Panchayat ABC',
          population: 2500,
          hasElectricity: true,
          hasWaterSupply: true,
          hasRoadConnectivity: true,
          schoolsCount: 2,
          hospitalsCount: 1,
          issues: ['Water quality concerns', 'Road maintenance needed'],
          recommendations: 'Improve water treatment facility and regular road maintenance'
        }
      },
      {
        id: 2,
        title: 'Agricultural Survey',
        description: 'Assessment of agricultural practices and challenges',
        createdBy: 'surveyor1',
        createdAt: new Date('2024-01-10').toISOString(),
        status: 'draft',
        approvedBy: null,
        approvedAt: null,
        formData: {
          villageName: 'Gram Panchayat XYZ',
          totalLandArea: 500,
          cultivatedLand: 350,
          mainCrops: ['Wheat', 'Rice', 'Sugarcane'],
          irrigationMethods: ['Tube well', 'Canal'],
          challenges: ['Water scarcity', 'Pesticide costs'],
          suggestions: 'Promote drip irrigation and organic farming'
        }
      }
    ];
    storage.set('surveys', defaultSurveys);
  }

  // Default messages
  if (!storage.get('messages')) {
    const defaultMessages = [
      {
        id: 1,
        from: 'supervisor1',
        to: 'surveyor1',
        subject: 'Survey Review',
        content: 'Please review the submitted survey and provide additional details about water quality issues.',
        timestamp: new Date('2024-01-16').toISOString(),
        read: false
      },
      {
        id: 2,
        from: 'surveyor1',
        to: 'supervisor1',
        subject: 'Re: Survey Review',
        content: 'I have updated the survey with detailed water quality analysis. Please review.',
        timestamp: new Date('2024-01-16').toISOString(),
        read: true
      }
    ];
    storage.set('messages', defaultMessages);
  }

  // Current user session
  if (!storage.get('currentUser')) {
    storage.set('currentUser', null);
  }
};
