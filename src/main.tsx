import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

// 1. Chèche eleman 'root' la ansekirite
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    "Eleman 'root' la pa jwenn nan dokiman HTML la. Tanpri asire w ke 'index.html' gen yon <div id=\"root\"></div>."
  );
}

// 2. Anbalaj aplikasyon an nan LanguageProvider
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);