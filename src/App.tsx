import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from './components/Loading';
import { useAuth0 } from '@auth0/auth0-react';
import { AuthenticationGuard } from './Auth0/authentication-guard';
import NotFoundPage from './pages/NotFoundPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';
import TestPage from './pages/TestPage';
import GameLobby from './pages/GameLobby';
import EndGame from './pages/EndGame';
import FindGamePage from './pages/FindGamePage';
import FriendsPage from './pages/FriendsPage';
import OtherUserProfilePage from './pages/OtherUserProfilePage';
import SocketComponent from './contexts/Socket/SocketComponent';
import Settings from './pages/Settings';
import { useFontSize } from './contexts/FontSize';
import { AccessProvider } from './contexts/AccessContext';

const App = () => {
  const { isLoading } = useAuth0();
  const [fontSize] = useFontSize();

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
  }, [fontSize]);

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
      <Route
        path="/home"
        element={
          <SocketComponent>
            <AuthenticationGuard component={HomePage} />
          </SocketComponent>}
      />
      {/* <Route
        path="/profile"
        element={<AuthenticationGuard component={ProfilePage} />}
      /> */}
      <Route
        path="/cat/:poop"
        element={<AuthenticationGuard component={OtherUserProfilePage} />}
      />
      <Route
        path="/test"
        element={<AuthenticationGuard component={TestPage} />}
      />
      <Route
        path="/findGame"
        element={
          <SocketComponent>
            <AuthenticationGuard component={FindGamePage} />
          </SocketComponent>}
      />

      <Route
        path="/onthehunt"
        element={
          <SocketComponent>
            <AuthenticationGuard component={GamePage} />
          </SocketComponent>} />

      <Route
        path="/gameover"
        element={
          <SocketComponent>
            <AuthenticationGuard component={EndGame} />
          </SocketComponent>} />

      <Route
        path="/lobby"
        element={
          <SocketComponent>
            <AuthenticationGuard component={GameLobby} />
          </SocketComponent>
        }
      />
      <Route
        path="/yourcompetition"
        element={
          <SocketComponent>
            <AuthenticationGuard component={FriendsPage} />
          </SocketComponent>
        }
      />
      <Route
        path="/settings"
        element={
          <SocketComponent>
            <AuthenticationGuard component={Settings} />
          </SocketComponent>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
