import React, { useContext } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {LogoutButton} from '../Auth0/LogoutButton'

import ChaseCam from '../components/ChaseCam'
import SocketContext from '../../contexts/Socket/Context';

export interface IHomePageProps {};

const HomePage: React.FunctionComponent<IHomePageProps> = (props) => {
  const { user, isAuthenticated } = useAuth0();

  if (!user) {
    return null;
  }

  const { socket, uid, users } = useContext(SocketContext).SocketState;

  return (
    <div>
        <h1>Welcome, {user.name}!</h1>
        <LogoutButton/>

      <h2>Socket IO Information</h2>
      <p>
        Your user ID: <strong>{ uid }</strong><br />
        Users Online: <strong>{ users.length }</strong><br />
        Socket ID: <strong>{ socket?.id }</strong><br />
      </p>
    </div>

  )
};

export default HomePage
