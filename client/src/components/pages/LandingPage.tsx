import React, { useContext } from 'react';
import {LoginButton} from '../Auth0/LoginButton';
import {SignupButton} from '../Auth0/SignupButton';

import SocketContext from '../../contexts/Socket/Context';

export interface ILandingPageProps {};

const LandingPage: React.FunctionComponent<ILandingPageProps> = (props) => {

  const { socket, uid, users } = useContext(SocketContext).SocketState;

  return (
    <div>
      <h1>Welcome to the Landing Page</h1>
      <LoginButton/>
      <SignupButton/>
      <h2>Socket IO Information</h2>
      <p>
        Your user ID: <strong>{ uid }</strong><br />
        Users Online: <strong>{ users.length }</strong><br />
        Socket ID: <strong>{ socket?.id }</strong><br />
      </p>

    </div>
  )
};

export default LandingPage
