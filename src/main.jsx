// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.scss';

// 👇 1. Import Redux Provider and your Store 👇
import { Provider } from 'react-redux';
import { store } from './store/store';

// Keep your existing AuthProvider import
import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👇 2. Wrap the app with Redux Provider 👇 */}
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
)