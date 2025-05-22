import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { CookiesProvider } from 'react-cookie';
import { AuthProvider } from './context/AuthContext';  

import 'react-toastify/dist/ReactToastify.css'

const container = document.getElementById('root');
const root = createRoot(container);

root.render(

      <React.StrictMode>
      <CookiesProvider>
      <AuthProvider>
        <App />
           </AuthProvider>
           </CookiesProvider>
      </React.StrictMode>
      
);


