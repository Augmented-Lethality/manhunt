import React from 'react';
import { LoginButton, SignupButton } from '../components/Buttons';

const LandingPage = () => {
  return (
    <div>
      <h1>Welcome to the Landing Page</h1>
      <LoginButton/>
      <SignupButton/>
      <img style={{width:'100vw'}} src="https://img.freepik.com/premium-photo/jet-airplane-with-ready-landing-gear-isolated-white-background_165577-1900.jpg" />
    </div>
  )
};

export default LandingPage
