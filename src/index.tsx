// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n'; // Import the i18n configuration
import { initClarity } from './clarity';


// Initialize Microsoft Clarity
initClarity();


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);







root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
