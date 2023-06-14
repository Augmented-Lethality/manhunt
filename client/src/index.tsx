import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0ProviderWithNavigate } from "./components/Auth0/auth0-provider-with-navigate";
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';

import SocketContextComponent from './contexts/Socket/SocketContextComponent';

const rootElement = document.getElementById('app');

// HTMLElement | null; had to add error handling or has an error
if (!rootElement){
  throw new Error('Failed to find the root element');
};

const root = ReactDOM.createRoot(rootElement);

root.render(
  // <React.StrictMode>
  <SocketContextComponent>
        <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </SocketContextComponent>
  // </React.StrictMode>
);