import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0ProviderWithNavigate } from "./Auth0/auth0-provider-with-navigate";
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import GlobalStyle from './styles/GlobalStyle';
import { FontSizeProvider } from './contexts/FontSize';

const rootElement = document.getElementById('app');

// HTMLElement | null; had to add error handling or has an error
if (!rootElement) {
  throw new Error('Failed to find the root element');
};

const root = ReactDOM.createRoot(rootElement);

root.render(
  <BrowserRouter>
    <Auth0ProviderWithNavigate>
      <FontSizeProvider>
        <GlobalStyle />
        <App />
      </FontSizeProvider>
    </Auth0ProviderWithNavigate>
  </BrowserRouter>
);
