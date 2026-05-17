import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MusicProvider } from './context/MusicContext';
import { ToastProvider } from './context/ToastContext';
import './styles/global.css';

/**
 * Entry point — wraps App with context providers:
 * - MusicProvider: global audio playback state
 * - ToastProvider: global toast notification system
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MusicProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </MusicProvider>
  </React.StrictMode>
);
