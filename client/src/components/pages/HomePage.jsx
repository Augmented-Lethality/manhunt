import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {LogoutButton} from '../Auth0/LogoutButton.jsx'

const HomePage = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      <div>
        <h1>Welcome, {user.name}!</h1>
        <LogoutButton/>
      </div>
    )
  )
};

export default HomePage
