import React from 'react';
import {LoginButton} from '../Auth0/LoginButton.jsx';
import {SignupButton} from '../Auth0/SignupButton.jsx';

const LandingPage = () => {
  return (
    <div>
      <h1>Welcome to the Landing Page</h1>
      <LoginButton/>
      <SignupButton/>
    </div>
  )
};

export default LandingPage
