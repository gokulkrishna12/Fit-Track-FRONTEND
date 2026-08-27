import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import { AuthProvider } from './context/AuthContext.jsx' // Pudhusa import panrom

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* App-a ulla wrap panrom */}
      <App />
    </AuthProvider>
  </StrictMode>,
)