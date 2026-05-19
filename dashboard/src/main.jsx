import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid rgba(201,168,76,0.2)',
          fontFamily: 'DM Mono, monospace',
          fontSize: '13px',
        },
        success: { iconTheme: { primary: '#C9A84C', secondary: '#0D0D0D' } },
        error: { iconTheme: { primary: '#E05050', secondary: '#fff' } },
      }}
    />
  </StrictMode>,
)