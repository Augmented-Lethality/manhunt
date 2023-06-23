import React, { useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import {
  ButtonToProfile,
  ButtonToFindGame,
  ButtonToHostGame,
  LogoutButton,
} from '../components/Buttons';

import SocketContext from '../contexts/Socket/SocketContext';

type UserData = {
  username: string;
  email: string;
  authId: string;
  // Add other user data properties as needed
};

const HomePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const { AddName } = useContext(SocketContext);
  const { uid, users } = useContext(SocketContext).SocketState;
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const postUserData = async () => {
      try {
        // Check if the user exists by sending a POST request instead of a GET request
        const response = await axios.post<UserData>('/Users', {
          username: user?.name,
          email: user?.email,
          authId: user?.sub,
          // Include other user data properties you want to save
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isAuthenticated && user) {
      postUserData();
      const insertName = `${user.given_name || ''} ${user.family_name?.charAt(
        0
      )}`;
      AddName(insertName || '', uid);
    }
  }, [user, isAuthenticated, AddName, uid]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '400px',
        margin: 0,
      }}
    >
      <h1 style={{ color: '#6e6b8c' }}>Welcome Home, {user.given_name}</h1>
      Users Online: {users.length}
      <br />
      <br />
      <ButtonToProfile />
      <ButtonToHostGame />
      <ButtonToFindGame />
      <LogoutButton />
    </div>
  );
};

export default HomePage;
