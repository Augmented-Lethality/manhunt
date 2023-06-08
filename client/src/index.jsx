import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';

import App from './components/App.jsx';
// import { BrowserRouter } from "react-router-dom";

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
    domain="dev-cxttpv5tsynl0jh2.us.auth0.com"
    clientId="TJtAYxTTITDgtZVckBeEds6zN7OPMoiU"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
);