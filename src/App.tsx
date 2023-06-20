import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from './Auth0/Loading';
import { useAuth0 } from '@auth0/auth0-react';
import NotFoundPage from './pages/NotFoundPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';
import TestPage from './pages/TestPage';
import GameLobby from './pages/GameLobby';
import EndGame from './pages/EndGame';
import FindGamePage from './pages/FindGamePage';
import SocketComponent from './contexts/Socket/SocketComponent';

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
      <Route path="/home" element={<SocketComponent><HomePage /></SocketComponent>} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/findGame" element={<SocketComponent><FindGamePage /></SocketComponent>} />
      <Route path="/onthehunt" element={<SocketComponent><GamePage /></SocketComponent>} />
      <Route path="/gameover" element={<SocketComponent><EndGame /></SocketComponent>} />
      <Route path="/lobby" element={<SocketComponent><GameLobby /></SocketComponent>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );

};

export default App;
