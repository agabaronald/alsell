import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './components/ErrorBoundary'
import Alsel from './Alsel.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Alsel />
    </ErrorBoundary>
  </StrictMode>,
)