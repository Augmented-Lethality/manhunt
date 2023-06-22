import React, { useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
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
  const { authId, users } = useContext(SocketContext).SocketState;
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {

    console.log(user)
    const fetchUserData = async () => {
      try {
        // Check if the user exists by sending a POST request instead of a GET request
        const response = await axios.post<UserData>('/Users', {
          username: user?.name,
          email: user?.email,
          authId: user?.sub,
          // Include other user data properties you want to save
        });
        setUserData(response.data);
        // console.log(response);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isAuthenticated && user) {
      fetchUserData();
      const insertName = `${user.given_name || ''} ${user.family_name?.charAt(
        0
      )}`;
      AddName(insertName || '', authId);
    }
  }, [user, isAuthenticated, AddName, authId]);

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
