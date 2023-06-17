import React from 'react';
import {LoginButton} from '../Auth0/LoginButton';
import {SignupButton} from '../Auth0/SignupButton';

const LandingPage = () => {
  return (
    <div>
      <h1>Welcome to the Landing Page</h1>
      <LoginButton/>
      <SignupButton/>
      <img src="https://img.freepik.com/premium-photo/jet-airplane-with-ready-landing-gear-isolated-white-background_165577-1900.jpg" />
    </div>
  )
};

export default LandingPage
