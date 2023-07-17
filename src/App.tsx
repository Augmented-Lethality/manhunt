import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
// import PageLoader from './components/Loading';
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
import TrophyRoom from './pages/TrophyRoom';
import AccessPage from './pages/AccessPage';
import AboutPage from './pages/AboutPage'

import PhoneLoader from '../src/components/Loaders/PhoneLoader'

const App = () => {
  const { isLoading } = useAuth0();
  const [fontSize] = useFontSize();

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
  }, [fontSize]);

  if (isLoading) {
    return (
      <div className="page-layout">
        <PhoneLoader />
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
          </SocketComponent>
        }
      />
      <Route
        path="/findGame"
        element={
          <SocketComponent>
            <AuthenticationGuard component={FindGamePage} />
          </SocketComponent>
        }
      />
      <Route
        path="/onthehunt"
        element={
          <SocketComponent>
            <AuthenticationGuard component={GamePage} />
          </SocketComponent>
        }
      />
      <Route
        path="/gameover"
        element={
          <SocketComponent>
            <AuthenticationGuard component={EndGame} />
          </SocketComponent>
        }
      />
      <Route
        path="/lobby"
        element={
          <SocketComponent>
            <AuthenticationGuard component={GameLobby} />
          </SocketComponent>
        }
      />
      <Route
        path="/access"
        element={
          <SocketComponent>
            <AuthenticationGuard component={AccessPage} />
          </SocketComponent>
        }
      />
      <Route
        path="profile"
        element={
          <SocketComponent>
            <AuthenticationGuard component={ProfilePage} />
          </SocketComponent>
        }
      />
      <Route
        path="/profile/:username"
        element={<AuthenticationGuard component={OtherUserProfilePage} />}
      />
      <Route
        path="/test"
        element={<SocketComponent><AuthenticationGuard component={TestPage} /></SocketComponent>}
      />
      <Route
        path="/trophies"
        element={<AuthenticationGuard component={TrophyRoom} />}
      />
      <Route
        path="/about"
        element={<AboutPage />}
      />
      <Route
        path="/friends"
        element={<SocketComponent>
          <AuthenticationGuard component={FriendsPage} />
        </SocketComponent>
        }
      />
      <Route
        path="/settings"
        element={<AuthenticationGuard component={Settings} />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
