// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';  // Import the correct method
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));  // Create root element

root.render(  // Use createRoot to render the app
  <React.StrictMode>
    <BrowserRouter>  {/* Wrap your app in BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
