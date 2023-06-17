import React, { useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogoutButton } from '../Auth0/LogoutButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ButtonToProfile, ButtonToFindGame, ButtonHostGame } from '../components/Buttons';

import SocketContext from '../contexts/Socket/SocketContext';

type UserData = {
  username: string;
  email: string;
  authId: string;
  // Add other user data properties as needed
}

const HomePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const { AddName } = useContext(SocketContext);
  const { uid, users } = useContext(SocketContext).SocketState;
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
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
      const insertName = `${ user.given_name || '' } ${ user.family_name?.charAt(0) }`
      AddName( insertName|| '', uid);

    }

  }, []);


  if (!user) {
    return null;
  }
  console.log(user);
  return (
    isAuthenticated && (
      <div>
        <h1>{`Welcome Home, ${user.given_name}`}!</h1>
        Users Online: <strong>{users.length}</strong><br/><br/>
        <ButtonToProfile />
        <ButtonToFindGame />
        <ButtonHostGame />
        <LogoutButton />
      </div>
    )
  );
};

export default HomePage;
