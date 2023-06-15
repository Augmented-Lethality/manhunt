import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {LogoutButton} from '../Auth0/LogoutButton'

// import ChaseCam from '../components/ChaseCam'

import ButtonToLobby from '../components/buttons/ButtonToLobby';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!user) {
    return null;
  }
  console.log(user);
  return (
    isAuthenticated && (
      <div>
        <h1>Welcome, {user.name}!</h1>
        <ButtonToLobby />
        <LogoutButton/>
        {/* <ChaseCam /> */}
      </div>
    )
  )
};

export default HomePage
