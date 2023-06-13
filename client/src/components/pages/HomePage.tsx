import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {LogoutButton} from '../Auth0/LogoutButton'
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!user) {
    return null;
  }
  
  return (
    isAuthenticated && (
      <div>
        <h1>Welcome, {user.name}!</h1>
        <Link to="/profile">
          <button>Go to Profile</button>
        </Link>
        <LogoutButton/>
      </div>
    )
  )
};

export default HomePage
