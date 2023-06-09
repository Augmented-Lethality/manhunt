import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PageLoader } from './Auth0/Loading'
import { useAuth0 } from "@auth0/auth0-react";
import { AuthenticationGuard } from "./Auth0/authentication-guard";
import NotFoundPage from "./pages/NotFoundPage";
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
      </div>
    );
  }

  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<AuthenticationGuard component={HomePage} />} />
        <Route path="/profile" element={<AuthenticationGuard component={ProfilePage} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
  );
};

export default App
