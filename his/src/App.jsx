import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import AppRouter from './router.jsx';
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
