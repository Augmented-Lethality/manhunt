import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0ProviderWithNavigate } from "./Auth0/auth0-provider-with-navigate";
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const rootElement = document.getElementById('app');

// HTMLElement | null; had to add error handling or has an error
if (!rootElement){
  throw new Error('Failed to find the root element');
};

const root = ReactDOM.createRoot(rootElement);

root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  // </React.StrictMode>
);