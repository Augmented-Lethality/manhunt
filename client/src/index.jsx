import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0ProviderWithNavigate } from "./components/Auth0/auth0-provider-with-navigate";
import { BrowserRouter } from 'react-router-dom';
import App from './components/App.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>,
);