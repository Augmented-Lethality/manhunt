import React from 'react';
import { Route, Routes } from 'react-router-dom';

// import NotFoundPage from "./pages/NotFoundPage.jsx";

import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';

const App = () => {

  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
  );
};

export default App
