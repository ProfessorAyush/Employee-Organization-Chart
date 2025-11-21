import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { makeServer } from './services/mirage';

// Start MirageJS server in development
if (process.env.NODE_ENV === 'development') {
  makeServer();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
