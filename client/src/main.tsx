import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './styles/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <App />
  </React.StrictMode>,
)