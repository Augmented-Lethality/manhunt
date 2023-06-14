import React from 'react';
import {LoginButton} from '../Auth0/LoginButton';
import {SignupButton} from '../Auth0/SignupButton';

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
