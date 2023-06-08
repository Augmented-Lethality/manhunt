import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App';

const rootElement = document.getElementById('app');

// HTMLElement | null; had to add error handling or has an error
if (!rootElement){
  throw new Error('Failed to find the root element');
};

const root = ReactDOM.createRoot(rootElement);

root.render(<App />);