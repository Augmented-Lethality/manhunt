import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PageLoader } from './Auth0/Loading';
import { useAuth0 } from '@auth0/auth0-react';
import { AuthenticationGuard } from './Auth0/authentication-guard';
import NotFoundPage from './pages/NotFoundPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';
import GameLobby from './pages/GameLobby';
import FindGamePage from './pages/FindGamePage';
import SocketContextComponent from '../contexts/Socket/SocketContextComponent';

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
      <Route
        path="/home"
        element={
          <SocketContextComponent>
            <AuthenticationGuard component={HomePage} />
          </SocketContextComponent>}
      />
      <Route
        path="/profile"
        element={<AuthenticationGuard component={ProfilePage} />}
      />
      <Route
        path="/findGame"
        element={
          <SocketContextComponent>
            <AuthenticationGuard component={FindGamePage}/>
          </SocketContextComponent>}
      />

          <Route
        path="/onthehunt"
        element={
          <SocketContextComponent>
            <AuthenticationGuard component={GamePage} />
          </SocketContextComponent>}/>

      <Route
        path="/lobby"
        element={
          <SocketContextComponent>
            <AuthenticationGuard component={GameLobby} />
          </SocketContextComponent>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
